import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export type ReleaseType = 'major' | 'minor' | 'patch' | 'alpha' | 'beta'

export class VersionManager {
  async incrementVersion(type: ReleaseType): Promise<string> {
    try {
      await execAsync('which glab')
    } catch {
      throw new Error(
        'glab is not installed. Please install it first: brew install glab'
      )
    }

    const { stdout } = await execAsync(
      "git ls-remote --sort='version:refname' --tags | awk '/^.*tags\\/v[0-9]+\\.[0-9]+\\.[0-9]+(-[a-zA-Z]+\\.[0-9]+)?$/{print $2}' | tail -n1"
    )

    const currentTag = stdout.trim()
    const match = currentTag.match(
      /v(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z]+)\.(\d+))?/
    )

    if (!match) {
      throw new Error('No valid version tag found')
    }

    // 明确指定类型
    const [, majorStr, minorStr, patchStr, preRelease, preReleaseNumStr] = match
    const major = Number(majorStr)
    const minor = Number(minorStr)
    const patch = Number(patchStr)
    const preReleaseNum = preReleaseNumStr ? Number(preReleaseNumStr) : 0

    let newTag: string

    switch (type) {
      case 'major':
        newTag = `v${major + 1}.0.0`
        break
      case 'minor':
        newTag = `v${major}.${minor + 1}.0`
        break
      case 'patch':
        newTag = `v${major}.${minor}.${patch + 1}`
        break
      case 'alpha':
        if (preRelease === 'alpha') {
          newTag = `v${major}.${minor}.${patch}-alpha.${preReleaseNum + 1}`
        } else {
          newTag = `v${major}.${minor}.${patch + 1}-alpha.0`
        }
        break
      case 'beta':
        if (preRelease === 'beta') {
          newTag = `v${major}.${minor}.${patch}-beta.${preReleaseNum + 1}`
        } else {
          newTag = `v${major}.${minor}.${patch + 1}-beta.0`
        }
        break
      default:
        throw new Error(`Invalid release type: ${type}`)
    }

    await execAsync(`glab release create ${newTag}`)
    return newTag
  }
}
