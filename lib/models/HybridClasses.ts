import { BaseModel } from '../BaseModel.js'
import type { SURefHybridClass } from '../types/inferred.js'
import hybridClassesData from '../../data/classes.hybrid.json' with { type: 'json' }
import hybridClassesSchema from '../../schemas/classes.hybrid.schema.json' with { type: 'json' }

export class HybridClassesModel extends BaseModel<SURefHybridClass> {
  constructor() {
    super(hybridClassesData as SURefHybridClass[], hybridClassesSchema)
  }
}
