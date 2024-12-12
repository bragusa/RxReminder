

export interface Column {
  attribute: string;
  dataType?: string;
  length?: number;
}

export interface Field {
  type: 'string'; 
  length: number; 
}

interface Users {
  username: Field;
  name: Field;
}


// Column metadata type
export interface ColumnMetadata {
  type: 'string' | 'date' | 'int';
  length?: number;
  autoIncrement?: boolean;
  primaryKey?: boolean;
}

// Define the schema for each table (use `as const` for literal types)
export const databaseSchema = {
  users: {
    username: { type: 'string', length: 12 },
    name: { type: 'string', length: 20 }
  },
  dates: {
    username: { type: 'string', length: 12 },
    medication: { type: 'string', length: 20 },
    date: { type: 'date' },
    marked: { type: 'int' },
  },
  medications: {
    id: { type: 'int', autoIncrement: true, primaryKey: true },
    username: { type: 'string', length: 12 },
    name: { type: 'string', length: 20 },
    sort: { type: 'int' },
  },
} as const;  // Ensure the types are literal types

// Function to get column length
export function getColumnLength<T extends keyof typeof databaseSchema>(
  table: T,
  column: keyof typeof databaseSchema[T] // This ensures `column` is valid for the specific `table`
): number | undefined {
  const columnSchema = databaseSchema[table][column] as ColumnMetadata; // Access the column schema

  // Only return the length if it's a string column
  if (columnSchema.type === 'string' && columnSchema.length !== undefined) {
    return columnSchema.length;
  }

  // Return undefined for non-string columns
  return undefined;
}
