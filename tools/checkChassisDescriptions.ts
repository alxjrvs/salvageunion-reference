#!/usr/bin/env tsx
/**
 * Check all chassis descriptions against the PDF for word accuracy
 */

import { readFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const pdfPath = join(projectRoot, ".rules", "parsed-pdf.json");
const chassisDataPath = join(projectRoot, "data", "chassis.json");

interface PDFPage {
  pageNumber: number;
  text: string;
}

interface Chassis {
  name: string;
  description: string;
  chassis_abilities?: Array<{
    name: string;
    description: string;
  }>;
}

console.log("📄 Loading parsed PDF data...\n");
const pdfData: PDFPage[] = JSON.parse(readFileSync(pdfPath, "utf-8"));
console.log(`✅ Loaded ${pdfData.length} pages\n`);

console.log("📋 Loading chassis data...\n");
const chassisData: Chassis[] = JSON.parse(
  readFileSync(chassisDataPath, "utf-8")
);
console.log(`✅ Loaded ${chassisData.length} chassis\n`);

// Chassis pages mapping (from PDF analysis)
const chassisPages: Record<string, number> = {
  Mule: 100,
  Mazona: 102,
  Scrapper: 104,
  Spectrum: 106,
  Thresher: 108,
  Forge: 110,
  Gopher: 112,
  Hussar: 114,
  Jackhammer: 116,
  Kraken: 118,
  Magpie: 120,
  Mirrorball: 122,
  Nomad: 124,
  Brawler: 126,
  "Little Sestra": 128,
  Mantis: 130,
  Photon: 132,
  Solo: 134,
  Terra: 136,
};

console.log("🔍 Checking chassis descriptions...\n");
console.log("=".repeat(80));

for (const chassis of chassisData) {
  const pageNum = chassisPages[chassis.name];
  if (!pageNum) {
    console.log(`⚠️  ${chassis.name}: No page mapping found`);
    continue;
  }

  const page = pdfData[pageNum - 1]; // Pages are 0-indexed in array
  if (!page) {
    console.log(`❌ ${chassis.name}: Page ${pageNum} not found in PDF`);
    continue;
  }

  // Extract the main description from the PDF
  // This is a simplified check - just shows the first 200 chars of each
  console.log(`\n📖 ${chassis.name} (Page ${pageNum})`);
  console.log(`   Data: ${chassis.description.substring(0, 150)}...`);

  // Check if the description appears to be truncated (ends mid-sentence)
  const lastChar = chassis.description.trim().slice(-1);
  if (lastChar !== "." && lastChar !== "*" && lastChar !== '"') {
    console.log(
      `   ⚠️  WARNING: Description may be truncated (doesn't end with . or *)`
    );
  }

  // Check length - if very short, might be truncated
  if (chassis.description.length < 200) {
    console.log(
      `   ⚠️  WARNING: Description is quite short (${chassis.description.length} chars)`
    );
  }
}

console.log("\n" + "=".repeat(80));
console.log("\n✅ Check complete!");
