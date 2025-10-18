import { BaseModel } from '../BaseModel.js'
import type { Class } from '../types/inferred.js'
import classesData from '../../data/classes.json' with { type: 'json' }
import classesSchema from '../../schemas/classes.schema.json' with { type: 'json' }

export class ClassesModel extends BaseModel<Class> {
  constructor() {
    super(classesData as Class[], classesSchema)
  }
}
