import { db } from '../config/index';

export async function logAuditEvent(
  userId: string | null,
  action: string,
  ipAddress: string = '127.0.0.1',
  userAgent: string = 'ECourt-Backend',
  details: Record<string, any> = {}
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, ipAddress, userAgent, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Audit Logging Error:', error);
  }
}
