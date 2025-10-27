import { describe, expect, it } from 'bun:test'
import { SalvageUnionReference } from './index.js'

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
