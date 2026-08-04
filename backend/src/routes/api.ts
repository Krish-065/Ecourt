import { Router } from 'express';
import { register, login, refreshToken, getProfile, scanAdvocateID } from '../controllers/authController';
import { createCase, getCases, getCaseById, addHearing, addEvidence, fetchECourtCase } from '../controllers/caseController';
import { uploadDocument, getDocuments, downloadDocument } from '../controllers/documentController';
import { getUpcomingHearings } from '../controllers/calendarController';
import { getSystemMetrics, getPendingVerifications, verifyUserRole, getAuditLogs } from '../controllers/adminController';
import { getAdvocates, upsertAdvocateProfile } from '../controllers/advocateController';
import { getOrCreateSession, saveMessage, getSessions, getSessionMessages, clearSessionMessages } from '../controllers/chatController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// Authentication Endpoints
router.post('/auth/register', authRateLimiter, register);
router.post('/auth/login', authRateLimiter, login);
router.post('/auth/verify-advocate-id', scanAdvocateID);
router.post('/auth/refresh', refreshToken);
router.get('/auth/profile', authenticateJWT, getProfile);

// Advocate Directory Endpoints
router.get('/advocates', getAdvocates);
router.post('/advocates', authenticateJWT, authorizeRoles('ADVOCATE'), upsertAdvocateProfile);

// Persistent Chat Sessions & Message History
router.post('/chat/sessions', authenticateJWT, getOrCreateSession);
router.post('/chat/messages', authenticateJWT, saveMessage);
router.get('/chat/sessions', authenticateJWT, getSessions);
router.get('/chat/sessions/:sessionId/messages', authenticateJWT, getSessionMessages);
router.delete('/chat/sessions/:sessionId/messages', authenticateJWT, clearSessionMessages);

// Case Management & eCourts Endpoints
router.post('/cases/ecourt-fetch', fetchECourtCase);
router.post('/cases', authenticateJWT, authorizeRoles('CITIZEN', 'ADVOCATE', 'BUSINESS', 'ADMIN'), createCase);
router.get('/cases', authenticateJWT, getCases);
router.get('/cases/:id', authenticateJWT, getCaseById);
router.post('/cases/:id/hearings', authenticateJWT, authorizeRoles('ADVOCATE', 'ADMIN'), addHearing);
router.post('/cases/:id/evidence', authenticateJWT, addEvidence);

// Document Vault Endpoints (AES-256 Encrypted Storage)
router.post('/documents/upload', authenticateJWT, uploadMiddleware.single('file'), uploadDocument);
router.get('/documents', authenticateJWT, getDocuments);
router.get('/documents/:id/download', authenticateJWT, downloadDocument);

// Court Calendar
router.get('/calendar/hearings', authenticateJWT, getUpcomingHearings);

// Admin Governance & System Security
router.get('/admin/metrics', authenticateJWT, authorizeRoles('ADMIN'), getSystemMetrics);
router.get('/admin/verifications', authenticateJWT, authorizeRoles('ADMIN'), getPendingVerifications);
router.patch('/admin/verifications/:userId', authenticateJWT, authorizeRoles('ADMIN'), verifyUserRole);
router.get('/admin/audit-logs', authenticateJWT, authorizeRoles('ADMIN'), getAuditLogs);

export default router;
