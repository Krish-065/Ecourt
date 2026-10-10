import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://ecourt_admin:ecourt_secure_pass_2026@localhost:5432/ecourt_db',
  jwtSecret: process.env.JWT_SECRET || 'ecourt_jwt_access_super_secret_key_2026_x99!',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'ecourt_jwt_refresh_super_secret_key_2026_z100!',
  jwtExpiration: process.env.JWT_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  storagePath: path.resolve(__dirname, '../../../storage'),
};

// PostgreSQL Connection Pool
export const db = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl: config.databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});
