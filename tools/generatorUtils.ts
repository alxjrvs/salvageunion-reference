/**
 * Shared utilities for code generators
 * Reduces duplication across generator scripts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Schema index entry structure
 */
export interface SchemaIndexEntry {
  id: string
  title: string
  description: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
  displayName: string
}

/**
 * Schema index structure
 */
export interface SchemaIndex {
  $schema: string
  title: string
  description: string
  version: string
  generated: string
  schemas: SchemaIndexEntry[]
}

/**
 * Get __dirname equivalent for ES modules
 */
export function getDirname(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl)
  return path.dirname(__filename)
}

/**
 * Load and parse the schema index
 */
export function loadSchemaIndex(dirname: string): SchemaIndex {
  const schemaIndexPath = path.join(dirname, '../schemas/index.json')
  return JSON.parse(fs.readFileSync(schemaIndexPath, 'utf-8')) as SchemaIndex
}

/**
 * Generate schema name map from schema index
 * Derives singular type names from display names
 */
export function generateSchemaNameMap(
  schemaIndex: SchemaIndex
): Record<string, string> {
  const map: Record<string, string> = {}

  for (const schema of schemaIndex.schemas) {
    // Convert display name to singular form
    // Most display names are already plural, so we need to singularize them
    let singular = schema.displayName

    // Handle special cases
    if (singular === 'Abilities') singular = 'Ability'
    else if (singular === 'Chassis')
      singular = 'Chassis' // Already singular
    else if (singular === 'Equipment')
      singular = 'Equipment' // Already singular
    else if (singular === 'Meld')
      singular = 'Meld' // Already singular
    else if (singular === 'Distances') singular = 'Distance'
    else if (singular.endsWith('ies')) {
      // Abilities -> Ability
      singular = singular.slice(0, -3) + 'y'
    } else if (singular.endsWith('s')) {
      // Remove trailing 's' for most plurals
      singular = singular.slice(0, -1)
    }

    // Convert to PascalCase (remove spaces and hyphens)
    const pascalCase = singular
      .split(/[\s-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    map[schema.id] = pascalCase
  }

  return map
}

/**
 * Get singular type name from schema ID
 * Generates the map from schema index on first call
 */
let cachedSchemaNameMap: Record<string, string> | null = null

export function getSingularTypeName(
  schemaId: string,
  dirname?: string
): string {
  if (!cachedSchemaNameMap) {
    const dir = dirname || getDirname(import.meta.url)
    const schemaIndex = loadSchemaIndex(dir)
    cachedSchemaNameMap = generateSchemaNameMap(schemaIndex)
  }

  return cachedSchemaNameMap[schemaId] || schemaId
}

/**
 * Convert schema ID to PascalCase for model property names
 * Handles special cases for classes and NPCs
 */
export function toPascalCase(id: string): string {
  // Handle special cases for classes
  if (id === 'classes.core') return 'CoreClasses'
  if (id === 'classes.advanced') return 'AdvancedClasses'

  // Handle special case for NPCs (all caps)
  if (id === 'npcs') return 'NPCs'

  // Handle hyphenated and dotted names
  return id
    .split(/[-.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
