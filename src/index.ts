// src/index.ts
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export type ReleaseType = 'major' | 'minor' | 'patch'

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
      "git ls-remote --sort='version:refname' --tags | awk '/^.*tags\\/v[0-9]+\\.[0-9]+\\.[0-9]+$/{print $2}' | tail -n1"
    )

    const currentTag = stdout.trim()
    const match = currentTag.match(/v(\d+)\.(\d+)\.(\d+)/)

    if (!match) {
      throw new Error('No valid version tag found')
    }

    const [, major, minor, patch] = match.map(Number)
    const newTag =
      type === 'major'
        ? `v${major + 1}.0.0`
        : type === 'minor'
          ? `v${major}.${minor + 1}.0`
          : `v${major}.${minor}.${patch + 1}`

    await execAsync(`glab release create ${newTag}`)
    return newTag
  }
}
