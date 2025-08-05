import { Pool, neonConfig } from '@neondatabase/serverless';
import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Temporary fallback for development
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Fallback for development - you can replace this with your Supabase URL
  console.log("⚠️  No DATABASE_URL found. Using fallback connection.");
  return "postgresql://postgres:ganjinsdqqqoxtwtwlwm@db.ganjinsdqqqoxtwtwlwm.supabase.co:5432/postgres";
};

const connectionString = getDatabaseUrl();

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
