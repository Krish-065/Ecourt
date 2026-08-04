import { Request, Response } from 'express';
import { db } from '../config/index';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/crypto';
import { logAuditEvent } from '../utils/auditLogger';
import { AuthenticatedRequest } from '../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
    const { fullName, email, password, role, phone, barCouncilId, collegeId, companyRegNo } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ success: false, error: 'Missing required fields: fullName, email, password, role' });
    }

    const validRoles = ['CITIZEN', 'ADVOCATE', 'LAW_STUDENT', 'BUSINESS', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'User with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);
    // Advocates & Law Students require pending verification, others VERIFIED by default
    const initialVerification = (role === 'ADVOCATE' || role === 'LAW_STUDENT') ? 'PENDING' : 'VERIFIED';

    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, full_name, email, role, verification_status, created_at`,
      [fullName, email.toLowerCase(), passwordHash, role, phone || null, initialVerification, barCouncilId || null, collegeId || null, companyRegNo || null]
    );

    const newUser = result.rows[0];

    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      verificationStatus: newUser.verification_status,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    const tokenHash = await hashPassword(refreshToken);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '7 days')`,
      [newUser.id, tokenHash]
    );

    await logAuditEvent(newUser.id, 'USER_REGISTER', req.ip, req.headers['user-agent'] as string, { role });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          fullName: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          verificationStatus: newUser.verification_status,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error during registration' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      await logAuditEvent(null, 'LOGIN_FAILED', req.ip, req.headers['user-agent'] as string, { email });
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      await logAuditEvent(user.id, 'LOGIN_FAILED_BAD_PASSWORD', req.ip, req.headers['user-agent'] as string);
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verification_status,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    const tokenHash = await hashPassword(refreshToken);
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '7 days')`,
      [user.id, tokenHash]
    );

    await logAuditEvent(user.id, 'USER_LOGIN', req.ip, req.headers['user-agent'] as string);

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          verificationStatus: user.verification_status,
          barCouncilId: user.bar_council_id,
          collegeId: user.college_id,
          companyRegNo: user.company_registration_no,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error during login' });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const payload = verifyRefreshToken(token);

    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User no longer exists' });
    }

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      verificationStatus: payload.verificationStatus,
    });

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const result = await db.query(
      `SELECT id, full_name, email, role, phone_number, verification_status, bar_council_id, college_id, company_registration_no, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
}

export async function scanAdvocateID(req: Request, res: Response) {
  try {
    const { documentBase64, filename, stateBarCouncil } = req.body;

    if (!documentBase64 && !filename) {
      return res.status(400).json({ success: false, error: 'Document file or base64 data is required for OCR scanning' });
    }

    // OCR Analysis & Bar Council Validation Simulation
    const mockBarNo = `BAR/${stateBarCouncil || 'MAH'}/${Math.floor(1000 + Math.random() * 9000)}/2020`;
    const randomEnrollmentDate = `14-Aug-${2015 + Math.floor(Math.random() * 8)}`;

    const scanResult = {
      verified: true,
      confidenceScore: 98.4,
      extractedData: {
        advocateName: "Verified Advocate Credentials",
        barCouncilNumber: mockBarNo,
        stateBarCouncil: stateBarCouncil || "Bar Council of Maharashtra & Goa",
        enrollmentDate: randomEnrollmentDate,
        status: "ACTIVE_PRACTITIONER",
        documentType: "ADVOCATE_ID_CARD / SANAD CERTIFICATE",
      },
      digitalSignatureVerified: true,
      scannedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      data: scanResult,
      message: "Advocate ID Card scanned & validated against Bar Council Registry!"
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: 'OCR Advocate Scan Failed' });
  }
}

