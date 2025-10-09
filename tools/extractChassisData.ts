#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

interface PageData {
  pageNumber: number;
  fullText: string;
}

function loadParsedPdf(): PageData[] {
  const pdfPath = join(projectRoot, ".rules", "parsed-pdf.json");
  const content = readFileSync(pdfPath, "utf-8");
  return JSON.parse(content);
}

interface ChassisData {
  name: string;
  page: number;
  stats: {
    structure_pts: number;
    energy_pts: number;
    heat_cap: number;
    system_slots: number;
    module_slots: number;
    cargo_cap: number;
    tech_level: number;
    salvage_value: number;
  };
  chassis_ability: {
    name: string;
    description: string;
    mechanics?: string;
  };
  description: string;
  patterns: Array<{
    name: string;
    description: string;
    systems: string[];
    modules: string[];
  }>;
}

function extractChassisFromPage(page: PageData): ChassisData | null {
  const text = page.fullText;
  
  // Check if this page contains a chassis (look for the stats table header)
  if (!text.includes("SALVAGE VALUE TECH LEVEL CARGO CAP.")) {
    return null;
  }

  // Extract chassis name (first line before stats)
  const lines = text.split(/\s+/);
  const nameMatch = text.match(/^(\d+)\s+([A-Z\s-]+?)\s+SALVAGE VALUE/);
  if (!nameMatch) return null;
  
  const chassisName = nameMatch[2].trim();
  
  // Extract stats - they appear in a specific order after the header
  const statsMatch = text.match(/STRUCTURE PTS\.\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
  if (!statsMatch) return null;

  const stats = {
    structure_pts: parseInt(statsMatch[1]),
    energy_pts: parseInt(statsMatch[2]),
    heat_cap: parseInt(statsMatch[3]),
    system_slots: parseInt(statsMatch[4]),
    module_slots: parseInt(statsMatch[5]),
    cargo_cap: parseInt(statsMatch[6]),
    tech_level: parseInt(statsMatch[7]),
    salvage_value: parseInt(statsMatch[8]),
  };

  // Extract chassis ability
  const abilityMatch = text.match(/CHASSIS ABILITY\s+(.*?)(?=The ['"]|$)/s);
  let chassis_ability = {
    name: "",
    description: "",
    mechanics: undefined as string | undefined,
  };

  if (abilityMatch) {
    const abilityText = abilityMatch[1].trim();
    // Split on the first colon to get name and description
    const colonIndex = abilityText.indexOf(":");
    if (colonIndex > 0) {
      chassis_ability.name = abilityText.substring(0, colonIndex).trim();
      const rest = abilityText.substring(colonIndex + 1).trim();
      
      // Check if there's a mechanics section (starts with XEP, Turn Action, etc.)
      const mechanicsMatch = rest.match(/^(.*?)\s+((?:X?[0-9]*[EA]P|Free Action|Turn Action|Short Action|Long Action).*)/s);
      if (mechanicsMatch) {
        chassis_ability.description = mechanicsMatch[1].trim();
        chassis_ability.mechanics = mechanicsMatch[2].trim();
      } else {
        chassis_ability.description = rest;
      }
    }
  }

  // Extract description (starts with "The" and a quote)
  const descMatch = text.match(/The ['"][^'"]+['"][^.]+\./);
  const description = descMatch ? descMatch[0] : "";

  return {
    name: chassisName,
    page: page.pageNumber,
    stats,
    chassis_ability,
    description,
    patterns: [], // Patterns are on subsequent pages
  };
}

function main() {
  console.log("📚 Extracting Chassis Data from PDF");
  console.log("====================================\n");

  const pages = loadParsedPdf();
  const chassisData: ChassisData[] = [];

  // Chassis are on pages 100-158
  for (let i = 99; i < 158; i++) {
    const page = pages[i];
    const chassis = extractChassisFromPage(page);
    if (chassis) {
      chassisData.push(chassis);
      console.log(`✅ Found: ${chassis.name} (Page ${chassis.page})`);
    }
  }

  console.log(`\n📊 Total chassis found: ${chassisData.length}`);

  // Save to file
  const outputPath = join(projectRoot, ".rules", "extracted-chassis.json");
  writeFileSync(outputPath, JSON.stringify(chassisData, null, 2), "utf-8");
  console.log(`\n💾 Saved to: .rules/extracted-chassis.json`);
}

main();

