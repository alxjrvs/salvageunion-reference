#!/usr/bin/env bun
/**
 * Update schema references from old plural/baseEntry to new singular/baseEntity
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'

const files = readdirSync('schemas')
  .filter((f) => f.endsWith('.json'))
  .map((f) => `schemas/${f}`)

for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const schema = JSON.parse(content)

  let modified = false

  // Recursively update all references
  function updateRefs(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(updateRefs)
    }

    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      // Replace baseEntry with baseEntity
      if (
        key === '$ref' &&
        typeof value === 'string' &&
        value.includes('baseEntry')
      ) {
        result[key] = value.replace('baseEntry', 'baseEntity')
        modified = true
      }
      // Replace actions reference with inline array
      else if (
        key === 'actions' &&
        typeof value === 'object' &&
        value !== null &&
        '$ref' in value &&
        value.$ref === 'shared/objects.schema.json#/definitions/actions'
      ) {
        result[key] = {
          type: 'array',
          items: {
            $ref: 'shared/objects.schema.json#/definitions/action',
          },
        }
        modified = true
      }
      // Replace grants reference with inline array
      else if (
        key === 'grants' &&
        typeof value === 'object' &&
        value !== null &&
        '$ref' in value &&
        value.$ref === 'shared/objects.schema.json#/definitions/grants'
      ) {
        result[key] = {
          type: 'array',
          items: {
            $ref: 'shared/objects.schema.json#/definitions/grant',
          },
        }
        modified = true
      }
      // Replace patterns reference with inline array
      else if (
        key === 'patterns' &&
        typeof value === 'object' &&
        value !== null &&
        '$ref' in value &&
        value.$ref === 'shared/objects.schema.json#/definitions/patterns'
      ) {
        result[key] = {
          type: 'array',
          items: {
            $ref: 'shared/objects.schema.json#/definitions/pattern',
          },
        }
        modified = true
      } else {
        result[key] = updateRefs(value)
      }
    }
    return result
  }

  const updated = updateRefs(schema)

  if (modified) {
    writeFileSync(file, JSON.stringify(updated, null, 2) + '\n')
    console.log(`✓ Updated ${file}`)
  }
}

console.log('Done!')
