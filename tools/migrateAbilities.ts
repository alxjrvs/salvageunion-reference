#!/usr/bin/env tsx

/**
 * Migrate abilities data with special handling:
 * - If ability has no description, move action description to ability level
 * - If ability has description, convert action description to content block
 * - Convert effects, notes, options to content blocks in actions
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

interface Ability {
  id: string
  name: string
  description?: string
  notes?: string
  actions?: Action[]
  content?: ContentBlock[]
  [key: string]: any
}

function convertActionToContentBlocks(action: Action, abilityHasDescription: boolean): { action: Action; descriptionToMove?: string } {
  const newAction: Action = { ...action }
  const contentBlocks: ContentBlock[] = action.content ? [...action.content] : []
  let descriptionToMove: string | undefined

  // If ability doesn't have description and action does, we'll move it up
  if (!abilityHasDescription && action.description) {
    descriptionToMove = action.description
    delete newAction.description
  } else if (action.description) {
    // Ability has description, so convert action description to content block
    contentBlocks.push({
      type: 'paragraph',
      value: action.description
    })
    delete newAction.description
  }

  // Convert effects
  if (action.effects && action.effects.length > 0) {
    for (const effect of action.effects) {
      const block: ContentBlock = {
        type: 'paragraph',
        value: effect.value
      }
      if (effect.label) {
        block.label = effect.label
      }
      contentBlocks.push(block)
    }
    delete newAction.effects
  }

  // Convert options to list-item
  if (action.options && action.options.length > 0) {
    for (const option of action.options) {
      const block: ContentBlock = {
        type: 'list-item',
        value: option.value
      }
      if (option.label) {
        block.label = option.label
      }
      contentBlocks.push(block)
    }
    delete newAction.options
  }

  // Convert notes
  if (action.notes) {
    contentBlocks.push({
      type: 'paragraph',
      value: action.notes
    })
    delete newAction.notes
  }

  if (contentBlocks.length > 0) {
    newAction.content = contentBlocks
  }

  return { action: newAction, descriptionToMove }
}

function convertAbility(ability: Ability): Ability {
  const newAbility: Ability = { ...ability }
  const abilityHasDescription = !!ability.description

  // Convert actions and potentially move description up
  if (ability.actions && ability.actions.length > 0) {
    const convertedActions: Action[] = []
    let movedDescription: string | undefined

    for (const action of ability.actions) {
      const { action: convertedAction, descriptionToMove } = convertActionToContentBlocks(action, abilityHasDescription)
      convertedActions.push(convertedAction)
      
      // Only move the first action's description if ability doesn't have one
      if (!movedDescription && descriptionToMove) {
        movedDescription = descriptionToMove
      }
    }

    newAbility.actions = convertedActions

    // If we moved a description, set it on the ability
    if (movedDescription && !abilityHasDescription) {
      newAbility.description = movedDescription
    }
  }

  // Convert ability-level notes to content (if any)
  if (ability.notes) {
    const contentBlocks: ContentBlock[] = ability.content ? [...ability.content] : []
    contentBlocks.push({
      type: 'paragraph',
      value: ability.notes
    })
    delete newAbility.notes
    newAbility.content = contentBlocks
  }

  return newAbility
}

function migrateAbilities(): void {
  const filePath = join(process.cwd(), 'data/abilities.json')
  console.log(`Migrating ${filePath}...`)
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as Ability[]
  const migratedData = data.map(convertAbility)
  writeFileSync(filePath, JSON.stringify(migratedData, null, 2) + '\n')
  console.log(`✓ Migrated ${filePath}`)
}

migrateAbilities()

