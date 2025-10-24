import { BaseModel } from '../BaseModel.js'
import { SURefTraitList } from '../types/inferred.js'
import traitsData from '../../data/traits.json' with { type: 'json' }
import traitsSchema from '../../schemas/traits.schema.json' with { type: 'json' }

type Trait = SURefTraitList[number]

export class TraitsModel extends BaseModel<Trait> {
  constructor() {
    super(traitsData as Trait[], traitsSchema)
  }
}
