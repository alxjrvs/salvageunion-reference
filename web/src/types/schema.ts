// Schema catalog types
export interface SchemaInfo {
  id: string;
  title: string;
  description: string;
  dataFile: string;
  schemaFile: string;
  itemCount: number;
  requiredFields: string[];
}

export interface SchemaIndex {
  $schema: string;
  title: string;
  description: string;
  version: string;
  generated: string;
  schemas: SchemaInfo[];
}

// Generic data item type
export type DataItem = Record<string, unknown>;

// Filter types
export interface FilterValue {
  field: string;
  value: string | number | boolean;
}

export interface FilterState {
  searchTerm: string;
  filters: FilterValue[];
}
