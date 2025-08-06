import Database from 'better-sqlite3';
import "dotenv/config";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for development
const getDatabasePath = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('sqlite:')) {
    const path = process.env.DATABASE_URL.replace('sqlite:', '');
    console.log("✅ Using SQLite database from DATABASE_URL:", path);
    return path;
  }
  
  // Fallback for development
  console.log("✅ Using fallback SQLite database: fitplan.db");
  return "fitplan.db";
};

const databasePath = getDatabasePath();
console.log("🔗 Database path:", databasePath);

const sqlite = new Database(databasePath);
sqlite.pragma('journal_mode = WAL');

console.log("✅ SQLite database connected successfully!");

export const db = drizzle({ client: sqlite, schema });
