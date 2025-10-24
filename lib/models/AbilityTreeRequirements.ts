import type { SURefAbilityTreeRequirement } from '../types/inferred.js'
import abilityTreeRequirementsData from '../../data/ability-tree-requirements.json' with { type: 'json' }
import abilityTreeRequirementsSchema from '../../schemas/ability-tree-requirements.schema.json' with { type: 'json' }

export class AbilityTreeRequirementsModel {
  protected data: SURefAbilityTreeRequirement[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = abilityTreeRequirementsData as SURefAbilityTreeRequirement[]
    this.schema = abilityTreeRequirementsSchema as Record<string, unknown>
  }

  all(): SURefAbilityTreeRequirement[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(
    predicate: (item: SURefAbilityTreeRequirement) => boolean
  ): SURefAbilityTreeRequirement | undefined {
    return this.data.find(predicate)
  }

  where(
    predicate: (item: SURefAbilityTreeRequirement) => boolean
  ): SURefAbilityTreeRequirement[] {
    return this.data.filter(predicate)
  }

  findById(id: string): SURefAbilityTreeRequirement | undefined {
    return this.find((item) => item.id === id)
  }

  findByTree(tree: string): SURefAbilityTreeRequirement | undefined {
    return this.find((item) => item.tree === tree)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
