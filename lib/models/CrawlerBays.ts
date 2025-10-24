import { BaseModel } from '../BaseModel.js'
import type { SURefCrawlerBay } from '../types/inferred.js'
import crawlerBaysData from '../../data/crawler-bays.json' with { type: 'json' }
import crawlerBaysSchema from '../../schemas/crawler-bays.schema.json' with { type: 'json' }

export class CrawlerBaysModel extends BaseModel<SURefCrawlerBay> {
  constructor() {
    super(crawlerBaysData as SURefCrawlerBay[], crawlerBaysSchema)
  }

  findBaysWithRollTables(): SURefCrawlerBay[] {
    return this.where((b) => !!b.table && Object.keys(b.table).length > 0)
  }

  findBaysWithTechLevelEffects(): SURefCrawlerBay[] {
    return this.where((b) => b.techLevelEffects.length > 0)
  }
}
