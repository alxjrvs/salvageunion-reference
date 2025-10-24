import { BaseModel } from '../BaseModel.js'
import type { SURefChassis } from '../types/inferred.js'
import chassisData from '../../data/chassis.json' with { type: 'json' }
import chassisSchema from '../../schemas/chassis.schema.json' with { type: 'json' }

export class ChassisModel extends BaseModel<SURefChassis> {
  constructor() {
    super(chassisData as SURefChassis[], chassisSchema)
  }

  findByTechLevel(level: number): SURefChassis[] {
    return this.where((c) => c.stats?.tech_level === level)
  }

  findBySalvageValue(value: number): SURefChassis[] {
    return this.where((c) => c.stats?.salvage_value === value)
  }

  findByMinStructurePoints(min: number): SURefChassis[] {
    return this.where((c) => (c.stats?.structure_pts ?? 0) >= min)
  }

  findByMinSystemSlots(min: number): SURefChassis[] {
    return this.where((c) => (c.stats?.system_slots ?? 0) >= min)
  }

  findByMinModuleSlots(min: number): SURefChassis[] {
    return this.where((c) => (c.stats?.module_slots ?? 0) >= min)
  }

  findByMinCargoCap(min: number): SURefChassis[] {
    return this.where((c) => (c.stats?.cargo_cap ?? 0) >= min)
  }
}
