import { BaseModel } from '../BaseModel.js'
import type { SURefAbility, SURefTraitMetaList } from '../types/inferred.js'
import abilitiesData from '../../data/abilities.json' with { type: 'json' }
import abilitiesSchema from '../../schemas/abilities.schema.json' with { type: 'json' }

export class AbilitiesModel extends BaseModel<SURefAbility> {
  constructor() {
    super(abilitiesData as SURefAbility[], abilitiesSchema)
  }

  findByLevel(level: number): SURefAbility[] {
    return this.where((a) => a.level === level)
  }

  findByTree(treeName: string): SURefAbility[] {
    return this.where((a) => a.tree === treeName)
  }

  findByTrait(traitType: string): SURefAbility[] {
    return this.where(
      (a) =>
        a.traits?.some(
          (t: SURefTraitMetaList[number]) => t.type === traitType
        ) ?? false
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
