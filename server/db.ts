import 'dotenv/config';
import * as schema from '@shared/schema';

const databaseUrl = process.env.DATABASE_URL || 'sqlite:fitplan.db';

export type DatabaseKind = 'postgres' | 'sqlite';
export const databaseKind: DatabaseKind = databaseUrl.startsWith('sqlite:')
  ? 'sqlite'
  : 'postgres';

export let db: any;
export let pool: import('pg').Pool | undefined;

async function initPostgres() {
  // Dynamic import to avoid requiring pg in sqlite-only environments
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

  pool = createdPool;
  db = drizzle(createdPool, { schema });
}

async function initSqlite() {
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const Database = (await import('better-sqlite3')).default;

  const sqlitePath = databaseUrl.replace('sqlite:', '');
  console.log('✅ Using SQLite database at', sqlitePath);
  const sqlite = new Database(sqlitePath);
  db = drizzle(sqlite, { schema });
}

try {
  if (databaseKind === 'postgres') {
    await initPostgres();
  } else {
    await initSqlite();
  }
} catch (err) {
  console.warn('⚠️  Falling back to SQLite due to Postgres init failure:', (err as Error).message);
  await initSqlite();
}
