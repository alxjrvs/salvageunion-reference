import { SalvageUnionReference } from '../lib/index.js'

const { Systems, Modules } = SalvageUnionReference

// List of incorrect names from the validation
const incorrectNames = [
  'FM-3 Flamethrower × 2',
  'Self-Destruct Module',
  'Weapon Link (FM-3 Flamethrower × 2)',
  'Loudspeaker',
  'Heat Sink × 2',
  'Barometric Sensor',
  'Mech Melee Armament (Iron Spear)',
  'Mech Melee Armament (Steel Axe)',
  'Concealed Equipment Locker',
  'Industrial Body Kit (Mule)',
  'Mech Melee Armament (Great Sword)',
  'Automated Turret System - Green Laser',
  'Stabilising',
  'Advanced Targeting Array',
  'Aeon Shield Dome',
  'Advanced Targeting',
]

console.log('🔍 Finding correct names for mismatched items...\n')

for (const incorrectName of incorrectNames) {
  console.log(`\n❌ "${incorrectName}"`)

  // Search in systems
  const systemMatches = Systems.all().filter((s) => {
    const nameLower = s.name.toLowerCase()
    const searchLower = incorrectName.toLowerCase()
    return (
      nameLower.includes(searchLower) ||
      searchLower.includes(nameLower) ||
      nameLower
        .replace(/[^a-z0-9]/g, '')
        .includes(searchLower.replace(/[^a-z0-9]/g, ''))
    )
  })

  if (systemMatches.length > 0) {
    console.log('   Possible System matches:')
    systemMatches.forEach((s) => console.log(`   ✓ "${s.name}"`))
  }

  // Search in modules
  const moduleMatches = Modules.all().filter((m) => {
    const nameLower = m.name.toLowerCase()
    const searchLower = incorrectName.toLowerCase()
    return (
      nameLower.includes(searchLower) ||
      searchLower.includes(nameLower) ||
      nameLower
        .replace(/[^a-z0-9]/g, '')
        .includes(searchLower.replace(/[^a-z0-9]/g, ''))
    )
  })

  if (moduleMatches.length > 0) {
    console.log('   Possible Module matches:')
    moduleMatches.forEach((m) => console.log(`   ✓ "${m.name}"`))
  }

  if (systemMatches.length === 0 && moduleMatches.length === 0) {
    console.log('   ⚠️  No matches found - may need manual lookup')
  }
}

console.log('\n\n📋 All System Names:')
Systems.all()
  .map((s) => s.name)
  .sort()
  .forEach((name) => console.log(`   - ${name}`))

console.log('\n\n📋 All Module Names:')
Modules.all()
  .map((m) => m.name)
  .sort()
  .forEach((name) => console.log(`   - ${name}`))
