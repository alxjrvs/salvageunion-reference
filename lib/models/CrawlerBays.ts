import { BaseModel } from '../BaseModel.js'
import type { CrawlerBay } from '../types/inferred.js'
import crawlerBaysData from '../../data/crawler-bays.json' with { type: 'json' }
import crawlerBaysSchema from '../../schemas/crawler-bays.schema.json' with { type: 'json' }

export class CrawlerBaysModel extends BaseModel<CrawlerBay> {
  constructor() {
    super(crawlerBaysData as CrawlerBay[], crawlerBaysSchema)
  }

  findByOperatorPosition(position: string): CrawlerBay | undefined {
    return this.find((b) => b.operatorPosition === position)
  }

  findBaysWithRollTables(): CrawlerBay[] {
    return this.where(
      (b) => !!b.rollTable && Object.keys(b.rollTable).length > 0
    )
  }

  findBaysWithTechLevelEffects(): CrawlerBay[] {
    return this.where((b) => b.techLevelEffects.length > 0)
  }
}
