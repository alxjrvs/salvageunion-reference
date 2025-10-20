#!/usr/bin/env tsx

/**
 * PDF Reader Tool for Salvage Union Core Book
 *
 * This tool extracts text from the PDF with page numbers.
 * Usage:
 *   tsx tools/rules-parser/pdfReader.ts [page_number]
 *   tsx tools/rules-parser/pdfReader.ts --all
 *   tsx tools/rules-parser/pdfReader.ts --range 10-20
 */

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

interface PageContent {
  page: number
  text: string
}

async function extractPdfText(
  startPage?: number,
  endPage?: number
): Promise<PageContent[]> {
  try {
    const result: PageContent[] = []

    // Extract text using pdf-parse v2
    const parser = new pdfParse({ url: PDF_PATH })
    const pdfResult = await parser.getText()

    // Split text by pages - pdf-parse v2 doesn't provide per-page text directly
    // We'll use a simple heuristic: split by form feed or page breaks
    const pageTexts = pdfResult.text.split('\f').filter((t: string) => t.trim())

    // Filter by page range
    const start = startPage ? startPage - 1 : 0
    const end = endPage ? endPage : pageTexts.length

    for (let i = start; i < end && i < pageTexts.length; i++) {
      if (pageTexts[i].trim()) {
        result.push({
          page: i + 1,
          text: pageTexts[i].trim(),
        })
      }
    }

    return result
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage:')
    console.log(
      '  tsx .rules/pdfReader.ts [page_number]       - Extract specific page'
    )
    console.log(
      '  tsx .rules/pdfReader.ts --all               - Extract all pages'
    )
    console.log(
      '  tsx .rules/pdfReader.ts --range 10-20       - Extract page range'
    )
    process.exit(1)
  }

  try {
    let pages: PageContent[]

    if (args[0] === '--all') {
      console.log('Extracting all pages...')
      pages = await extractPdfText()
    } else if (args[0] === '--range' && args[1]) {
      const [start, end] = args[1].split('-').map(Number)
      console.log(`Extracting pages ${start} to ${end}...`)
      pages = await extractPdfText(start, end)
    } else {
      const pageNum = parseInt(args[0])
      if (isNaN(pageNum)) {
        console.error('Invalid page number')
        process.exit(1)
      }
      console.log(`Extracting page ${pageNum}...`)
      pages = await extractPdfText(pageNum, pageNum)
    }

    // Output as JSON
    console.log(JSON.stringify(pages, null, 2))
  } catch (error) {
    console.error('Failed to extract PDF:', error)
    process.exit(1)
  }
}

main()
