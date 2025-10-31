import { describe, expect, it } from 'bun:test'
import { SalvageUnionReference } from './index.js'
import { BaseModel } from './BaseModel.js'
import {
  isAbility,
  isSystem,
  isModule,
  isChassis,
  getTechLevel,
  getSalvageValue,
  getPageReference,
} from './utilities.js'

describe('SalvageUnionReference static properties', () => {
  it('should have all model properties defined and returning data', () => {
    // Get all static properties from the class
    const staticProps = Object.getOwnPropertyNames(
      SalvageUnionReference
    ).filter((prop) => {
      // Filter out constructor and methods
      const methodNames = [
        'length',
        'prototype',
        'name',
        'findIn',
        'findAllIn',
        'search',
        'searchIn',
        'getSuggestions',
        'get',
        'exists',
        'getMany',
        'composeRef',
        'parseRef',
        'getByRef',
        'entityCache',
      ]
      return !methodNames.includes(prop)
    })

    // Ensure we found some properties
    expect(staticProps.length).toBeGreaterThan(0)

    // Test each static property
    for (const propName of staticProps) {
      const prop =
        SalvageUnionReference[propName as keyof typeof SalvageUnionReference]

      // Check that the property is defined
      expect(prop).toBeDefined()
      expect(prop).not.toBeUndefined()
      expect(prop).not.toBeNull()

      // Check that it's a BaseModel instance
      expect(prop).toBeInstanceOf(BaseModel)

      // Check that it has the expected methods
      expect(typeof (prop as BaseModel<unknown>).all).toBe('function')
      expect(typeof (prop as BaseModel<unknown>).find).toBe('function')
      expect(typeof (prop as BaseModel<unknown>).findAll).toBe('function')

      // Check that .all() returns an array
      const allData = (prop as BaseModel<unknown>).all()
      expect(Array.isArray(allData)).toBe(true)

      // Log for debugging
      console.log(`✓ ${propName}: ${allData.length} items`)
    }
  })

  it('should have specific expected models', () => {
    // Test a few key models explicitly
    const expectedModels = [
      'Abilities',
      'Chassis',
      'Systems',
      'Modules',
      'Equipment',
      'NPCs',
      'Creatures',
      'Vehicles',
    ]

    for (const modelName of expectedModels) {
      const model =
        SalvageUnionReference[modelName as keyof typeof SalvageUnionReference]
      expect(model).toBeDefined()
      expect(model).toBeInstanceOf(BaseModel)
      expect((model as BaseModel<unknown>).all().length).toBeGreaterThan(0)
    }
  })
})

describe('SalvageUnionReference.findIn', () => {
  it('should find a single ability by name', () => {
    const ability = SalvageUnionReference.findIn(
      'abilities',
      (a) => a.name === 'Engineering Expertise'
    )
    expect(ability).toBeDefined()
    expect(ability?.name).toBe('Engineering Expertise')
  })

  it('should find a single system by tech level', () => {
    const system = SalvageUnionReference.findIn(
      'systems',
      (s) => s.techLevel === 1
    )
    expect(system).toBeDefined()
    expect(system?.techLevel).toBe(1)
  })

  it('should return undefined when no match is found', () => {
    const ability = SalvageUnionReference.findIn(
      'abilities',
      (a) => a.name === 'NonExistentAbility'
    )
    expect(ability).toBeUndefined()
  })

  it('should work with different schema types', () => {
    const crawler = SalvageUnionReference.findIn(
      'crawlers',
      (c) => c.name === 'Augmented'
    )
    expect(crawler).toBeDefined()
    expect(crawler?.name).toBe('Augmented')
  })
})

describe('SalvageUnionReference.findAllIn', () => {
  it('should find all abilities at a specific level', () => {
    const abilities = SalvageUnionReference.findAllIn(
      'abilities',
      (a) => a.level === 1
    )
    expect(abilities.length).toBeGreaterThan(0)
    expect(abilities.every((a) => a.level === 1)).toBe(true)
  })

  it('should find all systems with a specific trait', () => {
    const energySystems = SalvageUnionReference.findAllIn(
      'systems',
      (s) => s.traits?.some((t) => t.type === 'energy') ?? false
    )
    expect(energySystems.length).toBeGreaterThan(0)
    expect(
      energySystems.every(
        (s) => s.traits?.some((t) => t.type === 'energy') ?? false
      )
    ).toBe(true)
  })

  it('should return empty array when no matches are found', () => {
    const abilities = SalvageUnionReference.findAllIn(
      'abilities',
      (a) => a.level === 999
    )
    expect(abilities).toEqual([])
  })

  it('should work with different schema types', () => {
    const tech1Modules = SalvageUnionReference.findAllIn(
      'modules',
      (m) => m.techLevel === 1
    )
    expect(tech1Modules.length).toBeGreaterThan(0)
    expect(tech1Modules.every((m) => m.techLevel === 1)).toBe(true)
  })

  it('should find all core classes', () => {
    const coreClasses = SalvageUnionReference.findAllIn(
      'classes.core',
      () => true
    )
    expect(coreClasses.length).toBeGreaterThan(0)
  })
})

describe('SalvageUnionReference.get', () => {
  it('should get an entity by schema name and ID', () => {
    // First, find an ability to get its ID
    const allAbilities = SalvageUnionReference.Abilities.all()
    const firstAbility = allAbilities[0]

    // Now use get() to retrieve it
    const ability = SalvageUnionReference.get('abilities', firstAbility.id)
    expect(ability).toBeDefined()
    expect(ability?.id).toBe(firstAbility.id)
    expect(ability?.name).toBe(firstAbility.name)
  })

  it('should return undefined for non-existent ID', () => {
    const ability = SalvageUnionReference.get('abilities', 'non-existent-id')
    expect(ability).toBeUndefined()
  })

  it('should work with different schema types', () => {
    const allSystems = SalvageUnionReference.Systems.all()
    const firstSystem = allSystems[0]

    const system = SalvageUnionReference.get('systems', firstSystem.id)
    expect(system).toBeDefined()
    expect(system?.id).toBe(firstSystem.id)
  })

  it('should use caching for repeated lookups', () => {
    const allAbilities = SalvageUnionReference.Abilities.all()
    const firstAbility = allAbilities[0]

    // First lookup
    const ability1 = SalvageUnionReference.get('abilities', firstAbility.id)
    // Second lookup (should use cache)
    const ability2 = SalvageUnionReference.get('abilities', firstAbility.id)

    expect(ability1).toBe(ability2) // Same reference
  })
})

describe('SalvageUnionReference.exists', () => {
  it('should return true for existing entity', () => {
    const allAbilities = SalvageUnionReference.Abilities.all()
    const firstAbility = allAbilities[0]

    const exists = SalvageUnionReference.exists('abilities', firstAbility.id)
    expect(exists).toBe(true)
  })

  it('should return false for non-existent entity', () => {
    const exists = SalvageUnionReference.exists('abilities', 'non-existent-id')
    expect(exists).toBe(false)
  })
})

describe('SalvageUnionReference.getMany', () => {
  it('should get multiple entities', () => {
    const allAbilities = SalvageUnionReference.Abilities.all()
    const allSystems = SalvageUnionReference.Systems.all()

    const entities = SalvageUnionReference.getMany([
      { schemaName: 'abilities', id: allAbilities[0].id },
      { schemaName: 'systems', id: allSystems[0].id },
    ])

    expect(entities.length).toBe(2)
    expect(entities[0]).toBeDefined()
    expect(entities[1]).toBeDefined()
    expect(entities[0]?.id).toBe(allAbilities[0].id)
    expect(entities[1]?.id).toBe(allSystems[0].id)
  })

  it('should return undefined for non-existent entities', () => {
    const entities = SalvageUnionReference.getMany([
      { schemaName: 'abilities', id: 'non-existent-1' },
      { schemaName: 'systems', id: 'non-existent-2' },
    ])

    expect(entities.length).toBe(2)
    expect(entities[0]).toBeUndefined()
    expect(entities[1]).toBeUndefined()
  })
})

describe('SalvageUnionReference.composeRef', () => {
  it('should compose a reference string', () => {
    const ref = SalvageUnionReference.composeRef('abilities', 'test-id')
    expect(ref).toBe('abilities::test-id')
  })
})

describe('SalvageUnionReference.parseRef', () => {
  it('should parse a valid reference string', () => {
    const parsed = SalvageUnionReference.parseRef('abilities::test-id')
    expect(parsed).toBeDefined()
    expect(parsed?.schemaName).toBe('abilities')
    expect(parsed?.id).toBe('test-id')
  })

  it('should return null for invalid reference string', () => {
    const parsed = SalvageUnionReference.parseRef('invalid-ref')
    expect(parsed).toBeNull()
  })

  it('should return null for invalid schema name', () => {
    const parsed = SalvageUnionReference.parseRef('invalid-schema::test-id')
    expect(parsed).toBeNull()
  })
})

describe('SalvageUnionReference.getByRef', () => {
  it('should get an entity by reference string', () => {
    const allAbilities = SalvageUnionReference.Abilities.all()
    const firstAbility = allAbilities[0]

    const ref = SalvageUnionReference.composeRef('abilities', firstAbility.id)
    const entity = SalvageUnionReference.getByRef(ref)

    expect(entity).toBeDefined()
    expect(entity?.id).toBe(firstAbility.id)
  })

  it('should return undefined for invalid reference', () => {
    const entity = SalvageUnionReference.getByRef('invalid-ref')
    expect(entity).toBeUndefined()
  })
})

describe('Type Guards', () => {
  it('should correctly identify abilities', () => {
    const ability = SalvageUnionReference.Abilities.all()[0]
    expect(isAbility(ability)).toBe(true)
    expect(isSystem(ability)).toBe(false)
  })

  it('should correctly identify systems', () => {
    const system = SalvageUnionReference.Systems.all()[0]
    expect(isSystem(system)).toBe(true)
    expect(isAbility(system)).toBe(false)
  })

  it('should correctly identify modules', () => {
    const module = SalvageUnionReference.Modules.all()[0]
    expect(isModule(module)).toBe(true)
    expect(isAbility(module)).toBe(false)
  })

  it('should correctly identify chassis', () => {
    const chassis = SalvageUnionReference.Chassis.all()[0]
    expect(isChassis(chassis)).toBe(true)
    expect(isAbility(chassis)).toBe(false)
  })

  it('should return false for null or undefined', () => {
    expect(isAbility(null as any)).toBe(false)
    expect(isAbility(undefined as any)).toBe(false)
  })
})

describe('Property Extractors', () => {
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

  it('should return undefined for entities without techLevel', () => {
    const ability = SalvageUnionReference.Abilities.all()[0]
    const techLevel = getTechLevel(ability)
    expect(techLevel).toBeUndefined()
  })

  it('should extract salvageValue from systems', () => {
    const system = SalvageUnionReference.Systems.all()[0]
    const salvageValue = getSalvageValue(system)
    expect(salvageValue).toBeDefined()
    expect(typeof salvageValue).toBe('number')
  })

  it('should extract page reference from all entities', () => {
    const ability = SalvageUnionReference.Abilities.all()[0]
    const system = SalvageUnionReference.Systems.all()[0]

    const abilityPage = getPageReference(ability)
    const systemPage = getPageReference(system)

    expect(abilityPage).toBeDefined()
    expect(systemPage).toBeDefined()
    expect(typeof abilityPage).toBe('number')
    expect(typeof systemPage).toBe('number')
  })
})
