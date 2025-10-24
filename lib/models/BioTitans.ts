import { BaseModel } from '../BaseModel.js'
import type { SURefBioTitan } from '../types/inferred.js'
import bioTitansData from '../../data/bio-titans.json' with { type: 'json' }
import bioTitansSchema from '../../schemas/bio-titans.schema.json' with { type: 'json' }

export class BioTitansModel extends BaseModel<SURefBioTitan> {
  constructor() {
    super(bioTitansData as SURefBioTitan[], bioTitansSchema)
  }

  findByMinStructurePoints(min: number): SURefBioTitan[] {
    return this.where((b) => (b.structurePoints ?? 0) >= min)
  }
}
