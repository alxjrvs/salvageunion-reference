#!/usr/bin/env tsx

import { readFileSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const systemsPath = join(projectRoot, "data", "systems.json");

console.log("📄 Loading systems data...");
const systems = JSON.parse(readFileSync(systemsPath, "utf-8"));

console.log(`✅ Loaded ${systems.length} systems\n`);

// Check for missing required fields
console.log("🔍 Checking for missing fields...\n");

let missingPage = 0;
let missingDescription = 0;
let missingTechLevel = 0;
let missingSlots = 0;
let missingSalvage = 0;

for (const system of systems) {
  if (!system.page) {
    console.log(`⚠️  ${system.name}: Missing page number`);
    missingPage++;
  }
  if (!system.description) {
    console.log(`⚠️  ${system.name}: Missing description`);
    missingDescription++;
  }
  if (system.techLevel === undefined) {
    console.log(`⚠️  ${system.name}: Missing tech level`);
    missingTechLevel++;
  }
  if (system.slotsRequired === undefined) {
    console.log(`⚠️  ${system.name}: Missing slots required`);
    missingSlots++;
  }
  if (system.salvageValue === undefined) {
    console.log(`⚠️  ${system.name}: Missing salvage value`);
    missingSalvage++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Missing page: ${missingPage}`);
console.log(`   Missing description: ${missingDescription}`);
console.log(`   Missing tech level: ${missingTechLevel}`);
console.log(`   Missing slots: ${missingSlots}`);
console.log(`   Missing salvage: ${missingSalvage}`);

// List systems by tech level for verification
console.log(`\n📋 Systems by Tech Level:\n`);
for (let tech = 1; tech <= 6; tech++) {
  const techSystems = systems.filter((s: any) => s.techLevel === tech);
  console.log(`Tech ${tech}: ${techSystems.length} systems`);
  techSystems.forEach((s: any) => {
    console.log(`  - ${s.name} (p.${s.page})`);
  });
  console.log();
}

