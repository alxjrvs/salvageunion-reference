# Publishing Guide

## Pre-publish Checklist

Before publishing to NPM, ensure:

1. ✅ All tests pass: `npm test`
2. ✅ TypeScript compiles: `npm run typecheck`
3. ✅ Build succeeds: `npm run build`
4. ✅ Version is updated in `package.json`
5. ✅ CHANGELOG.md is updated
6. ✅ README.md is current
7. ✅ All changes are committed

## Publishing Steps

### 1. Update Version

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

This will:
- Update version in package.json
- Create a git tag
- Commit the change

### 2. Build and Validate

The `prepublishOnly` script will automatically run:
- `npm run build` - Compile TypeScript
- `npm run validate` - Validate all JSON data
- `npm run typecheck` - Check TypeScript types

### 3. Publish to NPM

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to NPM
npm publish
```

### 4. Push to GitHub

```bash
git push origin main --tags
```

## What Gets Published

The following files/folders are included in the NPM package (see `package.json` `files` field):

- `dist/` - Compiled JavaScript and TypeScript declarations
- `data/` - Raw JSON data files
- `schemas/` - JSON Schema files
- `README.md` - Documentation
- `LICENSE` - License file

The following are **excluded** (see `.npmignore`):

- `lib/` - Source TypeScript files
- `tools/` - Build and validation tools
- `examples/` - Example code
- `node_modules/` - Dependencies
- Config files (tsconfig.json, etc.)

## Package Structure

After publishing, users will be able to:

```typescript
// Import the ORM
import { SalvageUnionData } from "salvageunion-data";

// Import types
import type { SalvageUnionMechChassis } from "salvageunion-data";

// Import raw data
import chassisData from "salvageunion-data/data/chassis.json";

// Import schemas
import chassisSchema from "salvageunion-data/schemas/chassis.schema.json";
```

## Version Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking API changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Validation Fails

```bash
# Check which files are invalid
npm run validate
```

### TypeScript Errors

```bash
# Check for type errors
npm run typecheck
```

### Test Publish Locally

```bash
# Pack the package
npm pack

# This creates a .tgz file you can test locally
npm install ./salvageunion-data-1.0.0.tgz
```

## Post-Publish

After publishing:

1. Verify on NPM: https://www.npmjs.com/package/salvageunion-data
2. Test installation: `npm install salvageunion-data`
3. Create GitHub release with changelog
4. Update documentation if needed

