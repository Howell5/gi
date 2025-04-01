import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import * as readline from 'node:readline'

const execAsync = promisify(exec)

export type ReleaseType = 'major' | 'minor' | 'patch' | 'alpha' | 'beta'

export class VersionManager {
  private createReadlineInterface() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  private async askQuestion(
    rl: readline.Interface,
    question: string
  ): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer)
      })
    })
  }

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

    // 处理没有标签的情况
    if (!currentTag) {
      const rl = this.createReadlineInterface()

      try {
        const createNew = await this.askQuestion(
          rl,
          'No valid version tag found. Do you want to create a new one? (y/n): '
        )

        if (
          createNew.toLowerCase() !== 'y' &&
          createNew.toLowerCase() !== 'yes'
        ) {
          rl.close()
          throw new Error('操作已取消')
        }

        const initialVersion = await this.askQuestion(
          rl,
          'Input the initial version (e.g. v1.0.0): '
        )

        rl.close()

        // 验证用户输入的版本格式
        const versionRegex = /^v\d+\.\d+\.\d+$/
        if (!versionRegex.test(initialVersion)) {
          throw new Error('无效的版本格式。请使用格式 vX.Y.Z')
        }

        await execAsync(`glab release create ${initialVersion}`)
        return initialVersion
      } catch (error) {
        rl.close()
        throw error
      }
    }

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
