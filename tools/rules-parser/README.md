# Rules Parser Tools

Tools for reading and searching the Salvage Union Core Book PDF to extract page numbers and content.

## Prerequisites

These tools use the `pdf-parse` npm package which is installed as a dev dependency. No additional system dependencies are required.

## Tools

### 1. pdfReader.ts

Extract text from specific pages or page ranges.

**Usage:**

```bash
# Extract a specific page
npm run pdf:read -- 28

# Extract a range of pages
npm run pdf:read -- --range 10-20

# Extract all pages (warning: large output)
npm run pdf:read -- --all
```

**Output:** JSON array with page numbers and text content.

### 2. pdfSearch.ts

Search for text in the PDF and get matching pages with context.

**Usage:**

```bash
# Case-insensitive search
npm run pdf:search -- "Engineering Expertise"

# Case-sensitive search
npm run pdf:search -- --case-sensitive "Engineering Expertise"
```

**Output:** JSON array with page numbers, matches, and surrounding context.

### 3. findPageNumber.ts

Find the page number for a specific item by name. This tool uses smart matching to find the most likely page.

**Usage:**

```bash
# Find any item
npm run pdf:find -- "Engineering Expertise"

# Find with type hint
npm run pdf:find -- --type ability "Engineering Expertise"
npm run pdf:find -- --type system ".50 Cal Machine Gun"
```

**Output:** Ranked list of matches with confidence levels (high/medium/low) and context.

## Confidence Levels

The `findPageNumber.ts` tool assigns confidence levels:

- **High**: Exact match or header-like match near top of page
- **Medium**: Header-like match elsewhere on page
- **Low**: Item mentioned anywhere on page

## Examples

```bash
# Find the page for an ability
npm run pdf:find -- "Engineering Expertise"

# Find the page for a system
npm run pdf:find -- ".50 Cal Machine Gun"

# Search for all mentions of a term
npm run pdf:search -- "teleport"

# Read a specific page
npm run pdf:read -- 164
```

## Notes

- The PDF file must be located at `.rules/Salvage Union Core Book Digital Edition 2.0a.pdf`
- All tools output JSON for easy parsing and integration with other scripts
