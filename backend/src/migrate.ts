import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function runMigration() {
  console.log('Connecting to Neon PostgreSQL Database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 35) + '...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon PostgreSQL Database successfully!');

    // Read Migration files
    const schemaSql = fs.readFileSync(path.resolve(__dirname, '../../database/migrations/001_initial_schema.sql'), 'utf8');
    const vectorSql = fs.readFileSync(path.resolve(__dirname, '../../database/migrations/002_vector_store.sql'), 'utf8');
    const seedsSql = fs.readFileSync(path.resolve(__dirname, '../../database/seeds/001_initial_seeds.sql'), 'utf8');

    console.log('Running 001_initial_schema.sql...');
    await client.query(schemaSql);

    console.log('Running 002_vector_store.sql...');
    await client.query(vectorSql);

    console.log('Running 001_initial_seeds.sql...');
    await client.query(seedsSql);

    console.log('🎉 Neon PostgreSQL Schema & Seeds Migration Completed Successfully!');
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
