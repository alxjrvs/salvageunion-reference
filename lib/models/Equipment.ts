import { BaseModel } from '../BaseModel.js'
import type { SURefEquipment } from '../types/inferred.js'
import equipmentData from '../../data/equipment.json' with { type: 'json' }
import equipmentSchema from '../../schemas/equipment.schema.json' with { type: 'json' }

type Trait = NonNullable<SURefEquipment['traits']>[number]

export class EquipmentModel extends BaseModel<SURefEquipment> {
  constructor() {
    super(equipmentData as SURefEquipment[], equipmentSchema)
  }

  findByTechLevel(level: number): SURefEquipment[] {
    return this.where((e) => e.techLevel === level)
  }

  findByTrait(traitType: string): SURefEquipment[] {
    return this.where(
      (e) => e.traits?.some((t: Trait) => t.type === traitType) ?? false
    )
  }

  findByActivationCost(cost: number): SURefEquipment[] {
    return this.where((e) => e.activationCost === cost)
  }

  getArmor(): SURefEquipment[] {
    return this.findByTrait('armor')
  }

  getWeapons(): SURefEquipment[] {
    return this.where(
      (e) =>
        e.traits?.some((t: Trait) =>
          ['melee', 'ballistic', 'energy', 'missile'].includes(t.type)
        ) ?? false
    )
  }

  getWithActions(): SURefEquipment[] {
    return this.where((e) => (e.actions?.length ?? 0) > 0)
  }
}
