#!/usr/bin/env tsx

/**
 * Migrate data files to use content blocks instead of description, effect, effects, notes, options
 *
 * Rules:
 * - Remove description, effect, effects, notes, options from actions
 * - Convert them to content blocks in content array
 * - Order: description, effect, options, notes
 * - Options become list-item type
 * - For abilities: if ability has no description, move action description to ability level
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface ContentBlock {
  type?: string
  value: string
  label?: string
}

interface Action {
  id: string
  name: string
  description?: string
  effects?: Array<{ value: string; label?: string }>
  notes?: string
  options?: Array<{ value: string; label?: string }>
  content?: ContentBlock[]
  [key: string]: any
}

interface Entity {
  id: string
  name: string
  description?: string
  notes?: string
  actions?: Action[]
  content?: ContentBlock[]
  [key: string]: any
}

function convertActionToContentBlocks(action: Action): Action {
  const newAction: Action = { ...action }
  const contentBlocks: ContentBlock[] = action.content
    ? [...action.content]
    : []

  // Order: description, effect, options, notes

  // 1. Description
  if (action.description) {
    contentBlocks.push({
      type: 'paragraph',
      value: action.description,
    })
    delete newAction.description
  }

  // 2. Effects
  if (action.effects && action.effects.length > 0) {
    for (const effect of action.effects) {
      const block: ContentBlock = {
        type: 'paragraph',
        value: effect.value,
      }
      if (effect.label) {
        block.label = effect.label
      }
      contentBlocks.push(block)
    }
    delete newAction.effects
  }

  // 3. Options (convert to list-item)
  if (action.options && action.options.length > 0) {
    for (const option of action.options) {
      const block: ContentBlock = {
        type: 'list-item',
        value: option.value,
      }
      if (option.label) {
        block.label = option.label
      }
      contentBlocks.push(block)
    }
    delete newAction.options
  }

  // 4. Notes
  if (action.notes) {
    contentBlocks.push({
      type: 'paragraph',
      value: action.notes,
    })
    delete newAction.notes
  }

  if (contentBlocks.length > 0) {
    newAction.content = contentBlocks
  }

  // Handle nested choices in actions
  if (action.choices && Array.isArray(action.choices)) {
    newAction.choices = action.choices.map(convertNestedObject)
  }

  return newAction
}

function convertNestedObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  const newObj: any = { ...obj }
  const contentBlocks: ContentBlock[] = obj.content ? [...obj.content] : []

  // Convert description and notes to content blocks
  if (obj.description) {
    contentBlocks.push({
      type: 'paragraph',
      value: obj.description,
    })
    delete newObj.description
  }

  if (obj.notes) {
    contentBlocks.push({
      type: 'paragraph',
      value: obj.notes,
    })
    delete newObj.notes
  }

  if (contentBlocks.length > 0) {
    newObj.content = contentBlocks
  }

  // Recursively handle nested choices arrays
  if (obj.choices && Array.isArray(obj.choices)) {
    newObj.choices = obj.choices.map(convertNestedObject)
  }

  return newObj
}

function convertEntityToContentBlocks(entity: Entity): Entity {
  const newEntity: Entity = { ...entity }
  const contentBlocks: ContentBlock[] = entity.content
    ? [...entity.content]
    : []

  // Convert entity-level description and notes
  if (entity.description) {
    contentBlocks.push({
      type: 'paragraph',
      value: entity.description,
    })
    delete newEntity.description
  }

  if (entity.notes) {
    contentBlocks.push({
      type: 'paragraph',
      value: entity.notes,
    })
    delete newEntity.notes
  }

  if (contentBlocks.length > 0) {
    newEntity.content = contentBlocks
  }

  // Convert actions
  if (entity.actions) {
    newEntity.actions = entity.actions.map(convertActionToContentBlocks)
  }

  // Convert nested npc object
  if (entity.npc) {
    newEntity.npc = convertNestedObject(entity.npc)
  }

  // Handle entity-level choices
  if (entity.choices && Array.isArray(entity.choices)) {
    newEntity.choices = entity.choices.map(convertNestedObject)
  }

  // Handle patterns (in chassis)
  if (entity.patterns && Array.isArray(entity.patterns)) {
    newEntity.patterns = entity.patterns.map(convertNestedObject)
  }

  return newEntity
}

function migrateFile(filePath: string): void {
  console.log(`Migrating ${filePath}...`)
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as Entity[]
  const migratedData = data.map(convertEntityToContentBlocks)
  writeFileSync(filePath, JSON.stringify(migratedData, null, 2) + '\n')
  console.log(`✓ Migrated ${filePath}`)
}

// Migrate all data files (except abilities which needs special handling)
const dataFiles = [
  'data/equipment.json',
  'data/systems.json',
  'data/modules.json',
  'data/chassis.json',
  'data/creatures.json',
  'data/npcs.json',
  'data/bio-titans.json',
  'data/meld.json',
  'data/squads.json',
  'data/vehicles.json',
  'data/drones.json',
  'data/crawlers.json',
  'data/crawler-bays.json',
  'data/classes.advanced.json',
  'data/classes.core.json',
  'data/keywords.json',
  'data/traits.json',
  'data/distances.json',
  'data/roll-tables.json',
]

for (const file of dataFiles) {
  migrateFile(join(process.cwd(), file))
}
