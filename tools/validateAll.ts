#!/usr/bin/env tsx

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Validator } from "jsonschema";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

interface ValidationConfig {
  dataFile: string;
  schemaFile: string;
  name: string;
}

const validationConfigs: ValidationConfig[] = [
  {
    name: "Abilities",
    dataFile: "data/abilities.json",
    schemaFile: "schemas/abilities.schema.json",
  },
  {
    name: "Ability Tree Requirements",
    dataFile: "data/ability-tree-requirements.json",
    schemaFile: "schemas/ability-tree-requirements.schema.json",
  },
  {
    name: "Chassis",
    dataFile: "data/chassis.json",
    schemaFile: "schemas/chassis.schema.json",
  },
  {
    name: "Classes",
    dataFile: "data/classes.json",
    schemaFile: "schemas/classes.schema.json",
  },
  {
    name: "Crawlers",
    dataFile: "data/crawlers.json",
    schemaFile: "schemas/crawlers.schema.json",
  },
  {
    name: "Equipment",
    dataFile: "data/equipment.json",
    schemaFile: "schemas/equipment.schema.json",
  },
  {
    name: "Keywords",
    dataFile: "data/keywords.json",
    schemaFile: "schemas/keywords.schema.json",
  },
  {
    name: "Modules",
    dataFile: "data/modules.json",
    schemaFile: "schemas/modules.schema.json",
  },
  {
    name: "Other Entities",
    dataFile: "data/otherEntities.json",
    schemaFile: "schemas/otherEntities.schema.json",
  },
  {
    name: "Systems",
    dataFile: "data/systems.json",
    schemaFile: "schemas/systems.schema.json",
  },
  {
    name: "Tables",
    dataFile: "data/tables.json",
    schemaFile: "schemas/tables.schema.json",
  },
  {
    name: "Traits",
    dataFile: "data/traits.json",
    schemaFile: "schemas/traits.schema.json",
  },
];

function loadJson(filePath: string): any {
  const fullPath = join(projectRoot, filePath);
  const content = readFileSync(fullPath, "utf-8");
  return JSON.parse(content);
}

// Global validator instance with shared schemas loaded
const globalValidator = new Validator();

function loadSharedSchemas() {
  // Load shared schemas that are referenced by other schemas
  // The schemas use relative references like "shared/enums.schema.json#/definitions/tree"
  // We need to register them with IDs that match these references
  const sharedSchemas = [
    {
      path: "schemas/shared/common.schema.json",
      id: "shared/common.schema.json",
    },
    {
      path: "schemas/shared/enums.schema.json",
      id: "shared/enums.schema.json",
    },
    {
      path: "schemas/shared/objects.schema.json",
      id: "shared/objects.schema.json",
    },
  ];

  for (const sharedInfo of sharedSchemas) {
    try {
      const sharedSchema = loadJson(sharedInfo.path);
      // Register with both the relative ID and the full URL from $id
      globalValidator.addSchema(sharedSchema, sharedInfo.id);
      if (sharedSchema.$id) {
        globalValidator.addSchema(sharedSchema, sharedSchema.$id);
      }
    } catch (error) {
      console.error(`Warning: Could not load shared schema ${sharedInfo.path}`);
    }
  }
}

function loadSchema(schemaPath: string): any {
  return loadJson(schemaPath);
}

function validateData(config: ValidationConfig): boolean {
  try {
    console.log(`\n📋 Validating ${config.name}...`);

    const data = loadJson(config.dataFile);
    const schema = loadSchema(config.schemaFile);

    const result = globalValidator.validate(data, schema);

    if (result.valid) {
      console.log(`✅ ${config.name}: VALID`);
      return true;
    } else {
      console.log(`❌ ${config.name}: INVALID`);
      console.log(`   Errors:`);
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.stack}`);
      });
      return false;
    }
  } catch (error) {
    console.log(`❌ ${config.name}: ERROR`);
    console.log(`   ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function main() {
  console.log("🔍 Salvage Union Data Validation");
  console.log("=================================");

  // Load shared schemas once before validating
  loadSharedSchemas();

  let allValid = true;
  let validCount = 0;
  let invalidCount = 0;

  for (const config of validationConfigs) {
    const isValid = validateData(config);
    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
      allValid = false;
    }
  }

  console.log("\n=================================");
  console.log(`📊 Summary: ${validCount} valid, ${invalidCount} invalid`);

  if (allValid) {
    console.log("✅ All data files are valid!");
    process.exit(0);
  } else {
    console.log("❌ Some data files have validation errors.");
    process.exit(1);
  }
}

main();
