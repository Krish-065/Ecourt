import { Request, Response } from 'express';
import { Client } from 'pg';
import { config } from '../config';

const getDbClient = async () => {
  const client = new Client({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  return client;
};

// GET /api/v1/advocates - Get list of advocates with optional filters
export const getAdvocates = async (req: Request, res: Response) => {
  const { name, location, specialization } = req.query;
  const client = await getDbClient();

  try {
    let sql = `
      SELECT ap.*, u.email, u.phone_number, u.verification_status 
      FROM advocate_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE u.role = 'ADVOCATE'
    `;
    const params: any[] = [];
    let paramCounter = 1;

    if (name) {
      sql += ` AND (ap.full_name ILIKE $${paramCounter} OR u.full_name ILIKE $${paramCounter})`;
      params.push(`%${name}%`);
      paramCounter++;
    }

    if (location) {
      sql += ` AND ap.office_location ILIKE $${paramCounter}`;
      params.push(`%${location}%`);
      paramCounter++;
    }

    if (specialization) {
      sql += ` AND ap.specialization ILIKE $${paramCounter}`;
      params.push(`%${specialization}%`);
      paramCounter++;
    }

    sql += ' ORDER BY ap.created_at DESC';

    const result = await client.query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    console.error('Error fetching advocates:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.end();
  }
};

// POST /api/v1/advocates - Add/Update Advocate Directory Profile
export const upsertAdvocateProfile = async (req: any, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== 'ADVOCATE') {
    return res.status(430).json({ 
      success: false, 
      error: 'Access Denied: Only users registered as ADVOCATE can list their practice profile.' 
    });
  }

  const { specialization, officeLocation, experienceYears, contactPhone, bio } = req.body;

  if (!specialization || !officeLocation || !experienceYears) {
    return res.status(400).json({ 
      success: false, 
      error: 'Specialization, Office Location, and Years of Experience are required fields.' 
    });
  }

  const client = await getDbClient();

  try {
    // Check user info
    const userResult = await client.query('SELECT full_name FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const fullName = userResult.rows[0].full_name;

    const sql = `
      INSERT INTO advocate_profiles (user_id, full_name, specialization, office_location, experience_years, contact_phone, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) DO UPDATE 
      SET full_name = EXCLUDED.full_name,
          specialization = EXCLUDED.specialization,
          office_location = EXCLUDED.office_location,
          experience_years = EXCLUDED.experience_years,
          contact_phone = EXCLUDED.contact_phone,
          bio = EXCLUDED.bio,
          created_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await client.query(sql, [
      userId,
      fullName,
      specialization,
      officeLocation,
      parseInt(experienceYears, 10),
      contactPhone || '',
      bio || ''
    ]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    console.error('Error upserting advocate profile:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await client.end();
  }
};
