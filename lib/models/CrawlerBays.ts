import { BaseModel } from '../BaseModel.js'
import type { CrawlerBay } from '../types/inferred.js'
import crawlerBaysData from '../../data/crawler-bays.json' with { type: 'json' }
import crawlerBaysSchema from '../../schemas/crawler-bays.schema.json' with { type: 'json' }

export class CrawlerBaysModel extends BaseModel<CrawlerBay> {
  constructor() {
    super(crawlerBaysData as CrawlerBay[], crawlerBaysSchema)
  }

  findBaysWithRollTables(): CrawlerBay[] {
    return this.where((b) => !!b.table && Object.keys(b.table).length > 0)
  }

  findBaysWithTechLevelEffects(): CrawlerBay[] {
    return this.where((b) => b.techLevelEffects.length > 0)
  }
}
