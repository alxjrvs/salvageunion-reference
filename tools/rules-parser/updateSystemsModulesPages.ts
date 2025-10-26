#!/usr/bin/env tsx
/**
 * Update page numbers for mech systems and modules by locating their
 * definitions within the specific printed page ranges:
 * - Systems: 164–187
 * - Modules: 189–207
 *
 * For any item not found within its range, add invalid: true and list it in
 * INVALID-MECH-SYSTEMS.md.
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

const DATA_DIR = path.join(__dirname, '../../data')
const INVALID_REPORT_PATH = path.join(
  __dirname,
  '../../INVALID-MECH-SYSTEMS.md'
)

type Confidence = 'high' | 'medium' | 'low'

interface MatchResult {
  page: number
  confidence: Confidence
}

interface InvalidRecord {
  type: 'system' | 'module'
  id: string
  name: string
  expectedRange: string
  currentPage: number | null
}

async function buildPrintedPageMap(): Promise<Map<number, string>> {
  const map = new Map<number, string>()
  const parser = new pdfParse({ url: PDF_PATH })
  const first = await parser.getText({ first: 1 })
  const total = first.total

  for (let pageNum = 1; pageNum <= total; pageNum++) {
    const result = await parser.getText({ partial: [pageNum] })
    const pageText: string = result.text || ''

    // Try to read printed page from footer style: "-- X of Y --"
    let printed: number | null = null
    const footerMatch = pageText.match(/--\s*(\d+)\s*of\s*\d+\s*--/)
    if (footerMatch) {
      printed = parseInt(footerMatch[1])
    } else {
      // Fallback: top-of-page number at the very start of the text
      const topMatch = pageText.match(/^\s*(\d{1,4})\b/)
      printed = topMatch ? parseInt(topMatch[1]) : null
    }

    if (printed) {
      map.set(printed, pageText)
    }
  }

  await parser.destroy()
  return map
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findInRange(
  name: string,
  pages: Map<number, string>,
  start: number,
  end: number
): MatchResult | null {
  // Make matching robust to newlines and spacing within names
  const escapedName = escapeRegExp(name.trim())
  const flexible = escapedName.replace(/\s+/g, '\\s+')
  const headerPattern = new RegExp(`^[\\s\\S]{0,300}${flexible}`, 'i')
  const mediumPattern = new RegExp(`(?:\\n|\\r)${flexible}(?:\\n|\\r)`, 'i')
  const lowPattern = new RegExp(flexible, 'i')

  let mediumCandidate: MatchResult | null = null
  let lowCandidate: MatchResult | null = null

  for (let p = start; p <= end; p++) {
    const text = pages.get(p)
    if (!text) continue

    if (headerPattern.test(text)) {
      return { page: p, confidence: 'high' }
    }
    if (!mediumCandidate && mediumPattern.test(text)) {
      mediumCandidate = { page: p, confidence: 'medium' }
    }
    if (!lowCandidate && lowPattern.test(text)) {
      lowCandidate = { page: p, confidence: 'low' }
    }
  }

  return mediumCandidate || lowCandidate
}

function loadJsonArray(filePath: string): Record<string, unknown>[] {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function saveJsonArray(filePath: string, data: Record<string, unknown>[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
}

async function updateFile(
  kind: 'system' | 'module',
  filename: string,
  pages: Map<number, string>,
  range: [number, number],
  invalids: InvalidRecord[]
) {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) return

  const arr = loadJsonArray(filePath)
  let updated = 0
  let flagged = 0

  for (const item of arr) {
    const name: string = item.name as string
    const currentPage: number | null =
      typeof item.page === 'number' ? item.page : null
    if (!name) continue

    const match = findInRange(name, pages, range[0], range[1])

    if (match) {
      if (item.page !== match.page) {
        item.page = match.page
        updated++
      }
      if (item.invalid) {
        delete item.invalid
      }
    } else {
      // Not found within definition range
      if (item.invalid !== true) {
        item.invalid = true
      }
      flagged++
      invalids.push({
        type: kind,
        id: (item.id as string) || '',
        name,
        expectedRange: `${range[0]}-${range[1]}`,
        currentPage: currentPage,
      })
    }
  }

  saveJsonArray(filePath, arr)
  console.log(
    `✅ ${filename}: ${updated} page updates, ${flagged} invalid flagged`
  )
}

function writeInvalidReport(invalids: InvalidRecord[]) {
  if (invalids.length === 0) {
    if (fs.existsSync(INVALID_REPORT_PATH)) {
      fs.writeFileSync(
        INVALID_REPORT_PATH,
        '# INVALID Mech Systems and Modules\n\nAll systems/modules resolved within definition ranges.\n'
      )
    }
    return
  }

  const date = new Date().toISOString()
  const lines: string[] = []
  lines.push('# INVALID Mech Systems and Modules')
  lines.push('')
  lines.push(`Generated: ${date}`)
  lines.push('')

  const systems = invalids.filter((r) => r.type === 'system')
  const modules = invalids.filter((r) => r.type === 'module')

  if (systems.length) {
    lines.push('## Systems')
    for (const r of systems) {
      lines.push(
        `- ${r.name} (id: ${r.id || 'n/a'}) — expected range ${r.expectedRange}, current page: ${r.currentPage ?? 'n/a'}`
      )
    }
    lines.push('')
  }

  if (modules.length) {
    lines.push('## Modules')
    for (const r of modules) {
      lines.push(
        `- ${r.name} (id: ${r.id || 'n/a'}) — expected range ${r.expectedRange}, current page: ${r.currentPage ?? 'n/a'}`
      )
    }
    lines.push('')
  }

  console.log(
    `📝 Writing invalid report with ${invalids.length} entries to ${INVALID_REPORT_PATH}`
  )
  fs.writeFileSync(INVALID_REPORT_PATH, lines.join('\n'))
}

async function main() {
  console.log('📘 Building printed page map from PDF...')
  const pages = await buildPrintedPageMap()

  const invalids: InvalidRecord[] = []

  // Systems: 164–187
  await updateFile('system', 'systems.json', pages, [164, 187], invalids)
  // Modules: 189–207
  await updateFile('module', 'modules.json', pages, [189, 207], invalids)

  writeInvalidReport(invalids)
  console.log('✨ Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
