/**
 * Search functionality for Salvage Union data
 */

import type { SURefEntity, SURefSchemaName } from './types/index.js'
import { getSchemaCatalog, getDataMaps } from './ModelFactory.js'

export interface SearchOptions {
  query: string
  schemas?: SURefSchemaName[]
  limit?: number
  caseSensitive?: boolean
}

export interface SearchResult {
  schemaName: SURefSchemaName
  schemaTitle: string
  entity: SURefEntity
  entityId: string
  entityName: string
  matchedFields: string[]
  matchScore: number
}

/**
 * Calculate a relevance score for a search match
 * Higher scores = better matches
 */
function calculateScore(
  entity: SURefEntity,
  query: string,
  matchedFields: string[]
): number {
  let score = 0
  const lowerQuery = query.toLowerCase()

  // Exact name match gets highest score
  if (entity.name.toLowerCase() === lowerQuery) {
    score += 100
  }
  // Name starts with query
  else if (entity.name.toLowerCase().startsWith(lowerQuery)) {
    score += 50
  }
  // Name contains query
  else if (entity.name.toLowerCase().includes(lowerQuery)) {
    score += 25
  }

  // Description match gets lower score
  if (
    'description' in entity &&
    typeof entity.description === 'string' &&
    entity.description.toLowerCase().includes(lowerQuery)
  ) {
    score += 10
  }

  // Boost score based on number of matched fields
  score += matchedFields.length * 5

  return score
}

/**
 * Check if an entity matches the search query
 */
function matchesQuery(
  entity: SURefEntity,
  query: string,
  caseSensitive: boolean
): { matches: boolean; matchedFields: string[] } {
  const matchedFields: string[] = []
  const searchQuery = caseSensitive ? query : query.toLowerCase()

  // Check name field (all entities have this)
  const name = caseSensitive ? entity.name : entity.name.toLowerCase()
  if (name.includes(searchQuery)) {
    matchedFields.push('name')
  }

  // Check description field if it exists
  if ('description' in entity && typeof entity.description === 'string') {
    const description = caseSensitive
      ? entity.description
      : entity.description.toLowerCase()
    if (description.includes(searchQuery)) {
      matchedFields.push('description')
    }
  }

  // Check effect field if it exists
  if ('effect' in entity && typeof entity.effect === 'string') {
    const effect = caseSensitive ? entity.effect : entity.effect.toLowerCase()
    if (effect.includes(searchQuery)) {
      matchedFields.push('effect')
    }
  }

  return {
    matches: matchedFields.length > 0,
    matchedFields,
  }
}

/**
 * Search across all or specific schemas
 */
export function search(options: SearchOptions): SearchResult[] {
  const { query, schemas: schemaFilter, limit, caseSensitive = false } = options

  if (!query.trim()) {
    return []
  }

  const results: SearchResult[] = []
  const schemaCatalog = getSchemaCatalog()
  const { dataMap } = getDataMaps()

  // Filter schemas if specified
  const schemasToSearch = schemaFilter
    ? schemaCatalog.schemas.filter((s) =>
        schemaFilter.includes(s.id as SURefSchemaName)
      )
    : schemaCatalog.schemas

  for (const schema of schemasToSearch) {
    const schemaId = schema.id as SURefSchemaName
    const data = dataMap[schemaId]

    if (!data || !Array.isArray(data)) {
      continue
    }

    for (const entity of data as SURefEntity[]) {
      const { matches, matchedFields } = matchesQuery(
        entity,
        query,
        caseSensitive
      )

      if (matches) {
        const matchScore = calculateScore(entity, query, matchedFields)

        results.push({
          schemaName: schemaId,
          schemaTitle: schema.title,
          entity,
          entityId: entity.id,
          entityName: entity.name,
          matchedFields,
          matchScore,
        })

        // Early exit if we've hit the limit
        if (limit && results.length >= limit) {
          break
        }
      }
    }

    // Early exit if we've hit the limit
    if (limit && results.length >= limit) {
      break
    }
  }

  // Sort by relevance score (highest first)
  results.sort((a, b) => b.matchScore - a.matchScore)

  // Apply limit after sorting
  if (limit && results.length > limit) {
    return results.slice(0, limit)
  }

  return results
}

/**
 * Search within a specific schema
 */
export function searchIn<T extends SURefEntity>(
  schemaName: SURefSchemaName,
  query: string,
  options?: { limit?: number; caseSensitive?: boolean }
): T[] {
  const results = search({
    query,
    schemas: [schemaName],
    limit: options?.limit,
    caseSensitive: options?.caseSensitive,
  })

  return results.map((r) => r.entity as T)
}

/**
 * Get search suggestions based on partial query
 * Returns unique entity names that match the query
 */
export function getSuggestions(
  query: string,
  options?: {
    schemas?: SURefSchemaName[]
    limit?: number
    caseSensitive?: boolean
  }
): string[] {
  const results = search({
    query,
    schemas: options?.schemas,
    limit: options?.limit || 10,
    caseSensitive: options?.caseSensitive,
  })

  // Return unique names
  const names = new Set(results.map((r) => r.entityName))
  return Array.from(names)
}
