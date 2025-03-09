import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';
import * as schema from '@shared/schema';

// Required for Edge runtime
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

// Create the SQL client for Neon's serverless driver
const sql = neon(process.env.DATABASE_URL!);

// Create the Drizzle ORM instance
export const db = drizzle(sql, { schema });

// Export for session store
export const pool = sql;