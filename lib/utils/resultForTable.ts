import type { Table } from '../types/inferred.js'

/**
 * Result type for table roll resolution
 */
export type TableRollResult =
  | { success: true; result: string }
  | { success: false; error: string }

/**
 * Resolves a d20 roll against a table to get the result string
 *
 * @param tableData - The table data (Table or undefined)
 * @param roll - The d20 roll result (1-20)
 * @returns Object with success flag and either the result string or error message
 *
 * @example
 * const table = SalvageUnionReference.Tables.findByName('Core Mechanic');
 * const result = resultForTable(table, 15);
 * if (result.success) {
 *   console.log(result.result); // "Success: You have achieved your goal..."
 * } else {
 *   console.error(result.error);
 * }
 */
export function resultForTable(
  tableData: Table | undefined,
  roll: number
): TableRollResult {
  // Check if table data exists
  if (!tableData) {
    return {
      success: false,
      error: 'Table data is undefined',
    }
  }

  // Validate roll is within bounds
  if (roll < 1 || roll > 20) {
    return {
      success: false,
      error: `Roll must be between 1 and 20, got ${roll}`,
    }
  }

  const rollTable = tableData.rollTable
  if (!rollTable) {
    return {
      success: false,
      error: 'Table does not have a rollTable property',
    }
  }

  const tableType = (rollTable as Record<string, unknown>).type as string

  // Handle flat type tables - direct key lookup
  if (tableType === 'flat') {
    const result = (rollTable as Record<string, unknown>)[roll.toString()]
    if (result && typeof result === 'string') {
      return {
        success: true,
        result,
      }
    }
    return {
      success: false,
      error: `No result found for roll ${roll} in flat table`,
    }
  }

  // Handle range-based tables (standard, standard2, full, alternate)
  const rangeResult = findRangeResult(rollTable, roll, tableType)
  return rangeResult
}

/**
 * Finds the result for a given roll in a range-based table
 */
function findRangeResult(
  rollTable: Record<string, unknown>,
  roll: number,
  tableType: string
): TableRollResult {
  // Check for exact match first (e.g., "1" or "20")
  const exactKey = roll.toString()
  const exactResult = rollTable[exactKey]
  if (exactResult && typeof exactResult === 'string') {
    return {
      success: true,
      result: exactResult,
    }
  }

  // Define range mappings for each table type
  const rangeMap = getRangeMap(tableType)

  // Find which range the roll falls into
  for (const [range, rangeKey] of Object.entries(rangeMap)) {
    if (rollInRange(roll, range)) {
      const result = rollTable[rangeKey]
      if (result && typeof result === 'string') {
        return {
          success: true,
          result,
        }
      }
    }
  }

  return {
    success: false,
    error: `No result found for roll ${roll} in ${tableType} table`,
  }
}

/**
 * Gets the range mapping for a specific table type
 */
function getRangeMap(tableType: string): Record<string, string> {
  switch (tableType) {
    case 'standard':
      return {
        '1': '1',
        '2-5': '2-5',
        '6-10': '6-10',
        '11-19': '11-19',
        '20': '20',
      }
    case 'standard2':
    case 'alternate':
      return {
        '1': '1',
        '2-5': '2-5',
        '6-10': '6-10',
        '11-18': '11-18',
        '19-20': '19-20',
      }
    case 'full':
      // Full type has all 20 individual results
      return {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
        '19': '19',
        '20': '20',
      }
    default:
      return {}
  }
}

/**
 * Checks if a roll falls within a range string
 * Handles formats like "1", "2-5", "11-19", etc.
 */
function rollInRange(roll: number, range: string): boolean {
  // Single value
  if (!range.includes('-')) {
    return roll === parseInt(range, 10)
  }

  // Range format "X-Y"
  const [minStr, maxStr] = range.split('-')
  const min = parseInt(minStr, 10)
  const max = parseInt(maxStr, 10)

  return roll >= min && roll <= max
}
