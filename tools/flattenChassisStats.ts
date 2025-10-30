#!/usr/bin/env tsx

/**
 * Flatten chassis stats from nested object to top-level properties
 * This script transforms chassis data from:
 *   { stats: { structurePts: 12, ... }, ... }
 * to:
 *   { structurePts: 12, ..., ... }
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface Stats {
  structurePts: number
  energyPts: number
  heatCap: number
  systemSlots: number
  moduleSlots: number
  cargoCap: number
  techLevel: number
  salvageValue: number
  [key: string]: unknown
}

interface ChassisOld {
  stats: Stats
  [key: string]: unknown
}

interface ChassisNew {
  structurePts: number
  energyPts: number
  heatCap: number
  systemSlots: number
  moduleSlots: number
  cargoCap: number
  techLevel: number
  salvageValue: number
  [key: string]: unknown
}

function flattenChassis(chassis: ChassisOld): ChassisNew {
  const { stats, ...rest } = chassis
  return {
    ...rest,
    structurePts: stats.structurePts,
    energyPts: stats.energyPts,
    heatCap: stats.heatCap,
    systemSlots: stats.systemSlots,
    moduleSlots: stats.moduleSlots,
    cargoCap: stats.cargoCap,
    techLevel: stats.techLevel,
    salvageValue: stats.salvageValue,
  }
}

const filePath = join(process.cwd(), 'data', 'chassis.json')
const data = JSON.parse(readFileSync(filePath, 'utf-8')) as ChassisOld[]

console.log('🔧 Flattening chassis stats...\n')
console.log(`Processing ${data.length} chassis entries...`)

const flattened = data.map(flattenChassis)

writeFileSync(filePath, JSON.stringify(flattened, null, 2) + '\n', 'utf-8')

console.log('✅ Successfully flattened chassis stats!')
console.log(`Updated ${filePath}`)
