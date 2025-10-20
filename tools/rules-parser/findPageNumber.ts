#!/usr/bin/env tsx

/**
 * Find Page Number Tool for Salvage Union Core Book
 *
 * This tool finds the page number for a specific item by name.
 * It searches for the item name and returns the most likely page number.
 *
 * Usage:
 *   tsx tools/rules-parser/findPageNumber.ts "Item Name"
 *   tsx tools/rules-parser/findPageNumber.ts --type system "System Name"
 *   tsx tools/rules-parser/findPageNumber.ts --type ability "Ability Name"
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')
const pdfParse = PDFParse

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PDF_PATH = path.join(
  __dirname,
  '../../.rules/Salvage Union Core Book Digital Edition 2.0a.pdf'
)

interface PageMatch {
  page: number
  confidence: 'high' | 'medium' | 'low'
  matchedText: string
  context: string
}

async function findPageNumber(
  itemName: string,
  itemType?: string
): Promise<PageMatch[]> {
  try {
    const matches: PageMatch[] = []

    // Create search patterns with different confidence levels
    const escapedName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Extract text page by page
    const parser = new pdfParse({ url: PDF_PATH })
    const fullResult = await parser.getText({ first: 1 })
    const totalPages = fullResult.total

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const result = await parser.getText({ partial: [pageNum] })
      const pageText = result.text

      // Look for the actual page number in the format "-- X of Y --\n\nPAGENUM"
      const pageMarkerMatch = pageText.match(
        /--\s*\d+\s*of\s*\d+\s*--\s*\n+\s*(\d+)/
      )
      const actualPageNum = pageMarkerMatch
        ? parseInt(pageMarkerMatch[1])
        : null

      // Check for exact match at start of text (highest confidence)
      const exactStartPattern = new RegExp(`^\\s*${escapedName}\\s`, 'i')
      const exactStartMatch = pageText.match(exactStartPattern)
      if (exactStartMatch) {
        const context = getContext(pageText, exactStartMatch.index || 0)
        matches.push({
          page: actualPageNum || pageNum,
          confidence: 'high',
          matchedText: exactStartMatch[0].trim(),
          context,
        })
        break
      }

      // Check for match after period or newline (header-like, medium-high confidence)
      const headerPattern = new RegExp(`[.\\n]\\s*${escapedName}\\s`, 'i')
      const headerMatch = pageText.match(headerPattern)
      if (headerMatch) {
        const context = getContext(pageText, headerMatch.index || 0)
        matches.push({
          page: actualPageNum || pageNum,
          confidence: 'high',
          matchedText: headerMatch[0].trim(),
          context,
        })
        break
      }

      // Check for any mention (low confidence)
      const anywherePattern = new RegExp(escapedName, 'i')
      const anyMatch = pageText.match(anywherePattern)
      if (anyMatch) {
        const context = getContext(pageText, anyMatch.index || 0)
        matches.push({
          page: actualPageNum || pageNum,
          confidence: 'low',
          matchedText: anyMatch[0],
          context,
        })
      }
    }

    await parser.destroy()

    // Sort by confidence and page number
    matches.sort((a, b) => {
      const confidenceOrder = { high: 0, medium: 1, low: 2 }
      const confDiff =
        confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
      return confDiff !== 0 ? confDiff : a.page - b.page
    })

    return matches
  } catch (error) {
    console.error('Error finding page number:', error)
    throw error
  }
}

function getContext(
  text: string,
  matchIndex: number,
  contextChars: number = 200
): string {
  const start = Math.max(0, matchIndex - contextChars)
  const end = Math.min(text.length, matchIndex + contextChars)
  return text.slice(start, end)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage:')
    console.log('  tsx .rules/findPageNumber.ts "Item Name"')
    console.log('  tsx .rules/findPageNumber.ts --type system "System Name"')
    console.log('  tsx .rules/findPageNumber.ts --type ability "Ability Name"')
    process.exit(1)
  }

  let itemType: string | undefined
  let itemName: string

  if (args[0] === '--type') {
    itemType = args[1]
    itemName = args[2]
  } else {
    itemName = args[0]
  }

  if (!itemName) {
    console.error('No item name provided')
    process.exit(1)
  }

  try {
    console.log(
      `Searching for: "${itemName}"${itemType ? ` (type: ${itemType})` : ''}...`
    )
    const matches = await findPageNumber(itemName, itemType)

    if (matches.length === 0) {
      console.log('No matches found.')
    } else {
      console.log(`\nFound ${matches.length} potential match(es):\n`)

      // Show top 5 matches
      const topMatches = matches.slice(0, 5)
      topMatches.forEach((match, index) => {
        console.log(
          `${index + 1}. Page ${match.page} (${match.confidence} confidence)`
        )
        console.log(`   Matched: "${match.matchedText}"`)
        console.log(`   Context:`)
        console.log(
          match.context
            .split('\n')
            .map((line) => `   ${line}`)
            .join('\n')
        )
        console.log()
      })

      // Output JSON for programmatic use
      console.log('\n--- JSON OUTPUT ---')
      console.log(JSON.stringify(topMatches, null, 2))
    }
  } catch (error) {
    console.error('Failed to find page number:', error)
    process.exit(1)
  }
}

main()
