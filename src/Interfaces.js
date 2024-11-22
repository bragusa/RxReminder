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
}; // Ensure the types are literal types
// Function to get column length
export function getColumnLength(table, column // This ensures `column` is valid for the specific `table`
) {
    const columnSchema = databaseSchema[table][column]; // Access the column schema
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
