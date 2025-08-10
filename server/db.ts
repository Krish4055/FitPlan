import 'dotenv/config';
import * as schema from '@shared/schema';

const databaseUrl = process.env.DATABASE_URL || 'sqlite:fitplan.db';

export type DatabaseKind = 'postgres' | 'sqlite';
export const databaseKind: DatabaseKind = databaseUrl.startsWith('sqlite:')
  ? 'sqlite'
  : 'postgres';

export let db: any;
export let pool: import('pg').Pool | undefined;

async function initPostgresInternal() {
  const pgModule: any = await import('pg');
  const PgPool = pgModule.Pool || (pgModule.default && pgModule.default.Pool);
  if (!PgPool) {
    throw new Error('Failed to load pg.Pool');
  }

  const { drizzle } = await import('drizzle-orm/node-postgres');

  console.log('✅ Using PostgreSQL database');
  console.log('🔗 Database connection string:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

  const createdPool = new PgPool({ connectionString: databaseUrl });
  createdPool.on('connect', () => {
    console.log('✅ Database connected successfully!');
  });
  createdPool.on('error', (err: any) => {
    console.error('❌ Database connection error:', err);
  });

  // Create tables if they do not exist (safe boot-time DDL)
  await createdPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id varchar(64) PRIMARY KEY,
      username text NOT NULL UNIQUE,
      email text NOT NULL UNIQUE,
      password text NOT NULL,
      full_name text,
      age integer,
      gender text,
      current_weight numeric(5,2),
      target_weight numeric(5,2),
      primary_goal text,
      activity_level text,
      weekly_workout_goal text,
      created_at timestamptz DEFAULT now()
    );
  `);
  await createdPool.query(`
    CREATE TABLE IF NOT EXISTS workouts (
      id varchar(64) PRIMARY KEY,
      user_id varchar(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workout_type text NOT NULL,
      duration integer NOT NULL,
      calories_burned integer,
      intensity text,
      exercise_details text,
      feeling text,
      created_at timestamptz DEFAULT now()
    );
  `);
  await createdPool.query(`
    CREATE TABLE IF NOT EXISTS food_logs (
      id varchar(64) PRIMARY KEY,
      user_id varchar(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      food_name text NOT NULL,
      serving_size text,
      calories integer NOT NULL,
      protein numeric(5,2),
      carbs numeric(5,2),
      fats numeric(5,2),
      meal_type text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  `);
  await createdPool.query(`
    CREATE TABLE IF NOT EXISTS weight_entries (
      id varchar(64) PRIMARY KEY,
      user_id varchar(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      weight numeric(5,2) NOT NULL,
      notes text,
      created_at timestamptz DEFAULT now()
    );
  `);

  pool = createdPool;
  db = drizzle(createdPool, { schema });
}

async function initSqliteInternal() {
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const Database = (await import('better-sqlite3')).default;

  const sqlitePath = databaseUrl.replace('sqlite:', '');
  console.log('✅ Using SQLite database at', sqlitePath);
  const sqlite = new Database(sqlitePath);

  // Ensure required tables exist (SQLite DDL)
  sqlite.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT,
      age INTEGER,
      gender TEXT,
      current_weight REAL,
      target_weight REAL,
      primary_goal TEXT,
      activity_level TEXT,
      weekly_workout_goal TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workout_type TEXT NOT NULL,
      duration INTEGER NOT NULL,
      calories_burned INTEGER,
      intensity TEXT,
      exercise_details TEXT,
      feeling TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS food_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      food_name TEXT NOT NULL,
      serving_size TEXT,
      calories INTEGER NOT NULL,
      protein REAL,
      carbs REAL,
      fats REAL,
      meal_type TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS weight_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      weight REAL NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id);
    CREATE INDEX IF NOT EXISTS idx_food_logs_user ON food_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_weight_entries_user ON weight_entries(user_id);
  `);

  db = drizzle(sqlite, { schema });
}

export async function initializeDatabase() {
  try {
    if (databaseKind === 'postgres') {
      await initPostgresInternal();
    } else {
      await initSqliteInternal();
    }
  } catch (err) {
    console.warn('⚠️  Falling back to SQLite due to Postgres init failure:', (err as Error).message);
    await initSqliteInternal();
  }
}
