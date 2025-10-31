/**
 * Shared utilities for code generators
 * Reduces duplication across generator scripts
 */
/**
 * Get __dirname equivalent for ES modules
 */
export declare function getDirname(importMetaUrl: string): string;
/**
 * Load and parse the schema index
 */
export declare function loadSchemaIndex(dirname: string): any;
/**
 * Get singular type name from schema ID
 * Uses SCHEMA_NAME_MAP for special cases, otherwise returns the ID
 */
export declare function getSingularTypeName(schemaId: string): string;
/**
 * Convert schema ID to PascalCase for model property names
 * Handles special cases for classes and NPCs
 */
export declare function toPascalCase(id: string): string;
/**
 * Capitalize first letter of a string
 */
export declare function capitalize(str: string): string;
//# sourceMappingURL=generatorUtils.d.ts.map