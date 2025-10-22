import { BaseModel } from '../BaseModel.js'
import { RollTable } from '../types/inferred.js'
import rollTablesData from '../../data/roll-tables.json' with { type: 'json' }
import rollTablesSchema from '../../schemas/roll-tables.schema.json' with { type: 'json' }

export class RollTablesModel extends BaseModel<RollTable> {
  constructor() {
    super(rollTablesData as RollTable[], rollTablesSchema)
  }
}
