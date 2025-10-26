#!/usr/bin/env tsx

/**
 * PDF Reader Tool for Salvage Union Workshop Manual
 *
 * This tool extracts text from the PDF with page numbers.
 * Usage:
 *   tsx tools/rules-parser/pdfReader.ts [page_number]
 *   tsx tools/rules-parser/pdfReader.ts --all
 *   tsx tools/rules-parser/pdfReader.ts --range 10-20
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

const RULES_DIR = path.join(__dirname, '../../.rules')
const CANDIDATE_PDFS = [
  'Salvage Union Core Book Digital Edition 2.0a.pdf',
  'Salvage Union Workshop Manual Digital Edition 2.0a.pdf',
]
const PDF_PATH = (() => {
  for (const name of CANDIDATE_PDFS) {
    const p = path.join(RULES_DIR, name)
    if (fs.existsSync(p)) return p
  }
  throw new Error(`Rules PDF not found in ${RULES_DIR}`)
})()

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

    const parser = new pdfParse({ url: PDF_PATH })
    const first = await parser.getText({ first: 1 })
    const total = first.total

    const start = Math.max(1, startPage ?? 1)
    const end = Math.min(total, endPage ?? total)

    for (let i = start; i <= end; i++) {
      const pageRes = await parser.getText({ partial: [i] })
      const text = (pageRes.text || '').trim()
      if (text) {
        result.push({ page: i, text })
      }
    }

    await parser.destroy()

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
