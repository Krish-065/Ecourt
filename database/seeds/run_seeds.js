const fs = require('fs');
const path = require('path');

// Resolve .env from project root
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const k = key.trim();
      const v = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (k && !process.env[k]) {
        process.env[k] = v;
      }
    }
  });
}

// Require pg from backend node_modules
const pgPath = path.resolve(__dirname, '../../backend/node_modules/pg');
const { Client } = require(pgPath);

async function runSeeds() {
  console.log('Connecting to Neon PostgreSQL Database from database/seeds...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to Neon PostgreSQL database!');

    const seedSqlPath = path.resolve(__dirname, '001_initial_seeds.sql');
    console.log(`Reading SQL seed file from: ${seedSqlPath}`);
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

    console.log('Executing interconnected seeds SQL statements...');
    await client.query(seedSql);

    console.log('🎉 Database seeds from database/seeds/001_initial_seeds.sql executed successfully!');
  } catch (err) {
    console.error('Error running seeds:', err);
  } finally {
    await client.end();
  }
}

runSeeds();
