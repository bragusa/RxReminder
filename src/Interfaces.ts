

export interface Column {
  attribute: string;
  dataType?: string;
  length?: number;
}

// export interface SchemaUser {
//   username: Column;
//   name: Column;
//   password: Column;
// }

// export interface SchemaMedication {
//   username: string;
//   name: string;
//   sort: number;
// }

export interface Field {
  type: 'string'; 
  length: number; 
}

interface Users {
  username: Field;
  name: Field;
  password: Field;
}

// // Define the main schema interface
// export interface Schema {
//   users: {
//     [key: string]: ColumnMetadata; // Each key maps to a ColumnMetadata object
//   };
//   dates: {
//     [key: string]: ColumnMetadata;
//   };
//   medications: {
//     [key: string]: ColumnMetadata;
//   };
// }

// // Define the metadata for columns
// export interface ColumnMetadata {
//   type: 'string' | 'date' | 'int'; // Allowed types for fields
//   length?: number; // Optional: Only relevant for strings
//   autoIncrement?: boolean; // Optional: Specific to integers
//   primaryKey?: boolean; // Optional: Indicates if it’s a primary key
// }

// // Define the interface for `users`
// export interface UsersSchema {
//   username: ColumnMetadata;
//   name: ColumnMetadata;
//   password: ColumnMetadata;
// }

// // Define the interface for `dates`
// export interface DatesSchema {
//   username: ColumnMetadata;
//   medication: ColumnMetadata;
//   date: ColumnMetadata;
//   marked: ColumnMetadata;
// }

// // Define the interface for `medications`
// export interface MedicationsSchema {
//   id: ColumnMetadata;
//   username: ColumnMetadata;
//   name: ColumnMetadata;
//   sort: ColumnMetadata;
// }

// export type AnySchema = UsersSchema | DatesSchema | MedicationsSchema;

// // Define the main schema interface
// export interface Schema {
//   users: UsersSchema; // Explicitly typed as UsersSchema
//   dates: DatesSchema; // Explicitly typed as DatesSchema
//   medications: MedicationsSchema; // Explicitly typed as MedicationsSchema
// }
// interface UsersSchema {
//   username: ColumnMetadata;
//   name: ColumnMetadata;
//   password: ColumnMetadata;
// }

// interface DatesSchema {
//   username: ColumnMetadata;
//   medication: ColumnMetadata;
//   date: ColumnMetadata;
//   marked: ColumnMetadata;
// }

// interface MedicationsSchema {
//   id: ColumnMetadata;
//   username: ColumnMetadata;
//   name: ColumnMetadata;
//   sort: ColumnMetadata;
// }

// interface DatabaseSchema {
//   users: UsersSchema;
//   dates: DatesSchema;
//   medications: MedicationsSchema;
// }


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
    name: { type: 'string', length: 20 },
    password: { type: 'string', length: 20 },
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


// export const DatabaseSchema = {
//   users: {
//     username: {
//       type: 'string',
//       length: 12
//     },
//     name: {
//       type: 'string',
//       length: 20
//     },
//     password: {
//       type: 'string',
//       length: 20
//     }
//   },
//   dates: {
//     username: {
//       type: 'string',
//       length: 12
//     },
//     medication: {
//       type: 'string',
//       length: 20
//     },
//     date: {
//       type: 'date'
//     },
//     marked: {
//       type: 'int'
//     }
//   },
//   medications: {
//     id: {
//       type: 'int',
//       autoIncrement: true,
//       primaryKey: true
//     },
//     username: {
//       type: 'string',
//       length: 12
//     },
//     name: {
//       type: 'string',
//       length: 20
//     },
//     sort: {
//       type: 'int'
//     }
//   }
// }
