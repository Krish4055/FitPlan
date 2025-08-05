import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { Pool, neonConfig } from '@neondatabase/serverless';
import "dotenv/config";
import { drizzle as drizzlePostgres } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Use PostgreSQL for production (Vercel), SQLite for development
let db: any;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // Production: Use PostgreSQL
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePostgres({ client: pool, schema });
} else {
  // Development: Use SQLite
  const sqlite = new Database('fitplan.db');
  db = drizzle(sqlite, { schema });
}

export { db };
