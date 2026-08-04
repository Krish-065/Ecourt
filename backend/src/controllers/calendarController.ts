import { Response } from 'express';
import { db } from '../config/index';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getUpcomingHearings(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId!;
    const role = req.user?.role!;

    let query = `
      SELECT h.*, c.case_number, c.title as case_title, c.court_name, u.full_name as client_name, a.full_name as advocate_name
      FROM hearings h
      JOIN cases c ON h.case_id = c.id
      LEFT JOIN users u ON c.client_id = u.id
      LEFT JOIN users a ON c.advocate_id = a.id
    `;
    const params: any[] = [];

    if (role === 'CITIZEN') {
      query += ' WHERE c.client_id = $1';
      params.push(userId);
    } else if (role === 'ADVOCATE') {
      query += ' WHERE c.advocate_id = $1 OR c.client_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY h.hearing_date ASC';
    const result = await db.query(query, params);

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch court calendar' });
  }
}
