/**
 * Convert chassis pattern modules from string arrays to object format
 *
 * This script transforms:
 * - Simple strings to { name: "...", count: 1 }
 * - Repeated items to single entry with count > 1
 */

import fs from 'fs'
import path from 'path'

interface ModulePattern {
  name: string
  count: number
  preselectedChoices?: { [id: string]: string }
}

interface Pattern {
  name: string
  description?: string
  legalStarting?: boolean
  systems: ModulePattern[]
  modules: ModulePattern[] | string[]
  drone?: {
    systems: string[]
    modules: string[]
  }
}

interface Chassis {
  id: string
  name: string
  source: string
  page: number
  stats: Record<string, unknown>
  actions: Array<Record<string, unknown>>
  description: string
  patterns: Pattern[]
}

const dataPath = path.join(process.cwd(), 'data', 'chassis.json')
const chassisData: Chassis[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

console.log('🔧 Converting chassis pattern modules to new format...\n')

// Convert string array to object array with counts
function convertModulesArray(
  modules: string[] | ModulePattern[]
): ModulePattern[] {
  // If already converted, return as-is
  if (modules.length > 0 && typeof modules[0] === 'object') {
    return modules as ModulePattern[]
  }

  const stringArray = modules as string[]
  const moduleCounts = new Map<string, number>()

  // Count occurrences
  for (const module of stringArray) {
    moduleCounts.set(module, (moduleCounts.get(module) || 0) + 1)
  }

  // Convert to array of objects
  const result: ModulePattern[] = []
  for (const [name, count] of moduleCounts.entries()) {
    result.push({ name, count })
  }

  return result
}

// Process all chassis
let totalPatterns = 0
let convertedPatterns = 0

for (const chassis of chassisData) {
  console.log(`Processing ${chassis.name}...`)

  for (const pattern of chassis.patterns) {
    totalPatterns++

    // Convert modules array
    const oldModules = pattern.modules
    const newModules = convertModulesArray(oldModules)

    // Check if conversion happened
    if (JSON.stringify(oldModules) !== JSON.stringify(newModules)) {
      pattern.modules = newModules
      convertedPatterns++
      console.log(`  ✓ Converted ${pattern.name}`)

      // Show details for modules with count > 1
      const repeatedModules = newModules.filter((m) => m.count > 1)
      if (repeatedModules.length > 0) {
        for (const mod of repeatedModules) {
          console.log(`    - ${mod.name} x${mod.count}`)
        }
      }
    }
  }
}

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(chassisData, null, 2) + '\n', 'utf-8')

console.log(`\n✅ Conversion complete!`)
console.log(`   Total patterns: ${totalPatterns}`)
console.log(`   Converted: ${convertedPatterns}`)
console.log(`   Unchanged: ${totalPatterns - convertedPatterns}`)
