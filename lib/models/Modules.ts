import { BaseModel } from '../BaseModel.js'
import type { SURefModule } from '../types/inferred.js'
import modulesData from '../../data/modules.json' with { type: 'json' }
import modulesSchema from '../../schemas/modules.schema.json' with { type: 'json' }

type Trait = NonNullable<SURefModule['traits']>[number]

export class ModulesModel extends BaseModel<SURefModule> {
  constructor() {
    super(modulesData as SURefModule[], modulesSchema)
  }

  findByTechLevel(level: number): SURefModule[] {
    return this.where((m) => m.techLevel === level)
  }

  findBySalvageValue(value: number): SURefModule[] {
    return this.where((m) => m.salvageValue === value)
  }

  findBySlotsRequired(slots: number): SURefModule[] {
    return this.where((m) => m.slotsRequired === slots)
  }

  findByTrait(traitType: string): SURefModule[] {
    return this.where(
      (m) => m.traits?.some((t: Trait) => t.type === traitType) ?? false
    )
  }

  getRecommended(): SURefModule[] {
    return this.where((m) => m.recommended === true)
  }

  findByActionType(actionType: string): SURefModule[] {
    return this.where((m) => m.actionType === actionType)
  }
}
