#!/usr/bin/env node
import { VersionManager } from './index.js'

const type = process.argv[2] as 'major' | 'minor' | 'patch'

if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Usage: version-manager <major|minor|patch>')
  process.exit(1)
}

try {
  const manager = new VersionManager()
  const newTag = await manager.incrementVersion(type)
  console.log(`Created release ${newTag}`)
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
}
