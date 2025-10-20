#!/usr/bin/env tsx

/**
 * PDF Search Tool for Salvage Union Core Book
 *
 * This tool searches for content in the PDF and returns matching pages.
 * Usage:
 *   tsx tools/rules-parser/pdfSearch.ts "search term"
 *   tsx tools/rules-parser/pdfSearch.ts --case-sensitive "Search Term"
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

interface SearchResult {
  page: number
  matches: string[]
  context: string
}

async function searchPdf(
  searchTerm: string,
  caseSensitive: boolean = false
): Promise<SearchResult[]> {
  try {
    const results: SearchResult[] = []
    const searchRegex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      caseSensitive ? 'g' : 'gi'
    )

    // Extract text using pdf-parse v2
    const parser = new pdfParse({ url: PDF_PATH })
    const pdfResult = await parser.getText()

    // Split text by pages - pdf-parse v2 doesn't provide per-page text directly
    // We'll use a simple heuristic: split by form feed or page breaks
    const pageTexts = pdfResult.text.split('\f').filter((t) => t.trim())

    pageTexts.forEach((pageText, index) => {
      const pageNum = index + 1
      const matches = pageText.match(searchRegex)

      if (matches && matches.length > 0) {
        // Get context around matches (show surrounding text)
        const words = pageText.split(/\s+/)
        const contextParts: string[] = []

        words.forEach((word, wordIndex) => {
          if (searchRegex.test(word)) {
            const start = Math.max(0, wordIndex - 20)
            const end = Math.min(words.length, wordIndex + 21)
            const context = words.slice(start, end).join(' ')
            if (!contextParts.includes(context)) {
              contextParts.push(context)
            }
          }
        })

        results.push({
          page: pageNum,
          matches: [...new Set(matches)],
          context: contextParts.join('\n---\n'),
        })
      }
    })

    return results
  } catch (error) {
    console.error('Error searching PDF:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage:')
    console.log('  tsx .rules/pdfSearch.ts "search term"')
    console.log('  tsx .rules/pdfSearch.ts --case-sensitive "Search Term"')
    process.exit(1)
  }

  let caseSensitive = false
  let searchTerm = args[0]

  if (args[0] === '--case-sensitive') {
    caseSensitive = true
    searchTerm = args[1]
  }

  if (!searchTerm) {
    console.error('No search term provided')
    process.exit(1)
  }

  try {
    console.log(
      `Searching for: "${searchTerm}" (case ${caseSensitive ? 'sensitive' : 'insensitive'})...`
    )
    const results = await searchPdf(searchTerm, caseSensitive)

    if (results.length === 0) {
      console.log('No matches found.')
    } else {
      console.log(`\nFound ${results.length} page(s) with matches:\n`)
      console.log(JSON.stringify(results, null, 2))
    }
  } catch (error) {
    console.error('Failed to search PDF:', error)
    process.exit(1)
  }
}

main()
