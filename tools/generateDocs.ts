import fs from "fs";
import path from "path";

interface SchemaInfo {
  id: string;
  title: string;
  description: string;
  dataFile: string;
  schemaFile: string;
  itemCount: number;
  requiredFields: string[];
}

// Get version from package.json
function getPackageVersion(): string {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return packageJson.version || "1.0.0";
  } catch (error) {
    console.warn("⚠️  Could not read package.json version, using default");
    return "1.0.0";
  }
}

// Get all schema files
function getSchemaFiles(): string[] {
  const schemasDir = path.join(process.cwd(), "schemas");
  return fs
    .readdirSync(schemasDir)
    .filter((file) => file.endsWith(".schema.json") && file !== "index.json")
    .sort();
}

// Get item count from data file
function getItemCount(dataFile: string): number {
  try {
    const fullPath = path.join(process.cwd(), dataFile);
    const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    return 0;
  }
}

// Extract required fields from schema
function getRequiredFields(schema: any, schemaId: string): string[] {
  // Try items.required first (for array schemas)
  if (schema.items?.required) {
    return schema.items.required;
  }

  // Handle oneOf schemas (like classes)
  if (schema.items?.oneOf && Array.isArray(schema.items.oneOf)) {
    // Get required fields from first oneOf option
    if (schema.items.oneOf[0]?.required) {
      return schema.items.oneOf[0].required;
    }
  }

  // Try top-level required
  if (schema.required) {
    return schema.required;
  }

  // Handle schemas that use shared definitions
  // These inherit required fields from the shared schema
  const sharedDefinitionSchemas: { [key: string]: string[] } = {
    keywords: ["name", "source", "page"],
    traits: ["name", "source", "page"],
    modules: ["name", "page"],
    systems: ["name", "page"],
  };

  if (sharedDefinitionSchemas[schemaId]) {
    return sharedDefinitionSchemas[schemaId];
  }

  return [];
}

function parseSchemaFile(schemaFile: string): SchemaInfo | null {
  try {
    const fullPath = path.join(process.cwd(), "schemas", schemaFile);
    const schema = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

    const id = schemaFile.replace(".schema.json", "");
    const dataFile = `data/${id}.json`;

    return {
      id,
      title: schema.title || id,
      description: schema.description || "",
      dataFile,
      schemaFile: `schemas/${schemaFile}`,
      itemCount: getItemCount(dataFile),
      requiredFields: getRequiredFields(schema, id),
    };
  } catch (error) {
    console.error(`Error parsing ${schemaFile}:`, error);
    return null;
  }
}

function generateSchemaIndex(schemas: SchemaInfo[]): void {
  const outputPath = path.join(process.cwd(), "schemas", "index.json");

  // Read existing index if it exists
  let existingIndex: any = null;
  if (fs.existsSync(outputPath)) {
    try {
      existingIndex = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    } catch (error) {
      // If we can't parse it, we'll regenerate it
    }
  }

  const newIndex = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Salvage Union Data Schema Catalog",
    description:
      "Catalog of all available schemas in the salvageunion-data repository",
    version: getPackageVersion(),
    generated: new Date().toISOString(),
    schemas: schemas.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      dataFile: s.dataFile,
      schemaFile: s.schemaFile,
      itemCount: s.itemCount,
      requiredFields: s.requiredFields,
    })),
  };

  // Check if only the generated field would change
  if (existingIndex) {
    const existingWithoutGenerated = { ...existingIndex, generated: undefined };
    const newWithoutGenerated = { ...newIndex, generated: undefined };

    if (
      JSON.stringify(existingWithoutGenerated) ===
      JSON.stringify(newWithoutGenerated)
    ) {
      console.log(
        `⏭️  Skipped schemas/index.json (only generated timestamp would change)`,
      );
      return;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(newIndex, null, 2) + "\n");
  console.log(`✅ Generated schemas/index.json (${schemas.length} schemas)`);
}

// Generate VSCode settings
function generateVSCodeSettings(schemas: SchemaInfo[]): void {
  const settings = {
    "json.schemas": schemas.map((s) => ({
      fileMatch: [s.dataFile],
      url: `./${s.schemaFile}`,
    })),
    "json.format.enable": true,
    "editor.formatOnSave": true,
    "[json]": {
      "editor.defaultFormatter": "vscode.json-language-features",
      "editor.tabSize": 2,
    },
  };

  const outputPath = path.join(process.cwd(), ".vscode", "settings.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(settings, null, 2) + "\n");
  console.log(
    `✅ Generated .vscode/settings.json (${schemas.length} mappings)`,
  );
}

// Main function
function main() {
  console.log("📝 Generating documentation from schemas...\n");

  const schemaFiles = getSchemaFiles();
  const schemas = schemaFiles
    .map(parseSchemaFile)
    .filter((s): s is SchemaInfo => s !== null);

  console.log(`Found ${schemas.length} schema files\n`);

  // Generate schema index
  generateSchemaIndex(schemas);

  // Generate VSCode settings
  generateVSCodeSettings(schemas);

  // Generate required fields table
  let requiredFieldsTable = "| Data Type | Required Fields |\n";
  requiredFieldsTable += "|-----------|----------------|\n";
  for (const schema of schemas) {
    const fields = schema.requiredFields.map((f) => `\`${f}\``).join(", ");
    requiredFieldsTable += `| ${schema.title} | ${fields} |\n`;
  }

  console.log("\n✨ Documentation generation complete!");
  console.log(
    "\n💡 Tip: Use the snippets in .docs-snippets/ to update documentation files",
  );
}

main();
