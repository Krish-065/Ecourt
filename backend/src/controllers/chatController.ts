import { Response } from 'express';
import { db } from '../config/index';
import { AuthenticatedRequest } from '../middleware/auth';

// Get or Create Session for user and agent type
export async function getOrCreateSession(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { agentType } = req.body;

    if (!agentType) {
      return res.status(400).json({ success: false, error: 'Agent type is required' });
    }

    // Find if session already exists for this user and agent
    const existing = await db.query(
      'SELECT * FROM chat_sessions WHERE user_id = $1 AND agent_type = $2 ORDER BY updated_at DESC LIMIT 1',
      [userId, agentType]
    );

    if (existing.rows.length > 0) {
      return res.json({ success: true, data: existing.rows[0] });
    }

    // Create a new session
    const newSession = await db.query(
      `INSERT INTO chat_sessions (user_id, agent_type, title) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, agentType, `${agentType.replace('_', ' ')} Chat`]
    );

    return res.status(201).json({ success: true, data: newSession.rows[0] });
  } catch (error: any) {
    console.error('getOrCreateSession Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to manage chat session' });
  }
}

// Save Message in Session
export async function saveMessage(req: AuthenticatedRequest, res: Response) {
  try {
    const { sessionId, sender, messageText, citations, confidenceScore } = req.body;

    if (!sessionId || !sender || !messageText) {
      return res.status(400).json({ success: false, error: 'sessionId, sender, and messageText are required' });
    }

    const result = await db.query(
      `INSERT INTO chat_messages (session_id, sender, message_text, citations, confidence_score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [sessionId, sender, messageText, JSON.stringify(citations || []), confidenceScore || null]
    );

    // Update session timestamp
    await db.query(
      'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [sessionId]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('saveMessage Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save chat message' });
  }
}

// Get past sessions list for user
export async function getSessions(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const result = await db.query(
      'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
}

// Get messages for a session
export async function getSessionMessages(req: AuthenticatedRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    const result = await db.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'Failed to fetch session messages' });
  }
}

// Clear chat / Delete Session messages
export async function clearSessionMessages(req: AuthenticatedRequest, res: Response) {
  try {
    const { sessionId } = req.params;
    await db.query('DELETE FROM chat_messages WHERE session_id = $1', [sessionId]);
    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'Failed to clear session messages' });
  }
}
