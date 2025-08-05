// Test database connection
import { Pool } from '@neondatabase/serverless';
import ws from "ws";

const neonConfig = { webSocketConstructor: ws };

// Test with the password you provided
const testConnection = async () => {
  try {
    // You'll need to replace [host] with your actual Supabase host
    const connectionString = "postgresql://postgres:ganjinsdqqqoxtwtwlwm@[host].supabase.co:5432/postgres";
    
    console.log("Testing connection...");
    const pool = new Pool({ connectionString });
    const result = await pool.query('SELECT NOW()');
    console.log("✅ Connection successful!", result.rows[0]);
    await pool.end();
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("Please check your Supabase host in the connection string");
  }
};

testConnection(); 