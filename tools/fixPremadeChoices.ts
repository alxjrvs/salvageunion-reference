/**
 * Fix premadeChoice to be objects with id and name instead of strings
 */

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

interface PremadeChoice {
  id: string
  name: string
}

interface PatternItem {
  name: string
  count?: number
  premadeChoice?: string | PremadeChoice
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

console.log('🔧 Converting premadeChoice strings to objects...\n')

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
      if (system.premadeChoice && typeof system.premadeChoice === 'string') {
        const choiceName = system.premadeChoice
        
        // Check if this is a custom system option with an ID
        const id = customSystemOptionMap.get(choiceName)
        
        if (id) {
          // Use the actual ID from custom system options
          system.premadeChoice = {
            id,
            name: choiceName,
          }
          console.log(`✓ Fixed: ${choiceName} (found ID: ${id.substring(0, 8)}...)`)
        } else {
          // Generate a new UUID for flavor text choices
          const newId = randomUUID()
          system.premadeChoice = {
            id: newId,
            name: choiceName,
          }
          console.log(`✓ Fixed: ${choiceName} (generated new ID: ${newId.substring(0, 8)}...)`)
        }
        
        fixedCount++
      }
    }
    
    // Process modules (in case there are any)
    for (const module of pattern.modules) {
      if (module.premadeChoice && typeof module.premadeChoice === 'string') {
        const choiceName = module.premadeChoice
        const id = customSystemOptionMap.get(choiceName)
        
        if (id) {
          module.premadeChoice = {
            id,
            name: choiceName,
          }
          console.log(`✓ Fixed: ${choiceName} (found ID: ${id.substring(0, 8)}...)`)
        } else {
          const newId = randomUUID()
          module.premadeChoice = {
            id: newId,
            name: choiceName,
          }
          console.log(`✓ Fixed: ${choiceName} (generated new ID: ${newId.substring(0, 8)}...)`)
        }
        
        fixedCount++
      }
    }
  }
}

// Write back to file
fs.writeFileSync(chassisPath, JSON.stringify(chassisData, null, 2) + '\n', 'utf-8')

console.log(`\n✅ Conversion complete!`)
console.log(`   Total premadeChoice entries fixed: ${fixedCount}`)

