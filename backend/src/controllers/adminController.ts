import { Response } from 'express';
import { db } from '../config/index';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../utils/auditLogger';

export async function getSystemMetrics(req: AuthenticatedRequest, res: Response) {
  try {
    const userStats = await db.query('SELECT role, count(*) as count FROM users GROUP BY role');
    const caseStats = await db.query('SELECT status, count(*) as count FROM cases GROUP BY status');
    const docCount = await db.query('SELECT count(*) as total_docs, sum(size_bytes) as total_size FROM documents');
    const auditCount = await db.query('SELECT count(*) as total_logs FROM audit_logs');

    return res.json({
      success: true,
      data: {
        usersByRole: userStats.rows,
        casesByStatus: caseStats.rows,
        documentVault: docCount.rows[0],
        totalAuditLogs: auditCount.rows[0].total_logs,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to compute admin metrics' });
  }
}

export async function getPendingVerifications(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.role, u.bar_council_id, u.college_id, u.company_registration_no, u.verification_status, u.created_at
       FROM users u
       WHERE u.verification_status = 'PENDING'
       ORDER BY u.created_at DESC`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve pending verifications' });
  }
}

export async function verifyUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body; // VERIFIED or REJECTED

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be VERIFIED or REJECTED.' });
    }

    await db.query('UPDATE users SET verification_status = $1 WHERE id = $2', [status, userId]);
    await logAuditEvent(req.user?.userId!, 'ADMIN_VERIFY_USER', req.ip, req.headers['user-agent'] as string, { targetUserId: userId, status, reason });

    return res.json({ success: true, message: `User verification updated to ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update user verification' });
  }
}

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await db.query(
      `SELECT a.*, u.full_name, u.email, u.role
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 100`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve audit logs' });
  }
}
