import pg from "pg";
const { Pool } = pg;

// Use DATABASE_URL for connection
const databaseConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(databaseConfig);

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Log error but don't exit immediately to allow for recovery
});

// Export the pool for session store
export { pool };

// Export the database connection
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
export const db = drizzle(pool, { schema });

// Default export for direct pool usage
export default pool;