import { BaseModel } from '../BaseModel.js'
import { SURefSystem } from '../types/inferred.js'
import systemsData from '../../data/systems.json' with { type: 'json' }
import systemsSchema from '../../schemas/systems.schema.json' with { type: 'json' }

type Trait = NonNullable<SURefSystem['traits']>[number]

export class SystemsModel extends BaseModel<SURefSystem> {
  constructor() {
    super(systemsData as SURefSystem[], systemsSchema)
  }

  findByTechLevel(level: number): SURefSystem[] {
    return this.where((s) => s.techLevel === level)
  }

  findBySalvageValue(value: number): SURefSystem[] {
    return this.where((s) => s.salvageValue === value)
  }

  findBySlotsRequired(slots: number): SURefSystem[] {
    return this.where((s) => s.slotsRequired === slots)
  }

  findByTrait(traitType: string): SURefSystem[] {
    return this.where(
      (s) => s.traits?.some((t: Trait) => t.type === traitType) ?? false
    )
  }

  getWeapons(): SURefSystem[] {
    return this.where(
      (s) =>
        s.traits?.some((t: Trait) =>
          ['melee', 'ballistic', 'energy', 'missile'].includes(t.type)
        ) ?? false
    )
  }

  findByDamageType(damageType: 'SP' | 'HP' | 'EP'): SURefSystem[] {
    return this.where(
      (s) =>
        s.damage !== undefined &&
        typeof s.damage === 'object' &&
        'type' in s.damage &&
        s.damage.type === damageType
    )
  }

  findByMinDamage(minDamage: number): SURefSystem[] {
    return this.where((s) => {
      const hasDamage = s.damage !== undefined

      if (!hasDamage) {
        return false
      }

      if (typeof s.damage.amount === 'string') {
        return true
      }
      return s.damage.amount >= minDamage
    })
  }
}
