/**
 * Search API Demo
 *
 * This file demonstrates how to use the search functionality
 * in the salvageunion-reference package.
 */

import { SalvageUnionReference, search, searchIn, getSuggestions } from '../lib/index.js'

console.log('🔍 Salvage Union Search API Demo\n')

// Example 1: Basic search across all schemas
console.log('Example 1: Search for "laser" across all schemas')
console.log('=' .repeat(60))
const laserResults = search({ query: 'laser' })
console.log(`Found ${laserResults.length} results`)
console.log('\nTop 5 results:')
laserResults.slice(0, 5).forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaTitle})`)
  console.log(`   Score: ${result.matchScore}, Matched: ${result.matchedFields.join(', ')}`)
})
console.log()

// Example 2: Search within specific schemas
console.log('Example 2: Search for "targeting" in systems and modules only')
console.log('=' .repeat(60))
const targetingResults = search({
  query: 'targeting',
  schemas: ['systems', 'modules'],
})
console.log(`Found ${targetingResults.length} results`)
targetingResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaName})`)
})
console.log()

// Example 3: Limited search results
console.log('Example 3: Search for "damage" with limit of 10')
console.log('=' .repeat(60))
const damageResults = search({
  query: 'damage',
  limit: 10,
})
console.log(`Found ${damageResults.length} results (limited to 10)`)
damageResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaTitle})`)
})
console.log()

// Example 4: Search within a specific schema using searchIn
console.log('Example 4: Search for "missile" in systems only')
console.log('=' .repeat(60))
const missileResults = searchIn('systems', 'missile')
console.log(`Found ${missileResults.length} systems`)
missileResults.forEach((system, i) => {
  console.log(`${i + 1}. ${system.name}`)
})
console.log()

// Example 5: Get search suggestions
console.log('Example 5: Get suggestions for "las"')
console.log('=' .repeat(60))
const suggestions = getSuggestions('las', { limit: 10 })
console.log(`Found ${suggestions.length} suggestions:`)
suggestions.forEach((suggestion, i) => {
  console.log(`${i + 1}. ${suggestion}`)
})
console.log()

// Example 6: Case-sensitive search
console.log('Example 6: Case-sensitive search for "Railgun"')
console.log('=' .repeat(60))
const railgunResults = search({
  query: 'Railgun',
  caseSensitive: true,
})
console.log(`Found ${railgunResults.length} results (case-sensitive)`)
railgunResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaTitle})`)
})
console.log()

// Example 7: Using static methods on SalvageUnionReference
console.log('Example 7: Using SalvageUnionReference.search()')
console.log('=' .repeat(60))
const staticResults = SalvageUnionReference.search({
  query: 'shield',
  limit: 5,
})
console.log(`Found ${staticResults.length} results`)
staticResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaTitle})`)
})
console.log()

// Example 8: Detailed result inspection
console.log('Example 8: Detailed inspection of search results')
console.log('=' .repeat(60))
const detailedResults = search({
  query: 'railgun',
  limit: 1,
})
if (detailedResults.length > 0) {
  const result = detailedResults[0]
  console.log('Result details:')
  console.log(`  Name: ${result.entityName}`)
  console.log(`  ID: ${result.entityId}`)
  console.log(`  Schema: ${result.schemaName} (${result.schemaTitle})`)
  console.log(`  Match Score: ${result.matchScore}`)
  console.log(`  Matched Fields: ${result.matchedFields.join(', ')}`)
  console.log(`  Entity:`, JSON.stringify(result.entity, null, 2))
}
console.log()

// Example 9: Search by description
console.log('Example 9: Search for items with "fire" in description')
console.log('=' .repeat(60))
const fireResults = search({ query: 'fire', limit: 10 })
const descriptionMatches = fireResults.filter((r) =>
  r.matchedFields.includes('description')
)
console.log(`Found ${descriptionMatches.length} items with "fire" in description`)
descriptionMatches.forEach((result, i) => {
  console.log(`${i + 1}. ${result.entityName} (${result.schemaTitle})`)
})
console.log()

// Example 10: Combining search with other queries
console.log('Example 10: Find all Tech Level 3 systems with "laser" in name')
console.log('=' .repeat(60))
const laserSystems = searchIn('systems', 'laser')
const techLevel3Lasers = laserSystems.filter((s) => s.techLevel === 3)
console.log(`Found ${techLevel3Lasers.length} Tech Level 3 laser systems`)
techLevel3Lasers.forEach((system, i) => {
  console.log(`${i + 1}. ${system.name} (Tech Level ${system.techLevel})`)
})
console.log()

console.log('✨ Demo complete!')

