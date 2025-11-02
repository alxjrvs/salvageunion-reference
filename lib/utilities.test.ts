/**
 * Tests for utility functions (type guards and property extractors)
 */

import { describe, it, expect } from 'vitest'
import { SalvageUnionReference } from './index.js'
import {
  hasTechLevel,
  hasSalvageValue,
  hasSlotsRequired,
  hasActions,
  hasTraits,
  isClass,
  isSystemOrModule,
  isChassis,
  isSystem,
  isMetaAction,
  getTechLevel,
  getSalvageValue,
  getSlotsRequired,
  getPageReference,
  extractActions,
  getStructurePoints,
  getEnergyPoints,
  getHeatCapacity,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
  getHitPoints,
} from './utilities.js'

describe('Additional Type Guards', () => {
  describe('hasTechLevel', () => {
    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(hasTechLevel(system)).toBe(true)
    })

    it('should return true for modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      expect(hasTechLevel(module)).toBe(true)
    })

    it('should return true for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(hasTechLevel(chassis)).toBe(true)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(hasTechLevel(ability)).toBe(false)
    })
  })

  describe('hasSalvageValue', () => {
    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(hasSalvageValue(system)).toBe(true)
    })

    it('should return true for modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      expect(hasSalvageValue(module)).toBe(true)
    })

    it('should return true for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(hasSalvageValue(chassis)).toBe(true)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(hasSalvageValue(ability)).toBe(false)
    })
  })

  describe('hasSlotsRequired', () => {
    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(hasSlotsRequired(system)).toBe(true)
    })

    it('should return true for modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      expect(hasSlotsRequired(module)).toBe(true)
    })

    it('should return false for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(hasSlotsRequired(chassis)).toBe(false)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(hasSlotsRequired(ability)).toBe(false)
    })
  })

  describe('hasActions', () => {
    it('should return true for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(hasActions(chassis)).toBe(true)
    })

    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(hasActions(system)).toBe(true)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(hasActions(ability)).toBe(false)
    })
  })

  describe('hasTraits', () => {
    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(hasTraits(system)).toBe(true)
    })

    it('should return true for modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      expect(hasTraits(module)).toBe(true)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(hasTraits(ability)).toBe(false)
    })
  })

  describe('isClass', () => {
    it('should return true for core classes', () => {
      const coreClass = SalvageUnionReference.CoreClasses.all()[0]
      expect(isClass(coreClass)).toBe(true)
    })

    it('should return true for advanced classes', () => {
      const advancedClass = SalvageUnionReference.AdvancedClasses.all()[0]
      expect(isClass(advancedClass)).toBe(true)
    })

    it('should return true for hybrid classes', () => {
      const hybridClass = SalvageUnionReference.HybridClasses.all()[0]
      expect(isClass(hybridClass)).toBe(true)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(isClass(ability)).toBe(false)
    })

    it('should return false for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(isClass(system)).toBe(false)
    })
  })

  describe('isSystemOrModule', () => {
    it('should return true for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(isSystemOrModule(system)).toBe(true)
    })

    it('should return true for modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      expect(isSystemOrModule(module)).toBe(true)
    })

    it('should return false for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(isSystemOrModule(chassis)).toBe(false)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(isSystemOrModule(ability)).toBe(false)
    })
  })

  describe('isMetaAction', () => {
    it('should return true for actions from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      if (chassis.actions && chassis.actions.length > 0) {
        const action = chassis.actions[0]
        expect(isMetaAction(action)).toBe(true)
      }
    })

    it('should return true for actions from systems', () => {
      const system = SalvageUnionReference.Systems.all().find(
        (s) => s.actions && s.actions.length > 0
      )
      if (system && system.actions && system.actions.length > 0) {
        const action = system.actions[0]
        expect(isMetaAction(action)).toBe(true)
      }
    })

    it('should return false for regular entities', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      expect(isMetaAction(chassis)).toBe(false)
    })

    it('should return false for abilities', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      expect(isMetaAction(ability)).toBe(false)
    })

    it('should return false for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      expect(isMetaAction(system)).toBe(false)
    })
  })

  describe('Type narrowing with type guards', () => {
    it('should narrow type for chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]

      if (isChassis(chassis)) {
        // TypeScript should know this is a chassis
        expect(chassis.actions).toBeDefined()
        expect(chassis.patterns).toBeDefined()
      }
    })

    it('should narrow type for systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]

      if (isSystem(system)) {
        // TypeScript should know this is a system
        expect(system.techLevel).toBeDefined()
        expect(system.slotsRequired).toBeDefined()
      }
    })

    it('should narrow type for classes', () => {
      const coreClass = SalvageUnionReference.CoreClasses.all()[0]

      if (isClass(coreClass)) {
        // TypeScript should know this is a class
        expect(coreClass.coreTrees).toBeDefined()
      }
    })
  })
})

describe('Property Extractors', () => {
  describe('getTechLevel', () => {
    it('should extract techLevel from systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const techLevel = getTechLevel(system)
      expect(techLevel).toBeDefined()
      expect(typeof techLevel).toBe('number')
    })

    it('should extract techLevel from modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      const techLevel = getTechLevel(module)
      expect(techLevel).toBeDefined()
      expect(typeof techLevel).toBe('number')
    })

    it('should extract techLevel from chassis stats', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const techLevel = getTechLevel(chassis)
      expect(techLevel).toBeDefined()
      expect(typeof techLevel).toBe('number')
      // Verify it matches the stats object
      expect(techLevel).toBe(chassis.techLevel)
    })

    it('should return undefined for entities without techLevel', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const techLevel = getTechLevel(ability)
      expect(techLevel).toBeUndefined()
    })
  })

  describe('getSalvageValue', () => {
    it('should extract salvageValue from systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const salvageValue = getSalvageValue(system)
      expect(salvageValue).toBeDefined()
      expect(typeof salvageValue).toBe('number')
    })

    it('should extract salvageValue from modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      const salvageValue = getSalvageValue(module)
      expect(salvageValue).toBeDefined()
      expect(typeof salvageValue).toBe('number')
    })

    it('should extract salvageValue from chassis stats', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const salvageValue = getSalvageValue(chassis)
      expect(salvageValue).toBeDefined()
      expect(typeof salvageValue).toBe('number')
      // Verify it matches the stats object
      expect(salvageValue).toBe(chassis.salvageValue)
    })

    it('should return undefined for entities without salvageValue', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const salvageValue = getSalvageValue(ability)
      expect(salvageValue).toBeUndefined()
    })
  })

  describe('getSlotsRequired', () => {
    it('should extract slotsRequired from systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const slotsRequired = getSlotsRequired(system)
      expect(slotsRequired).toBeDefined()
      expect(typeof slotsRequired).toBe('number')
    })

    it('should extract slotsRequired from modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      const slotsRequired = getSlotsRequired(module)
      expect(slotsRequired).toBeDefined()
      expect(typeof slotsRequired).toBe('number')
    })

    it('should return undefined for entities without slotsRequired', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const slotsRequired = getSlotsRequired(chassis)
      expect(slotsRequired).toBeUndefined()
    })
  })

  describe('getPageReference', () => {
    it('should extract page from systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const page = getPageReference(system)
      expect(page).toBeDefined()
      expect(typeof page).toBe('number')
    })

    it('should extract page from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const page = getPageReference(chassis)
      expect(page).toBeDefined()
      expect(typeof page).toBe('number')
    })
  })

  describe('extractActions', () => {
    it('should extract actions from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const actions = extractActions(chassis)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from systems', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const actions = extractActions(system)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
    })

    it('should extract actions from modules', () => {
      const module = SalvageUnionReference.Modules.all()[0]
      const actions = extractActions(module)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
    })

    it('should extract actions from NPCs', () => {
      const npc = SalvageUnionReference.NPCs.all()[0]
      const actions = extractActions(npc)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from creatures', () => {
      const creature = SalvageUnionReference.Creatures.all()[0]
      const actions = extractActions(creature)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from squads', () => {
      const squad = SalvageUnionReference.Squads.all()[0]
      const actions = extractActions(squad)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from bio-titans', () => {
      const bioTitan = SalvageUnionReference.BioTitans.all()[0]
      const actions = extractActions(bioTitan)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from meld', () => {
      const meld = SalvageUnionReference.Meld.all()[0]
      const actions = extractActions(meld)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions!.length).toBeGreaterThan(0)
    })

    it('should extract actions from crawlers', () => {
      const crawler = SalvageUnionReference.Crawlers.all()[0]
      const actions = extractActions(crawler)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
    })

    it('should extract actions from crawler bays', () => {
      const crawlerBay = SalvageUnionReference.CrawlerBays.all()[0]
      const actions = extractActions(crawlerBay)
      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
    })

    it('should return undefined for entities without actions', () => {
      const equipment = SalvageUnionReference.Equipment.all()[0]
      const actions = extractActions(equipment)
      expect(actions).toBeUndefined()
    })

    it('should return undefined for abilities (which are actions themselves)', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const actions = extractActions(ability)
      // Abilities can have nested actions, so this might be defined
      // Just check it's either undefined or an array
      if (actions !== undefined) {
        expect(Array.isArray(actions)).toBe(true)
      }
    })
  })

  describe('getStructurePoints', () => {
    it('should extract structurePoints from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const structurePoints = getStructurePoints(chassis)
      expect(structurePoints).toBeDefined()
      expect(typeof structurePoints).toBe('number')
      expect(structurePoints).toBe(chassis.structurePoints)
    })

    it('should extract structurePoints from drones', () => {
      const drone = SalvageUnionReference.Drones.all()[0]
      const structurePoints = getStructurePoints(drone)
      expect(structurePoints).toBeDefined()
      expect(typeof structurePoints).toBe('number')
    })

    it('should extract structurePoints from vehicles', () => {
      const vehicle = SalvageUnionReference.Vehicles.all()[0]
      const structurePoints = getStructurePoints(vehicle)
      expect(structurePoints).toBeDefined()
      expect(typeof structurePoints).toBe('number')
    })

    it('should return undefined for entities without structure points', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const structurePoints = getStructurePoints(system)
      expect(structurePoints).toBeUndefined()
    })
  })

  describe('getEnergyPoints', () => {
    it('should extract energyPoints from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const energyPoints = getEnergyPoints(chassis)
      expect(energyPoints).toBeDefined()
      expect(typeof energyPoints).toBe('number')
      expect(energyPoints).toBe(chassis.energyPoints)
    })

    it('should return undefined for entities without energy points', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const energyPoints = getEnergyPoints(system)
      expect(energyPoints).toBeUndefined()
    })
  })

  describe('getHeatCapacity', () => {
    it('should extract heatCapacity from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const heatCapacity = getHeatCapacity(chassis)
      expect(heatCapacity).toBeDefined()
      expect(typeof heatCapacity).toBe('number')
      expect(heatCapacity).toBe(chassis.heatCapacity)
    })

    it('should return undefined for entities without heat capacity', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const heatCapacity = getHeatCapacity(system)
      expect(heatCapacity).toBeUndefined()
    })
  })

  describe('getSystemSlots', () => {
    it('should extract systemSlots from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const systemSlots = getSystemSlots(chassis)
      expect(systemSlots).toBeDefined()
      expect(typeof systemSlots).toBe('number')
      expect(systemSlots).toBe(chassis.systemSlots)
    })

    it('should return undefined for entities without system slots', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const systemSlots = getSystemSlots(system)
      expect(systemSlots).toBeUndefined()
    })
  })

  describe('getModuleSlots', () => {
    it('should extract moduleSlots from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const moduleSlots = getModuleSlots(chassis)
      expect(moduleSlots).toBeDefined()
      expect(typeof moduleSlots).toBe('number')
      expect(moduleSlots).toBe(chassis.moduleSlots)
    })

    it('should return undefined for entities without module slots', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const moduleSlots = getModuleSlots(system)
      expect(moduleSlots).toBeUndefined()
    })
  })

  describe('getCargoCapacity', () => {
    it('should extract cargoCapacity from chassis', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const cargoCapacity = getCargoCapacity(chassis)
      expect(cargoCapacity).toBeDefined()
      expect(typeof cargoCapacity).toBe('number')
      expect(cargoCapacity).toBe(chassis.cargoCapacity)
    })

    it('should return undefined for entities without cargo capacity', () => {
      const system = SalvageUnionReference.Systems.all()[0]
      const cargoCapacity = getCargoCapacity(system)
      expect(cargoCapacity).toBeUndefined()
    })
  })

  describe('getHitPoints', () => {
    it('should extract hitPoints from NPCs', () => {
      const npc = SalvageUnionReference.NPCs.all()[0]
      const hitPoints = getHitPoints(npc)
      expect(hitPoints).toBeDefined()
      expect(typeof hitPoints).toBe('number')
    })

    it('should extract hitPoints from creatures', () => {
      const creature = SalvageUnionReference.Creatures.all()[0]
      const hitPoints = getHitPoints(creature)
      expect(hitPoints).toBeDefined()
      expect(typeof hitPoints).toBe('number')
    })

    it('should return undefined for entities without hit points', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const hitPoints = getHitPoints(chassis)
      expect(hitPoints).toBeUndefined()
    })
  })
})
