import { SalvageUnionReference } from '../lib/index.js'

console.log('🔍 Validating chassis pattern systems and modules...\n')

const { Chassis, Systems, Modules } = SalvageUnionReference

// Get all system and module names
const systemNames = new Set(Systems.all().map((s) => s.name))
const moduleNames = new Set(Modules.all().map((m) => m.name))

let hasErrors = false
let totalPatterns = 0
let totalSystems = 0
let totalModules = 0

// Check each chassis
for (const chassis of Chassis.all()) {
  if (!chassis.patterns || chassis.patterns.length === 0) {
    continue
  }

  for (const pattern of chassis.patterns) {
    totalPatterns++

    // Check systems
    if (pattern.systems && pattern.systems.length > 0) {
      for (const systemName of pattern.systems) {
        totalSystems++
        if (!systemNames.has(systemName)) {
          hasErrors = true
          console.log(
            `❌ ${chassis.name} - ${pattern.name}: System "${systemName}" not found`
          )
        }
      }
    }

    // Check modules
    if (pattern.modules && pattern.modules.length > 0) {
      for (const moduleName of pattern.modules) {
        totalModules++
        if (!moduleNames.has(moduleName)) {
          hasErrors = true
          console.log(
            `❌ ${chassis.name} - ${pattern.name}: Module "${moduleName}" not found`
          )
        }
      }
    }

    // Check drone systems and modules if present
    if (pattern.drone) {
      if (pattern.drone.systems && pattern.drone.systems.length > 0) {
        for (const systemName of pattern.drone.systems) {
          totalSystems++
          if (!systemNames.has(systemName)) {
            hasErrors = true
            console.log(
              `❌ ${chassis.name} - ${pattern.name} (Drone): System "${systemName}" not found`
            )
          }
        }
      }

      if (pattern.drone.modules && pattern.drone.modules.length > 0) {
        for (const moduleName of pattern.drone.modules) {
          totalModules++
          if (!moduleNames.has(moduleName)) {
            hasErrors = true
            console.log(
              `❌ ${chassis.name} - ${pattern.name} (Drone): Module "${moduleName}" not found`
            )
          }
        }
      }
    }
  }
}

console.log('\n📊 Summary:')
console.log(`   Patterns checked: ${totalPatterns}`)
console.log(`   System references: ${totalSystems}`)
console.log(`   Module references: ${totalModules}`)

if (hasErrors) {
  console.log('\n❌ Validation failed - mismatched names found')
  process.exit(1)
} else {
  console.log('\n✅ All chassis pattern systems and modules match!')
  process.exit(0)
}
