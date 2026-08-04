import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  verificationStatus: string;
}

// AES-256-GCM Encryption for Secure Document Vault
export function encryptBuffer(buffer: Buffer): { encryptedData: Buffer; iv: string; authTag: string } {
  const key = Buffer.from(config.encryptionKey.substring(0, 64), 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

// AES-256-GCM Decryption
export function decryptBuffer(encryptedBuffer: Buffer, ivHex: string, authTagHex: string): Buffer {
  const key = Buffer.from(config.encryptionKey.substring(0, 64), 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token Generators
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
}
