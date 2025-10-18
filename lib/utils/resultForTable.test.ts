import { describe, it, expect } from 'vitest'
import { resultForTable } from './resultForTable.js'
import type { Table } from '../types/inferred.js'

const mockStandardTable: Table = {
  id: 'test-standard',
  source: 'core',
  name: 'Test Standard',
  section: 'test',
  rollTable: {
    '1': 'Critical Failure',
    '2-5': 'Failure',
    '6-10': 'Partial Success',
    '11-19': 'Success',
    '20': 'Critical Success',
    type: 'standard',
  },
  page: 1,
}

const mockFlatTable: Table = {
  id: 'test-flat',
  source: 'core',
  name: 'Test Flat',
  section: 'test',
  rollTable: {
    '1': 'Result 1',
    '2': 'Result 2',
    '3': 'Result 3',
    '4': 'Result 4',
    '5': 'Result 5',
    '6': 'Result 6',
    '7': 'Result 7',
    '8': 'Result 8',
    '9': 'Result 9',
    '10': 'Result 10',
    '11': 'Result 11',
    '12': 'Result 12',
    '13': 'Result 13',
    '14': 'Result 14',
    '15': 'Result 15',
    '16': 'Result 16',
    '17': 'Result 17',
    '18': 'Result 18',
    '19': 'Result 19',
    '20': 'Result 20',
    type: 'flat',
  },
  page: 1,
}

const mockFullTable: Table = {
  id: 'test-full',
  source: 'core',
  name: 'Test Full',
  section: 'test',
  rollTable: {
    '1': 'Full Result 1',
    '2': 'Full Result 2',
    '3': 'Full Result 3',
    '4': 'Full Result 4',
    '5': 'Full Result 5',
    '6': 'Full Result 6',
    '7': 'Full Result 7',
    '8': 'Full Result 8',
    '9': 'Full Result 9',
    '10': 'Full Result 10',
    '11': 'Full Result 11',
    '12': 'Full Result 12',
    '13': 'Full Result 13',
    '14': 'Full Result 14',
    '15': 'Full Result 15',
    '16': 'Full Result 16',
    '17': 'Full Result 17',
    '18': 'Full Result 18',
    '19': 'Full Result 19',
    '20': 'Full Result 20',
    type: 'full',
  },
  page: 1,
}

describe('resultForTable', () => {
  describe('Error Handling', () => {
    it('should return error when tableData is undefined', () => {
      const result = resultForTable(undefined, 10)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.result).toContain('undefined')
      }
    })

    it('should return error when roll is below 1', () => {
      const result = resultForTable(mockStandardTable.rollTable, 0)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.result).toContain('between 1 and 20')
      }
    })

    it('should return error when roll is above 20', () => {
      const result = resultForTable(mockStandardTable.rollTable, 21)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.result).toContain('between 1 and 20')
      }
    })

    it('should return error when roll is negative', () => {
      const result = resultForTable(mockStandardTable.rollTable, -5)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.result).toContain('between 1 and 20')
      }
    })
  })

  describe('Standard Table Type', () => {
    it('should return result for roll 1', () => {
      const result = resultForTable(mockStandardTable.rollTable, 1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Critical Failure')
      }
    })

    it('should return result for roll in 2-5 range', () => {
      const result = resultForTable(mockStandardTable.rollTable, 3)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Failure')
      }
    })

    it('should return result for roll in 6-10 range', () => {
      const result = resultForTable(mockStandardTable.rollTable, 8)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Partial Success')
      }
    })

    it('should return result for roll in 11-19 range', () => {
      const result = resultForTable(mockStandardTable.rollTable, 15)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Success')
      }
    })

    it('should return result for roll 20', () => {
      const result = resultForTable(mockStandardTable.rollTable, 20)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Critical Success')
      }
    })
  })

  describe('Flat Table Type', () => {
    it('should return result for roll 1', () => {
      const result = resultForTable(mockFlatTable.rollTable, 1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Result 1')
      }
    })

    it('should return result for roll 10', () => {
      const result = resultForTable(mockFlatTable.rollTable, 10)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Result 10')
      }
    })

    it('should return result for roll 20', () => {
      const result = resultForTable(mockFlatTable.rollTable, 20)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Result 20')
      }
    })

    it('should return correct result for each individual roll', () => {
      for (let i = 1; i <= 20; i++) {
        const result = resultForTable(mockFlatTable.rollTable, i)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.result).toBe(`Result ${i}`)
        }
      }
    })
  })

  describe('Full Table Type', () => {
    it('should return result for roll 1', () => {
      const result = resultForTable(mockFullTable.rollTable, 1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Full Result 1')
      }
    })

    it('should return result for roll 15', () => {
      const result = resultForTable(mockFullTable.rollTable, 15)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Full Result 15')
      }
    })

    it('should return result for roll 20', () => {
      const result = resultForTable(mockFullTable.rollTable, 20)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.result).toBe('Full Result 20')
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle boundary values correctly for standard table', () => {
      expect(resultForTable(mockStandardTable.rollTable, 0).success).toBe(false)
      expect(resultForTable(mockStandardTable.rollTable, 1).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 2).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 5).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 6).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 10).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 11).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 19).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 20).success).toBe(true)
      expect(resultForTable(mockStandardTable.rollTable, 21).success).toBe(
        false
      )
    })
  })
})
