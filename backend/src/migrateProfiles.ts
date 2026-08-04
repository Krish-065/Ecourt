import { Client } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createAdvocateProfilesTable() {
  console.log('Connecting to Neon PostgreSQL Database to create advocate_profiles table...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const query = `
      CREATE TABLE IF NOT EXISTS advocate_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          specialization VARCHAR(255) NOT NULL,
          office_location VARCHAR(255) NOT NULL,
          experience_years INT NOT NULL,
          contact_phone VARCHAR(50),
          bio TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(query);
    console.log('🎉 advocate_profiles table created successfully or already exists!');
  } catch (err) {
    console.error('Error creating advocate_profiles table:', err);
  } finally {
    await client.end();
  }
}

createAdvocateProfilesTable();
