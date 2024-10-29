#!/usr/bin/env node
import { VersionManager } from './index.js'
import inquirer from 'inquirer'

const VALID_TYPES = ['major', 'minor', 'patch', 'alpha', 'beta'] as const
type ReleaseType = (typeof VALID_TYPES)[number]

async function createRelease(type: ReleaseType) {
  try {
    const manager = new VersionManager()
    const newTag = await manager.incrementVersion(type)
    console.log(`✨ Created release ${newTag}`)
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

async function interactiveMode() {
  try {
    const { releaseType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'releaseType',
        message: 'Select release type:',
        choices: [
          { name: 'Patch (0.0.x)', value: 'patch' },
          { name: 'Minor (0.x.0)', value: 'minor' },
          { name: 'Major (x.0.0)', value: 'major' },
          { name: 'Alpha (x.x.x-alpha.x)', value: 'alpha' },
          { name: 'Beta (x.x.x-beta.x)', value: 'beta' },
          new inquirer.Separator(),
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ])

    if (releaseType === 'cancel') {
      console.log('Operation cancelled')
      process.exit(0)
    }

    await createRelease(releaseType as ReleaseType)
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

// 处理命令行参数
const arg = process.argv[2]

if (!arg) {
  console.error('Usage: gi <major|minor|patch|alpha|beta> or gi r')
  process.exit(1)
}

if (arg === 'r' || arg === 'release') {
  interactiveMode()
} else if (VALID_TYPES.includes(arg as ReleaseType)) {
  createRelease(arg as ReleaseType)
} else {
  console.error('Usage: gi <major|minor|patch|alpha|beta> or gi r')
  process.exit(1)
}
