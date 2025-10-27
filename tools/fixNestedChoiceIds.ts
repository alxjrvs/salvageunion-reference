#!/usr/bin/env tsx

/**
 * Fix all nested choice IDs in data files to be UUIDs
 * This script finds all "id" fields in nested "choices" arrays and replaces them with UUIDs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

interface Choice {
  id: string
  name: string
  description: string
  schema: string
}

interface NPC {
  position: string
  description: string
  hitPoints?: number
  choices?: Choice[]
}

interface Ability {
  name: string
  description: string
  choices?: Choice[]
}

interface DataItem {
  id?: string
  npc?: NPC
  abilities?: Ability[]
  choices?: Choice[]
  [key: string]: unknown
}

function fixChoiceIds(data: DataItem[]): {
  count: number
  replacements: Array<{ old: string; new: string }>
} {
  let count = 0
  const replacements: Array<{ old: string; new: string }> = []

  data.forEach((item) => {
    // Fix choices at root level
    if (item.choices && Array.isArray(item.choices)) {
      item.choices.forEach((choice) => {
        if (
          choice.id &&
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            choice.id
          )
        ) {
          const oldId = choice.id
          const newId = randomUUID()
          choice.id = newId
          replacements.push({ old: oldId, new: newId })
          count++
        }
      })
    }

    // Fix choices in NPC
    if (item.npc?.choices && Array.isArray(item.npc.choices)) {
      item.npc.choices.forEach((choice) => {
        if (
          choice.id &&
          !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            choice.id
          )
        ) {
          const oldId = choice.id
          const newId = randomUUID()
          choice.id = newId
          replacements.push({ old: oldId, new: newId })
          count++
        }
      })
    }

    // Fix choices in abilities
    if (item.abilities && Array.isArray(item.abilities)) {
      item.abilities.forEach((ability) => {
        if (ability.choices && Array.isArray(ability.choices)) {
          ability.choices.forEach((choice) => {
            if (
              choice.id &&
              !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                choice.id
              )
            ) {
              const oldId = choice.id
              const newId = randomUUID()
              choice.id = newId
              replacements.push({ old: oldId, new: newId })
              count++
            }
          })
        }
      })
    }
  })

  return { count, replacements }
}

console.log('🔧 Fixing nested choice IDs to UUIDs...\n')

// Fix crawler-bays.json
console.log('📝 Fixing crawler-bays.json...')
const crawlerBaysPath = join(process.cwd(), 'data', 'crawler-bays.json')
const crawlerBays = JSON.parse(
  readFileSync(crawlerBaysPath, 'utf-8')
) as DataItem[]
const crawlerBaysResult = fixChoiceIds(crawlerBays)
if (crawlerBaysResult.count > 0) {
  crawlerBaysResult.replacements.forEach(({ old, new: newId }) => {
    console.log(`  ✓ "${old}" → ${newId}`)
  })
  writeFileSync(crawlerBaysPath, JSON.stringify(crawlerBays, null, 2) + '\n')
  console.log(`  ✅ Fixed ${crawlerBaysResult.count} choice IDs\n`)
} else {
  console.log('  ✅ No invalid choice IDs found\n')
}

// Fix crawlers.json
console.log('📝 Fixing crawlers.json...')
const crawlersPath = join(process.cwd(), 'data', 'crawlers.json')
const crawlers = JSON.parse(readFileSync(crawlersPath, 'utf-8')) as DataItem[]
const crawlersResult = fixChoiceIds(crawlers)
if (crawlersResult.count > 0) {
  crawlersResult.replacements.forEach(({ old, new: newId }) => {
    console.log(`  ✓ "${old}" → ${newId}`)
  })
  writeFileSync(crawlersPath, JSON.stringify(crawlers, null, 2) + '\n')
  console.log(`  ✅ Fixed ${crawlersResult.count} choice IDs\n`)
} else {
  console.log('  ✅ No invalid choice IDs found\n')
}

// Check all other data files for nested choices
const otherFiles = [
  'abilities.json',
  'ability-tree-requirements.json',
  'bio-titans.json',
  'chassis.json',
  'classes.advanced.json',
  'classes.core.json',
  'classes.hybrid.json',
  'creatures.json',
  'drones.json',
  'equipment.json',
  'keywords.json',
  'meld.json',
  'modules.json',
  'npcs.json',
  'roll-tables.json',
  'squads.json',
  'systems.json',
  'traits.json',
  'vehicles.json',
]

let totalOtherFixed = 0
for (const filename of otherFiles) {
  const filePath = join(process.cwd(), 'data', filename)
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as DataItem[]
  const result = fixChoiceIds(data)
  if (result.count > 0) {
    console.log(`📝 Fixing ${filename}...`)
    result.replacements.forEach(({ old, new: newId }) => {
      console.log(`  ✓ "${old}" → ${newId}`)
    })
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
    console.log(`  ✅ Fixed ${result.count} choice IDs\n`)
    totalOtherFixed += result.count
  }
}

if (totalOtherFixed === 0) {
  console.log('✅ No invalid choice IDs found in other data files\n')
}

const totalFixed =
  crawlerBaysResult.count + crawlersResult.count + totalOtherFixed
console.log(`✅ Total choice IDs fixed: ${totalFixed}`)
console.log(
  '\n💡 Run `tsx tools/checkUniqueIds.ts` to verify all IDs are now valid and unique.'
)
