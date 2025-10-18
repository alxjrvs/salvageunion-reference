import type { AbilityTreeRequirement } from '../types/inferred.js'
import abilityTreeRequirementsData from '../../data/ability-tree-requirements.json' with { type: 'json' }
import abilityTreeRequirementsSchema from '../../schemas/ability-tree-requirements.schema.json' with { type: 'json' }

export class AbilityTreeRequirementsModel {
  protected data: AbilityTreeRequirement[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = abilityTreeRequirementsData as AbilityTreeRequirement[]
    this.schema = abilityTreeRequirementsSchema as Record<string, unknown>
  }

  all(): AbilityTreeRequirement[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(
    predicate: (item: AbilityTreeRequirement) => boolean
  ): AbilityTreeRequirement | undefined {
    return this.data.find(predicate)
  }

  where(
    predicate: (item: AbilityTreeRequirement) => boolean
  ): AbilityTreeRequirement[] {
    return this.data.filter(predicate)
  }

  findById(id: string): AbilityTreeRequirement | undefined {
    return this.find((item) => item.id === id)
  }

  findByTree(tree: string): AbilityTreeRequirement | undefined {
    return this.find((item) => item.tree === tree)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
