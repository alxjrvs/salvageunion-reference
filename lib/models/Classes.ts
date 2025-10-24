import { BaseModel } from '../BaseModel.js'
import type { SURefClass } from '../types/inferred.js'
import classesData from '../../data/classes.json' with { type: 'json' }
import classesSchema from '../../schemas/classes.schema.json' with { type: 'json' }

export class ClassesModel extends BaseModel<SURefClass> {
  constructor() {
    super(classesData as SURefClass[], classesSchema)
  }
}
