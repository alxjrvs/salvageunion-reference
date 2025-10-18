import { BaseModel } from '../BaseModel.js'
import type { Ability, Traits } from '../types/inferred.js'
import abilitiesData from '../../data/abilities.json' with { type: 'json' }
import abilitiesSchema from '../../schemas/abilities.schema.json' with { type: 'json' }

export class AbilitiesModel extends BaseModel<Ability> {
  constructor() {
    super(abilitiesData as Ability[], abilitiesSchema)
  }

  findByLevel(level: number): Ability[] {
    return this.where((a) => a.level === level)
  }

  findByTree(treeName: string): Ability[] {
    return this.where((a) => a.tree === treeName)
  }

  findByTrait(traitType: string): Ability[] {
    return this.where(
      (a) =>
        a.traits?.some((t: Traits[number]) => t.type === traitType) ?? false
    )
  }

  getAllTrees(): string[] {
    const trees = new Set<string>()
    this.data.forEach((a) => {
      if (a.tree) trees.add(a.tree)
    })
    return Array.from(trees).sort()
  }
}
