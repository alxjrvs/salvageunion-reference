/**
 * Fix preselectedChoices to be objects with ID as key and value as the choice name
 */

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

interface PatternItem {
  name: string
  count?: number
  preselectedChoices?: string | { [id: string]: string }
}

interface Pattern {
  name: string
  description?: string
  legalStarting?: boolean
  systems: PatternItem[]
  modules: PatternItem[]
}

interface Chassis {
  patterns: Pattern[]
}

const chassisPath = path.join(process.cwd(), 'data', 'chassis.json')
const systemsPath = path.join(process.cwd(), 'data', 'systems.json')

const chassisData: Chassis[] = JSON.parse(fs.readFileSync(chassisPath, 'utf-8'))
const systemsData = JSON.parse(fs.readFileSync(systemsPath, 'utf-8'))

console.log('🔧 Converting preselectedChoices strings to objects...\n')

// Build a map of custom system option names to their IDs
const customSystemOptionMap = new Map<string, string>()

for (const system of systemsData) {
  if (system.choices) {
    for (const choice of system.choices) {
      if (choice.customSystemOptions) {
        for (const option of choice.customSystemOptions) {
          customSystemOptionMap.set(option.name, option.id)
        }
      }
    }
  }
}

console.log(`Found ${customSystemOptionMap.size} custom system options\n`)

let fixedCount = 0

for (const chassis of chassisData) {
  for (const pattern of chassis.patterns) {
    // Process systems
    for (const system of pattern.systems) {
      if (system.preselectedChoices) {
        // If it's a string, convert to object with ID as key
        if (typeof system.preselectedChoices === 'string') {
          const choiceName = system.preselectedChoices
          const id = customSystemOptionMap.get(choiceName)

          if (id) {
            system.preselectedChoices = { [id]: choiceName }
            console.log(
              `✓ Fixed: ${choiceName} (found ID: ${id.substring(0, 8)}...)`
            )
          } else {
            const newId = randomUUID()
            system.preselectedChoices = { [newId]: choiceName }
            console.log(
              `✓ Fixed: ${choiceName} (generated new ID: ${newId.substring(0, 8)}...)`
            )
          }
          fixedCount++
        }
      }
    }

    // Process modules (in case there are any)
    for (const module of pattern.modules) {
      if (module.preselectedChoices) {
        // If it's a string, convert to object with ID as key
        if (typeof module.preselectedChoices === 'string') {
          const choiceName = module.preselectedChoices
          const id = customSystemOptionMap.get(choiceName)

          if (id) {
            module.preselectedChoices = { [id]: choiceName }
            console.log(
              `✓ Fixed: ${choiceName} (found ID: ${id.substring(0, 8)}...)`
            )
          } else {
            const newId = randomUUID()
            module.preselectedChoices = { [newId]: choiceName }
            console.log(
              `✓ Fixed: ${choiceName} (generated new ID: ${newId.substring(0, 8)}...)`
            )
          }
          fixedCount++
        }
      }
    }
  }
}

// Write back to file
fs.writeFileSync(
  chassisPath,
  JSON.stringify(chassisData, null, 2) + '\n',
  'utf-8'
)

console.log(`\n✅ Conversion complete!`)
console.log(`   Total preselectedChoices entries fixed: ${fixedCount}`)
