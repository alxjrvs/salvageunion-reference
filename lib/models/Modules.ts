import { BaseModel } from '../BaseModel.js'
import type { Module } from '../types/inferred.js'
import modulesData from '../../data/modules.json' with { type: 'json' }
import modulesSchema from '../../schemas/modules.schema.json' with { type: 'json' }

type Trait = NonNullable<Module['traits']>[number]

export class ModulesModel extends BaseModel<Module> {
  constructor() {
    super(modulesData as Module[], modulesSchema)
  }

  findByTechLevel(level: number): Module[] {
    return this.where((m) => m.techLevel === level)
  }

  findBySalvageValue(value: number): Module[] {
    return this.where((m) => m.salvageValue === value)
  }

  findBySlotsRequired(slots: number): Module[] {
    return this.where((m) => m.slotsRequired === slots)
  }

  findByTrait(traitType: string): Module[] {
    return this.where(
      (m) => m.traits?.some((t: Trait) => t.type === traitType) ?? false
    )
  }

  getRecommended(): Module[] {
    return this.where((m) => m.recommended === true)
  }

  findByActionType(actionType: string): Module[] {
    return this.where((m) => m.actionType === actionType)
  }
}
