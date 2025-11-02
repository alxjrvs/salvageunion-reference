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
