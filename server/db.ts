import { Pool, neonConfig } from '@neondatabase/serverless';
import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Please set it in your .env file.");
  console.warn("   The application will start but database operations will fail.");
  console.warn("   See SETUP.md for database setup instructions.");
  
  // Use a placeholder URL to prevent immediate crash
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
