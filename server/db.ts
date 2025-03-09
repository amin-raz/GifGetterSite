import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use individual environment variables for connection config
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Log error but don't exit immediately to allow for recovery
});

// Export the database connection
export const db = drizzle(pool, { schema });

// Also export the pool for session store
export { pool };