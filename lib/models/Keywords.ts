import { BaseModel } from '../BaseModel.js'
import type { Keyword } from '../types/inferred.js'
import keywordsData from '../../data/keywords.json' with { type: 'json' }
import keywordsSchema from '../../schemas/keywords.schema.json' with { type: 'json' }

export class KeywordsModel extends BaseModel<Keyword> {
  constructor() {
    super(keywordsData as Keyword[], keywordsSchema)
  }
}
