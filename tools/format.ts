#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const dataFiles = [
  "data/abilities.json",
  "data/ability-tree-requirements.json",
  "data/chassis.json",
  "data/classes.json",
  "data/crawlers.json",
  "data/equipment.json",
  "data/keywords.json",
  "data/modules.json",
  "data/otherEntities.json",
  "data/systems.json",
  "data/tables.json",
  "data/traits.json",
];

function formatJsonFile(filePath: string): boolean {
  const fullPath = join(projectRoot, filePath);

  try {
    console.log(`📝 Formatting ${filePath}...`);

    const content = readFileSync(fullPath, "utf-8");
    const data = JSON.parse(content);
    const formatted = JSON.stringify(data, null, 2) + "\n";

    writeFileSync(fullPath, formatted, "utf-8");
    console.log(`✅ ${filePath}: Formatted`);
    return true;
  } catch (error) {
    console.log(`❌ ${filePath}: ERROR`);
    console.log(`   ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function main() {
  console.log("🎨 Formatting Salvage Union Data Files");
  console.log("======================================");

  let successCount = 0;
  let errorCount = 0;

  for (const file of dataFiles) {
    const success = formatJsonFile(file);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log("\n======================================");
  console.log(`📊 Summary: ${successCount} formatted, ${errorCount} errors`);

  if (errorCount === 0) {
    console.log("✅ All files formatted successfully!");
    process.exit(0);
  } else {
    console.log("❌ Some files had errors.");
    process.exit(1);
  }
}

main();
