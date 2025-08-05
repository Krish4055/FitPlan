import { Pool, neonConfig } from '@neondatabase/serverless';
import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Temporary fallback for development
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    console.log("✅ Using DATABASE_URL from environment variables");
    return process.env.DATABASE_URL;
  }
  
  // Fallback for development - you can replace this with your Supabase URL
  console.log("⚠️  No DATABASE_URL found. Using fallback connection.");
  return "postgresql://postgres:ganjinsdqqqoxtwtwlwm@db.ganjinsdqqqoxtwtwlwm.supabase.co:5432/postgres";
};

const connectionString = getDatabaseUrl();
console.log("🔗 Database connection string:", connectionString.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

export const pool = new Pool({ connectionString });

// Test the connection
pool.on('connect', () => {
  console.log("✅ Database connected successfully!");
});

pool.on('error', (err) => {
  console.error("❌ Database connection error:", err);
});

export const db = drizzle({ client: pool, schema });
