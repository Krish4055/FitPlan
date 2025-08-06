import Database from 'better-sqlite3';
import { Pool, neonConfig } from '@neondatabase/serverless';
import "dotenv/config";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon for serverless
neonConfig.webSocketConstructor = ws;

// Determine database type and create appropriate connection
const getDatabaseConnection = () => {
  const dbUrl = process.env.DATABASE_URL;
  
  // If no DATABASE_URL or it's a local/sqlite URL, use SQLite
  if (!dbUrl || dbUrl.includes('localhost') || dbUrl.startsWith('sqlite:')) {
    console.log("✅ Using SQLite database");
    const dbPath = dbUrl?.replace('sqlite:', '') || "fitplan.db";
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    console.log("✅ SQLite database connected successfully!");
    return drizzle({ client: sqlite, schema });
  } 
  
  // For production with PostgreSQL
  try {
    console.log("✅ Using PostgreSQL database for production");
    const pool = new Pool({ connectionString: dbUrl });
    
    pool.on('connect', () => {
      console.log("✅ PostgreSQL database connected successfully!");
    });
    
    pool.on('error', (err) => {
      console.error("❌ Database connection error:", err);
      // Fallback to SQLite if PostgreSQL fails
      console.log("🔄 Falling back to SQLite database");
      const sqlite = new Database("fitplan.db");
      sqlite.pragma('journal_mode = WAL');
      return drizzle({ client: sqlite, schema });
    });
    
    return drizzleNeon({ client: pool, schema });
  } catch (error) {
    console.error("❌ PostgreSQL connection failed, using SQLite fallback:", error);
    const sqlite = new Database("fitplan.db");
    sqlite.pragma('journal_mode = WAL');
    return drizzle({ client: sqlite, schema });
  }
};

export const db = getDatabaseConnection();
