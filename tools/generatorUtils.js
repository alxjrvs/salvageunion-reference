/**
 * Shared utilities for code generators
 * Reduces duplication across generator scripts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCHEMA_NAME_MAP } from './schemaNameMap.js';
/**
 * Get __dirname equivalent for ES modules
 */
export function getDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return path.dirname(__filename);
}
/**
 * Load and parse the schema index
 */
export function loadSchemaIndex(dirname) {
    const schemaIndexPath = path.join(dirname, '../schemas/index.json');
    return JSON.parse(fs.readFileSync(schemaIndexPath, 'utf-8'));
}
/**
 * Get singular type name from schema ID
 * Uses SCHEMA_NAME_MAP for special cases, otherwise returns the ID
 */
export function getSingularTypeName(schemaId) {
    return SCHEMA_NAME_MAP[schemaId] || schemaId;
}
/**
 * Convert schema ID to PascalCase for model property names
 * Handles special cases for classes and NPCs
 */
export function toPascalCase(id) {
    // Handle special cases for classes
    if (id === 'classes.core')
        return 'CoreClasses';
    if (id === 'classes.hybrid')
        return 'HybridClasses';
    if (id === 'classes.advanced')
        return 'AdvancedClasses';
    // Handle special case for NPCs (all caps)
    if (id === 'npcs')
        return 'NPCs';
    // Handle hyphenated and dotted names
    return id
        .split(/[-.]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
//# sourceMappingURL=generatorUtils.js.map