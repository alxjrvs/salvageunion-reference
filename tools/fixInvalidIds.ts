#!/usr/bin/env tsx

/**
 * Fix all invalid IDs in data files
 * This script:
 * 1. Generates new UUIDs for invalid IDs
 * 2. Fixes duplicate IDs between classes.advanced.json and classes.core.json
 * 3. Writes the fixed data back to the files
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

interface DataItem {
  id?: string
  [key: string]: unknown
}

// Generate new UUIDs for specific files
const newUUIDs = {
  // abilities.json - last 7 items (indices 96-102)
  abilities: [
    randomUUID(), // index 96
    randomUUID(), // index 97
    randomUUID(), // index 98
    randomUUID(), // index 99
    randomUUID(), // index 100
    randomUUID(), // index 101
    randomUUID(), // index 102
  ],
  // crawler-bays.json - all 10 items
  crawlerBays: [
    randomUUID(), // command-bay
    randomUUID(), // mech-bay
    randomUUID(), // storage-bay
    randomUUID(), // armament-bay
    randomUUID(), // crafting-bay
    randomUUID(), // trading-bay
    randomUUID(), // med-bay
    randomUUID(), // pilot-bay
    randomUUID(), // armoury
    randomUUID(), // cantina
  ],
  // crawler-tech-levels.json - all 6 items
  crawlerTechLevels: [
    randomUUID(), // crawler-tech-1
    randomUUID(), // crawler-tech-2
    randomUUID(), // crawler-tech-3
    randomUUID(), // crawler-tech-4
    randomUUID(), // crawler-tech-5
    randomUUID(), // crawler-tech-6
  ],
  // roll-tables.json - 5 invalid items (indices 15-18, 21)
  rollTables: [
    randomUUID(), // index 15
    randomUUID(), // index 16
    randomUUID(), // index 17
    randomUUID(), // index 18
    randomUUID(), // index 21
  ],
  // classes.advanced.json - all 5 items need new UUIDs (duplicates with classes.core.json)
  classesAdvanced: [
    randomUUID(), // Advanced Engineer
    randomUUID(), // Advanced Hacker
    randomUUID(), // Advanced Hauler
    randomUUID(), // Advanced Scout
    randomUUID(), // Advanced Soldier
  ],
}

console.log('🔧 Fixing invalid IDs...\n')

// Fix abilities.json
console.log('📝 Fixing abilities.json...')
const abilitiesPath = join(process.cwd(), 'data', 'abilities.json')
const abilities = JSON.parse(readFileSync(abilitiesPath, 'utf-8')) as DataItem[]
const invalidAbilityIndices = [96, 97, 98, 99, 100, 101, 102]
invalidAbilityIndices.forEach((index, i) => {
  const oldId = abilities[index].id
  abilities[index].id = newUUIDs.abilities[i]
  console.log(`  ✓ Index ${index}: ${oldId} → ${newUUIDs.abilities[i]}`)
})
writeFileSync(abilitiesPath, JSON.stringify(abilities, null, 2) + '\n')
console.log('  ✅ abilities.json fixed\n')

// Fix crawler-bays.json
console.log('📝 Fixing crawler-bays.json...')
const crawlerBaysPath = join(process.cwd(), 'data', 'crawler-bays.json')
const crawlerBays = JSON.parse(
  readFileSync(crawlerBaysPath, 'utf-8')
) as DataItem[]
crawlerBays.forEach((item, index) => {
  const oldId = item.id
  item.id = newUUIDs.crawlerBays[index]
  console.log(`  ✓ Index ${index}: ${oldId} → ${newUUIDs.crawlerBays[index]}`)
})
writeFileSync(crawlerBaysPath, JSON.stringify(crawlerBays, null, 2) + '\n')
console.log('  ✅ crawler-bays.json fixed\n')

// Fix crawler-tech-levels.json
console.log('📝 Fixing crawler-tech-levels.json...')
const crawlerTechLevelsPath = join(
  process.cwd(),
  'data',
  'crawler-tech-levels.json'
)
const crawlerTechLevels = JSON.parse(
  readFileSync(crawlerTechLevelsPath, 'utf-8')
) as DataItem[]
crawlerTechLevels.forEach((item, index) => {
  const oldId = item.id
  item.id = newUUIDs.crawlerTechLevels[index]
  console.log(
    `  ✓ Index ${index}: ${oldId} → ${newUUIDs.crawlerTechLevels[index]}`
  )
})
writeFileSync(
  crawlerTechLevelsPath,
  JSON.stringify(crawlerTechLevels, null, 2) + '\n'
)
console.log('  ✅ crawler-tech-levels.json fixed\n')

// Fix roll-tables.json
console.log('📝 Fixing roll-tables.json...')
const rollTablesPath = join(process.cwd(), 'data', 'roll-tables.json')
const rollTables = JSON.parse(
  readFileSync(rollTablesPath, 'utf-8')
) as DataItem[]
const invalidRollTableIndices = [15, 16, 17, 18, 21]
invalidRollTableIndices.forEach((index, i) => {
  const oldId = rollTables[index].id
  rollTables[index].id = newUUIDs.rollTables[i]
  console.log(`  ✓ Index ${index}: ${oldId} → ${newUUIDs.rollTables[i]}`)
})
writeFileSync(rollTablesPath, JSON.stringify(rollTables, null, 2) + '\n')
console.log('  ✅ roll-tables.json fixed\n')

// Fix classes.advanced.json (duplicates with classes.core.json)
console.log('📝 Fixing classes.advanced.json (duplicate IDs)...')
const classesAdvancedPath = join(process.cwd(), 'data', 'classes.advanced.json')
const classesAdvanced = JSON.parse(
  readFileSync(classesAdvancedPath, 'utf-8')
) as DataItem[]
classesAdvanced.forEach((item, index) => {
  const oldId = item.id
  item.id = newUUIDs.classesAdvanced[index]
  console.log(
    `  ✓ Index ${index} (${item.name}): ${oldId} → ${newUUIDs.classesAdvanced[index]}`
  )
})
writeFileSync(
  classesAdvancedPath,
  JSON.stringify(classesAdvanced, null, 2) + '\n'
)
console.log('  ✅ classes.advanced.json fixed\n')

console.log('✅ All invalid IDs have been fixed!')
console.log(
  '\n💡 Run `tsx tools/checkUniqueIds.ts` to verify all IDs are now valid and unique.'
)
