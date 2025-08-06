import { Pool, neonConfig } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import "dotenv/config";
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Get database URL from environment
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    console.log("✅ Using DATABASE_URL from environment variables");
    return process.env.DATABASE_URL;
  }
  
  // Fallback for development
  console.log("⚠️  No DATABASE_URL found. Using SQLite fallback.");
  return "sqlite:fitplan.db";
};

const connectionString = getDatabaseUrl();
console.log("🔗 Database connection string:", connectionString.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

// Determine database type and create appropriate connection
let db: any;

if (connectionString.startsWith('sqlite:')) {
  // SQLite setup
  const dbPath = connectionString.replace('sqlite:', '');
  console.log("🗄️  Using SQLite database:", dbPath);
  
  const sqlite = new Database(dbPath);
  db = drizzleSqlite({ client: sqlite, schema });
  
  console.log("✅ SQLite database connected successfully!");
} else {
  // PostgreSQL setup (Neon)
  console.log("🐘 Using PostgreSQL database");
  
  const pool = new Pool({ connectionString });
  
  // Test the connection
  pool.on('connect', () => {
    console.log("✅ PostgreSQL database connected successfully!");
  });
  
  pool.on('error', (err) => {
    console.error("❌ Database connection error:", err);
  });
  
  db = drizzleNeon({ client: pool, schema });
}

export { db };
