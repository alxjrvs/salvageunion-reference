# Search API Documentation

The `salvageunion-reference` package provides a powerful search API for finding entities across all Salvage Union data schemas.

## Features

- ✅ **Full-text search** across all schemas or specific schemas
- ✅ **Relevance scoring** - results sorted by match quality
- ✅ **Field matching** - search in name, description, and effect fields
- ✅ **Case-sensitive/insensitive** search options
- ✅ **Result limiting** - control number of results returned
- ✅ **Type-safe** - full TypeScript support with proper typing
- ✅ **Fast** - optimized for performance with minimal overhead

## Quick Start

```typescript
import { SalvageUnionReference } from 'salvageunion-reference'

// Search across all schemas
const results = SalvageUnionReference.search({ query: 'laser' })

// Search within specific schemas
const systems = SalvageUnionReference.searchIn('systems', 'laser')

// Get search suggestions
const suggestions = SalvageUnionReference.getSuggestions('las')
```

## API Reference

### `search(options: SearchOptions): SearchResult[]`

Search across all schemas or specific schemas with advanced filtering.

**Parameters:**

```typescript
interface SearchOptions {
  query: string                    // Search query (required)
  schemas?: SURefSchemaName[]      // Limit to specific schemas (optional)
  limit?: number                   // Max results to return (optional)
  caseSensitive?: boolean          // Case-sensitive search (default: false)
}
```

**Returns:**

```typescript
interface SearchResult {
  schemaName: SURefSchemaName      // Schema ID (e.g., 'systems', 'modules')
  schemaTitle: string              // Human-readable schema name
  entity: SURefEntity              // The matched entity
  entityId: string                 // Entity UUID
  entityName: string               // Entity name
  matchedFields: string[]          // Fields that matched (e.g., ['name', 'description'])
  matchScore: number               // Relevance score (higher = better match)
}
```

**Examples:**

```typescript
// Basic search
const results = search({ query: 'laser' })

// Search specific schemas
const results = search({
  query: 'laser',
  schemas: ['systems', 'modules']
})

// Limit results
const results = search({
  query: 'laser',
  limit: 10
})

// Case-sensitive search
const results = search({
  query: 'Railgun',
  caseSensitive: true
})
```

### `searchIn<T>(schemaName, query, options?): T[]`

Search within a specific schema and return typed results.

**Parameters:**

```typescript
schemaName: SURefSchemaName        // Schema to search in
query: string                      // Search query
options?: {
  limit?: number                   // Max results
  caseSensitive?: boolean          // Case-sensitive search
}
```

**Returns:** Array of typed entities from the specified schema.

**Examples:**

```typescript
// Search systems
const systems = searchIn('systems', 'laser')
// Returns: SURefSystem[]

// Search modules with limit
const modules = searchIn('modules', 'targeting', { limit: 5 })
// Returns: SURefModule[]

// Search abilities (case-sensitive)
const abilities = searchIn('abilities', 'Master', { caseSensitive: true })
// Returns: SURefAbility[]
```

### `getSuggestions(query, options?): string[]`

Get unique entity names that match the query, useful for autocomplete.

**Parameters:**

```typescript
query: string                      // Partial search query
options?: {
  schemas?: SURefSchemaName[]      // Limit to specific schemas
  limit?: number                   // Max suggestions (default: 10)
  caseSensitive?: boolean          // Case-sensitive search
}
```

**Returns:** Array of unique entity names.

**Examples:**

```typescript
// Get suggestions for partial query
const suggestions = getSuggestions('las')
// Returns: ['Laser Anti-Missile System', 'Laser Guidance', ...]

// Limit suggestions
const suggestions = getSuggestions('las', { limit: 5 })

// Filter by schemas
const suggestions = getSuggestions('las', {
  schemas: ['systems', 'modules']
})
```

## Static Methods on SalvageUnionReference

All search functions are also available as static methods on the `SalvageUnionReference` class:

```typescript
// Using static methods
SalvageUnionReference.search({ query: 'laser' })
SalvageUnionReference.searchIn('systems', 'laser')
SalvageUnionReference.getSuggestions('las')

// Equivalent to importing functions directly
import { search, searchIn, getSuggestions } from 'salvageunion-reference'
search({ query: 'laser' })
searchIn('systems', 'laser')
getSuggestions('las')
```

## Relevance Scoring

Search results are automatically sorted by relevance score. The scoring algorithm prioritizes:

1. **Exact name matches** (score: 100)
2. **Name starts with query** (score: 50)
3. **Name contains query** (score: 25)
4. **Description contains query** (score: 10)
5. **Multiple field matches** (+5 per additional field)

Example:

```typescript
const results = search({ query: 'laser' })

// Results are sorted by score (highest first)
results.forEach(result => {
  console.log(`${result.entityName}: ${result.matchScore}`)
})
// Output:
// Laser Anti-Missile System: 70
// Laser Guidance: 55
// Green Laser: 50
// ...
```

## Searchable Fields

The search API searches the following fields:

- **name** - Entity name (all entities)
- **description** - Entity description (most entities)
- **effect** - Entity effect (systems, modules, abilities)

## Available Schemas

You can search across these schemas:

- `abilities` - Pilot and Mech abilities
- `ability-tree-requirements` - Ability prerequisites
- `bio-titans` - Bio-Titan creatures
- `chassis` - Mech chassis
- `classes.advanced` - Advanced classes
- `classes.core` - Core classes
- `classes.hybrid` - Hybrid classes
- `crawler-bays` - Crawler bay modules
- `crawler-tech-levels` - Crawler tech levels
- `crawlers` - Crawler vehicles
- `creatures` - Creatures and enemies
- `drones` - Drone types
- `equipment` - Personal equipment
- `keywords` - Game keywords
- `meld` - Meld entities
- `modules` - Mech modules
- `npcs` - Non-player characters
- `roll-tables` - Random tables
- `squads` - Squad types
- `systems` - Mech systems
- `traits` - Traits and tags
- `vehicles` - Vehicles

## Performance Tips

1. **Use schema filtering** when you know what type of entity you're looking for:
   ```typescript
   // Faster - searches only systems
   searchIn('systems', 'laser')
   
   // Slower - searches all schemas
   search({ query: 'laser' })
   ```

2. **Use limits** for large result sets:
   ```typescript
   search({ query: 'a', limit: 50 })
   ```

3. **Cache results** if searching repeatedly with the same query:
   ```typescript
   const cache = new Map()
   
   function cachedSearch(query: string) {
     if (!cache.has(query)) {
       cache.set(query, search({ query }))
     }
     return cache.get(query)
   }
   ```

## Examples

See `examples/search-demo.ts` for comprehensive examples of all search features.

Run the demo:

```bash
tsx examples/search-demo.ts
```

## Migration from Manual Search

**Before** (manual iteration):

```typescript
const results = []
for (const schema of schemas) {
  const data = SalvageUnionReference[schema].all()
  for (const item of data) {
    if (item.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(item)
    }
  }
}
```

**After** (using search API):

```typescript
const results = search({ query })
```

## TypeScript Support

All search functions are fully typed:

```typescript
// Results are properly typed
const results: SearchResult[] = search({ query: 'laser' })

// Schema-specific results are typed
const systems: SURefSystem[] = searchIn('systems', 'laser')

// Suggestions are string arrays
const suggestions: string[] = getSuggestions('las')
```

## Future Enhancements

Planned features for future releases:

- **Fuzzy search** - Typo-tolerant matching
- **Advanced queries** - AND/OR/NOT operators
- **Field-specific search** - Search only in specific fields
- **Search index** - Pre-built index for faster searches
- **Highlighting** - Mark matched text in results

