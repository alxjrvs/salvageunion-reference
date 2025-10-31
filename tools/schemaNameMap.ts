/**
 * Shared mapping from schema IDs to singular type names
 * Used by both generateSchemaTypes.ts and generateUtilities.ts
 * to ensure consistency across generated code
 */
export const SCHEMA_NAME_MAP: Record<string, string> = {
  abilities: 'Ability',
  'ability-tree-requirements': 'AbilityTreeRequirement',
  'bio-titans': 'BioTitan',
  chassis: 'Chassis',
  'classes.advanced': 'AdvancedClass',
  'classes.core': 'CoreClass',
  'classes.hybrid': 'HybridClass',
  'crawler-bays': 'CrawlerBay',
  'crawler-tech-levels': 'CrawlerTechLevel',
  crawlers: 'Crawler',
  creatures: 'Creature',
  drones: 'Drone',
  equipment: 'Equipment',
  keywords: 'Keyword',
  meld: 'Meld',
  modules: 'Module',
  npcs: 'NPC',
  'roll-tables': 'RollTable',
  squads: 'Squad',
  systems: 'System',
  traits: 'Trait',
  vehicles: 'Vehicle',
}

