/**
 * Remove "count": 1 from all pattern systems and modules
 * Keep only entries where count > 1
 */

import fs from 'fs'
import path from 'path'

interface PatternItem {
  name: string
  count: number
  preselectedChoices?: { [id: string]: string }
}

interface Pattern {
  name: string
  description?: string
  legalStarting?: boolean
  systems: PatternItem[]
  modules: PatternItem[]
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
const fileContent = fs.readFileSync(dataPath, 'utf-8')
let chassisData: Chassis[]

try {
  chassisData = JSON.parse(fileContent)
} catch (error) {
  console.error('❌ Error parsing JSON:', error)
  console.error('File content length:', fileContent.length)
  process.exit(1)
}

console.log('🔧 Removing "count": 1 from all pattern items...\n')

let totalRemoved = 0

for (const chassis of chassisData) {
  console.log(`Processing ${chassis.name}...`)

  for (const pattern of chassis.patterns) {
    // Process systems
    for (const system of pattern.systems) {
      if (system.count === 1) {
        delete (system as { count?: number }).count
        totalRemoved++
      }
    }

    // Process modules
    for (const module of pattern.modules) {
      if (module.count === 1) {
        delete (module as { count?: number }).count
        totalRemoved++
      }
    }
  }
}

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(chassisData, null, 2) + '\n', 'utf-8')

console.log(`\n✅ Cleanup complete!`)
console.log(`   Total "count": 1 entries removed: ${totalRemoved}`)
