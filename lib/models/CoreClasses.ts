import { BaseModel } from '../BaseModel.js'
import type { SURefCoreClass } from '../types/inferred.js'
import coreClassesData from '../../data/classes.core.json' with { type: 'json' }
import coreClassesSchema from '../../schemas/classes.core.schema.json' with { type: 'json' }

export class CoreClassesModel extends BaseModel<SURefCoreClass> {
  constructor() {
    super(coreClassesData as SURefCoreClass[], coreClassesSchema)
  }
}
