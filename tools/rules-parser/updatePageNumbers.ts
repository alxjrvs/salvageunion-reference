#!/usr/bin/env tsx
/**
 * Update page numbers and sources in all data files by looking them up in the PDF
 *
 * Usage:
 *   tsx tools/rules-parser/updatePageNumbers.ts
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

const DATA_DIR = path.join(__dirname, '../../data')

interface PageMatch {
  page: number
  confidence: 'high' | 'medium' | 'low'
  matchedText: string
  context: string
}

async function findPageNumber(itemName: string): Promise<number | null> {
  try {
    const escapedName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Get total page count first
    const parser = new pdfParse({ url: PDF_PATH })
    const fullResult = await parser.getText({ first: 1 })
    const totalPages = fullResult.total

    let bestMatch: PageMatch | null = null

    // Search through each page
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

      // High confidence: exact match as a header or near top of page
      const headerPattern = new RegExp(`^[\\s\\S]{0,200}${escapedName}`, 'i')
      if (headerPattern.test(pageText)) {
        if (!bestMatch || bestMatch.confidence !== 'high') {
          bestMatch = {
            page: actualPageNum || pageNum,
            confidence: 'high',
            matchedText: itemName,
            context: pageText.substring(0, 300),
          }
          break // Found high confidence match, stop searching
        }
      }

      // Medium confidence: appears as a header-like pattern
      const mediumPattern = new RegExp(`\\n${escapedName}\\n`, 'i')
      if (mediumPattern.test(pageText) && !bestMatch) {
        bestMatch = {
          page: actualPageNum || pageNum,
          confidence: 'medium',
          matchedText: itemName,
          context: pageText.substring(0, 300),
        }
      }

      // Low confidence: just appears on the page
      const lowPattern = new RegExp(escapedName, 'i')
      if (lowPattern.test(pageText) && !bestMatch) {
        bestMatch = {
          page: actualPageNum || pageNum,
          confidence: 'low',
          matchedText: itemName,
          context: pageText.substring(0, 300),
        }
      }
    }

    await parser.destroy()
    return bestMatch ? bestMatch.page : null
  } catch (error) {
    console.error(`Error finding page for "${itemName}":`, error)
    return null
  }
}

async function updateDataFile(filename: string) {
  const filePath = path.join(DATA_DIR, filename)
  console.log(`\n📄 Processing ${filename}...`)

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  let updated = 0
  let failed = 0

  for (let i = 0; i < data.length; i++) {
    const item = data[i]

    // Update source if missing
    if (!item.source || item.source === '') {
      item.source = 'Salvage Union Core Book'
      updated++
    }

    // Find and update page number
    if (item.name) {
      console.log(`  Looking up: ${item.name}`)
      const pageNum = await findPageNumber(item.name)

      if (pageNum) {
        if (item.page !== pageNum) {
          console.log(`    ✓ Updated page: ${item.page} → ${pageNum}`)
          item.page = pageNum
          updated++
        } else {
          console.log(`    ✓ Page ${pageNum} confirmed`)
        }
      } else {
        console.log(`    ✗ Could not find page number`)
        failed++
      }
    }

    // Add a small delay to avoid overwhelming the system
    if (i % 10 === 0 && i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  // Write updated data back to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')

  console.log(`✅ ${filename}: ${updated} updates, ${failed} failures`)
}

async function main() {
  const dataFiles = [
    'abilities.json',
    'systems.json',
    'equipment.json',
    'modules.json',
    'chassis.json',
    'classes.json',
    'crawlers.json',
    'creatures.json',
    'drones.json',
    'bio-titans.json',
    'npcs.json',
    'squads.json',
    'vehicles.json',
    'traits.json',
    'keywords.json',
    'meld.json',
    'roll-tables.json',
  ]

  console.log('🚀 Starting page number and source update...\n')

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file)
    if (fs.existsSync(filePath)) {
      await updateDataFile(file)
    } else {
      console.log(`⚠️  Skipping ${file} (not found)`)
    }
  }

  console.log('\n✨ All files processed!')
}

main().catch(console.error)
