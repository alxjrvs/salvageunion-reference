import { describe, expect, it } from 'bun:test'
import { SalvageUnionReference } from './index.js'
import { BaseModel } from './BaseModel.js'

describe('SalvageUnionReference static properties', () => {
  it('should have all model properties defined and returning data', () => {
    // Get all static properties from the class
    const staticProps = Object.getOwnPropertyNames(
      SalvageUnionReference
    ).filter((prop) => {
      // Filter out constructor and methods (findIn, findAllIn)
      return (
        prop !== 'length' &&
        prop !== 'prototype' &&
        prop !== 'name' &&
        prop !== 'findIn' &&
        prop !== 'findAllIn'
      )
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
