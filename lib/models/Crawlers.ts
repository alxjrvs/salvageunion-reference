import { BaseModel } from '../BaseModel.js'
import type { SURefCrawler } from '../types/inferred.js'
import crawlersData from '../../data/crawlers.json' with { type: 'json' }
import crawlersSchema from '../../schemas/crawlers.schema.json' with { type: 'json' }

export class CrawlersModel extends BaseModel<SURefCrawler> {
  constructor() {
    super(crawlersData as SURefCrawler[], crawlersSchema)
  }
}
