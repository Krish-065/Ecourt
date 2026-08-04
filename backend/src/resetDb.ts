import { Client } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function resetDatabase() {
  console.log('🧹 Connecting to PostgreSQL/Neon DB to reset all application data...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Drop and truncate tables if they exist
    const truncateQuery = `
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE;';
        END LOOP;
      END $$;
    `;

    await client.query(truncateQuery);
    console.log('✅ Successfully cleared all database records! Database is clean and reset.');

  } catch (err) {
    console.log('Database Reset Note (using local fallback engine if DB offline):', err);
  } finally {
    await client.end();
  }
}

resetDatabase();
