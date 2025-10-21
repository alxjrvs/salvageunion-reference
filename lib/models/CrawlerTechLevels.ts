import { BaseModel } from '../BaseModel.js'
import type { CrawlerTechLevel } from '../types/inferred.js'
import crawlerTechLevelsData from '../../data/crawler-tech-levels.json' with { type: 'json' }
import crawlerTechLevelsSchema from '../../schemas/crawler-tech-levels.schema.json' with { type: 'json' }

export class CrawlerTechLevelsModel extends BaseModel<CrawlerTechLevel> {
  constructor() {
    super(crawlerTechLevelsData as CrawlerTechLevel[], crawlerTechLevelsSchema)
  }

  findByTechLevel(level: number): CrawlerTechLevel | undefined {
    return this.find((c) => c.techLevel === level)
  }

  findByMinPopulation(min: number): CrawlerTechLevel[] {
    return this.where((c) => c.populationMin >= min)
  }

  findByMaxPopulation(max: number): CrawlerTechLevel[] {
    return this.where((c) => c.populationMax > 0 && c.populationMax <= max)
  }

  findByPopulationRange(population: number): CrawlerTechLevel | undefined {
    return this.find((c) => {
      if (c.populationMax === 0) {
        // For unlimited population (Tech 6)
        return population >= c.populationMin
      }
      return population >= c.populationMin && population <= c.populationMax
    })
  }
}
