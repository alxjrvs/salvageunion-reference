import { describe, expect, test } from 'bun:test'
import { SalvageUnionReference } from './index.js'
import {
  getDescription,
  getActivationCost,
  getActionType,
  getRange,
  getDamage,
  getTraits,
  getEffects,
  getTable,
  getOptions,
  getChoices,
} from './utilities.js'

describe('Action Property Getters', () => {
  describe('getDescription', () => {
    test('should get description from ability', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const description = getDescription(ability)
      expect(description).toBeDefined()
      expect(typeof description).toBe('string')
    })

    test('should return undefined for non-ability entities (deprecated)', () => {
      const chassis = SalvageUnionReference.Chassis.all()[0]
      const description = getDescription(chassis)
      expect(description).toBeUndefined()
    })
  })

  describe('getActivationCost', () => {
    test('should get activation cost from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all().find(
        (a) => a.name === 'Ace Pilot'
      )
      if (ability) {
        const cost = getActivationCost(ability)
        expect(cost).toBeDefined()
      }
    })
  })

  describe('getActionType', () => {
    test('should get action type from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all()[0]
      const actionType = getActionType(ability)
      expect(actionType).toBeDefined()
      expect(typeof actionType).toBe('string')
    })
  })

  describe('getRange', () => {
    test('should get range from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find(
        (s) => s.name === 'Assault Rifle'
      )
      if (system) {
        const range = getRange(system)
        expect(range).toBeDefined()
        expect(typeof range).toBe('string')
      }
    })
  })

  describe('getDamage', () => {
    test('should get damage from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find(
        (s) => s.name === 'Assault Rifle'
      )
      if (system) {
        const damage = getDamage(system)
        expect(damage).toBeDefined()
        expect(damage).toHaveProperty('damageType')
        expect(damage).toHaveProperty('amount')
      }
    })

    test('should get damage from chassis action (base level)', () => {
      const chassis = SalvageUnionReference.Chassis.all().find(
        (c) => c.actions && c.actions.length > 0 && c.actions[0].damage
      )
      if (chassis && chassis.actions && chassis.actions[0]) {
        const damage = getDamage(chassis.actions[0])
        expect(damage).toBeDefined()
      }
    })
  })

  describe('getTraits', () => {
    test('should get traits from system (action property)', () => {
      const system = SalvageUnionReference.Systems.all().find((s) => {
        const traits = getTraits(s)
        return traits && traits.length > 0
      })
      if (system) {
        const traits = getTraits(system)
        expect(traits).toBeDefined()
        expect(Array.isArray(traits)).toBe(true)
      }
    })

    test('should get traits from creature (base level)', () => {
      const creature = SalvageUnionReference.Creatures.all()[0]
      const traits = getTraits(creature)
      if (traits) {
        expect(Array.isArray(traits)).toBe(true)
      }
    })
  })

  describe('getEffects', () => {
    test('should get effects from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all().find((a) => {
        const effects = getEffects(a)
        return effects && effects.length > 0
      })
      if (ability) {
        const effects = getEffects(ability)
        expect(effects).toBeDefined()
        expect(Array.isArray(effects)).toBe(true)
        if (effects && effects.length > 0) {
          expect(effects[0]).toHaveProperty('value')
        }
      }
    })
  })

  describe('getTable', () => {
    test('should get table from crawler bay (base level)', () => {
      const crawlerBay = SalvageUnionReference.CrawlerBays.all().find((cb) => {
        const table = getTable(cb)
        return table !== undefined
      })
      if (crawlerBay) {
        const table = getTable(crawlerBay)
        expect(table).toBeDefined()
        expect(table).toHaveProperty('type')
      }
    })
  })

  describe('getOptions', () => {
    test('should get options from ability (action property)', () => {
      const ability = SalvageUnionReference.Abilities.all().find((a) => {
        const options = getOptions(a)
        return options && options.length > 0
      })
      if (ability) {
        const options = getOptions(ability)
        expect(options).toBeDefined()
        expect(Array.isArray(options)).toBe(true)
      }
    })
  })

  describe('getChoices', () => {
    test('should get choices from equipment (action property)', () => {
      const equipment = SalvageUnionReference.Equipment.all().find((e) => {
        const choices = getChoices(e)
        return choices && choices.length > 0
      })
      if (equipment) {
        const choices = getChoices(equipment)
        expect(choices).toBeDefined()
        expect(Array.isArray(choices)).toBe(true)
      }
    })
  })
})
