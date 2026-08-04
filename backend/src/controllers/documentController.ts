import { Response } from 'express';
import { db, config } from '../config/index';
import { AuthenticatedRequest } from '../middleware/auth';
import { encryptBuffer, decryptBuffer } from '../utils/crypto';
import { logAuditEvent } from '../utils/auditLogger';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadDocument(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { caseId, tags } = req.body;
    const userId = req.user?.userId!;
    const file = req.file;

    // Perform AES-256-GCM encryption on the uploaded file buffer
    const { encryptedData, iv, authTag } = encryptBuffer(file.buffer);

    const storageFilename = `${uuidv4()}.enc`;
    const storageFilePath = path.join(config.storagePath, storageFilename);

    // Save encrypted file payload along with IV and AuthTag stored in file header
    const filePayload = Buffer.concat([
      Buffer.from(iv, 'hex'), // 16 bytes
      Buffer.from(authTag, 'hex'), // 16 bytes
      encryptedData,
    ]);

    await fs.promises.writeFile(storageFilePath, filePayload);

    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',')) : ['General Legal'];

    const result = await db.query(
      `INSERT INTO documents (owner_id, case_id, filename, original_name, mime_type, size_bytes, storage_path, is_encrypted, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, caseId || null, storageFilename, file.originalname, file.mimetype, file.size, storageFilePath, true, parsedTags]
    );

    await logAuditEvent(userId, 'DOCUMENT_UPLOAD_ENCRYPTED', req.ip, req.headers['user-agent'] as string, {
      documentId: result.rows[0].id,
      filename: file.originalname,
    });

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Document Upload Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload and encrypt document' });
  }
}

export async function getDocuments(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId!;
    const result = await db.query(
      `SELECT d.id, d.filename, d.original_name, d.mime_type, d.size_bytes, d.is_encrypted, d.tags, d.created_at, c.title as case_title
       FROM documents d
       LEFT JOIN cases c ON d.case_id = c.id
       WHERE d.owner_id = $1
       ORDER BY d.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve document vault list' });
  }
}

export async function downloadDocument(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId!;

    const result = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const doc = result.rows[0];
    if (doc.owner_id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Access denied to this document' });
    }

    const filePayload = await fs.promises.readFile(doc.storage_path);
    const ivHex = filePayload.subarray(0, 16).toString('hex');
    const authTagHex = filePayload.subarray(16, 32).toString('hex');
    const encryptedData = filePayload.subarray(32);

    const decryptedBuffer = decryptBuffer(encryptedData, ivHex, authTagHex);

    await logAuditEvent(userId, 'DOCUMENT_DOWNLOAD_DECRYPTED', req.ip, req.headers['user-agent'] as string, { documentId: doc.id });

    res.setHeader('Content-Type', doc.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
    return res.send(decryptedBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ success: false, error: 'Failed to decrypt and download document' });
  }
}
