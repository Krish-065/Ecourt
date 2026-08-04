import multer from 'multer';
import path from 'path';
import { config } from '../config';
import fs from 'fs';

// Ensure storage directory exists
if (!fs.existsSync(config.storagePath)) {
  fs.mkdirSync(config.storagePath, { recursive: true });
}

const storage = multer.memoryStorage(); // Upload to memory buffer first for AES-256 encryption processing

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported formats: PDF, DOCX, DOC, JPEG, PNG'));
    }
  },
});
