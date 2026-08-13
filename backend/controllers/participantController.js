const { getPool } = require('../db');
const jwt = require('jsonwebtoken');

// Helper to generate registration ID
function generateRegistrationId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `INF-2026-${randomDigits}`;
}

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const { search, category_id, status, t_shirt_size } = req.query;

    let sql = `
      SELECT 
        p.*,
        r.name as race_name,
        r.distance as race_distance,
        r.fee as race_fee
      FROM participants p
      LEFT JOIN race_categories r ON p.race_category_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      const term = `%${search.trim()}%`;
      sql += ` AND (p.full_name LIKE ? OR p.email LIKE ? OR p.mobile LIKE ? OR p.registration_id LIKE ?)`;
      params.push(term, term, term, term);
    }

    if (category_id) {
      sql += ` AND p.race_category_id = ?`;
      params.push(parseInt(category_id));
    }

    if (status) {
      sql += ` AND p.registration_status = ?`;
      params.push(status);
    }

    if (t_shirt_size) {
      sql += ` AND p.t_shirt_size = ?`;
      params.push(t_shirt_size);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows ? rows.length : 0, participants: rows || [] });
  } catch (err) {
    console.error('Get Participants Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve participants.', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const [rows] = await pool.query(`
      SELECT 
        p.*,
        r.name as race_name,
        r.distance as race_distance,
        r.fee as race_fee
      FROM participants p
      LEFT JOIN race_categories r ON p.race_category_id = r.id
      WHERE p.registration_id = ? OR p.id = ?
      LIMIT 1
    `, [id, id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Participant registration not found.' });
    }

    const participant = rows[0];

    // Check if caller is authenticated admin
    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'infinity_run_salem_jwt_secret_key_2026_987654321_secure_key');
        isAdmin = true;
      } catch (e) {
        isAdmin = false;
      }
    }

    if (isAdmin) {
      return res.json({ success: true, participant });
    }

    // Public lookup: project ONLY safe ticket pass fields (no medical or emergency details)
    res.json({
      success: true,
      participant: {
        registration_id: participant.registration_id,
        full_name: participant.full_name,
        race_name: participant.race_name || '3K Fun Run',
        race_distance: participant.race_distance || '3K',
        t_shirt_size: participant.t_shirt_size,
        blood_group: participant.blood_group,
        registration_status: participant.registration_status,
        created_at: participant.created_at
      }
    });
  } catch (err) {
    console.error('Get Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve participant details.', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      full_name,
      email,
      mobile,
      age,
      dob,
      gender,
      blood_group,
      race_category_id,
      t_shirt_size,
      emergency_name,
      emergency_mobile,
      emergency_relation,
      medical_info
    } = req.body;

    if (!full_name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Please enter Full Name, Email, and Phone Number.' });
    }

    const pool = await getPool();

    // 1. Resolve race category
    let finalCatId = parseInt(race_category_id);
    let [races] = await pool.query('SELECT * FROM race_categories WHERE id = ? LIMIT 1', [finalCatId]);

    if (!races || races.length === 0) {
      [races] = await pool.query('SELECT * FROM race_categories LIMIT 1');
    }

    const selectedRace = (races && races.length > 0) ? races[0] : { id: 1, name: '3K Fun Run', distance: '3K', fee: 499 };
    finalCatId = selectedRace.id;

    // 2. Derive DOB properly from age or date input
    let validDob = dob;
    const ageVal = parseInt(age);
    if (!isNaN(ageVal) && ageVal > 0) {
      const birthYear = new Date().getFullYear() - ageVal;
      validDob = `${birthYear}-01-01`;
    } else if (!validDob || String(validDob).trim() === '') {
      validDob = '2000-01-01';
    }

    const eName = emergency_name || `${full_name} Contact`;
    const eMobile = emergency_mobile || mobile;
    const eRelation = emergency_relation || 'Contact';

    // 3. Unique Registration ID loop (with query error propagation)
    let registration_id = generateRegistrationId();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      attempts++;
      const [existing] = await pool.query('SELECT id FROM participants WHERE registration_id = ? LIMIT 1', [registration_id]);
      if (!existing || existing.length === 0) {
        isUnique = true;
      } else {
        registration_id = generateRegistrationId();
      }
    }

    // 4. Insert Participant into MySQL
    const [result] = await pool.query(`
      INSERT INTO participants (
        registration_id, full_name, email, mobile, dob, gender, blood_group,
        race_category_id, t_shirt_size, emergency_name, emergency_mobile,
        emergency_relation, medical_info, registration_status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      registration_id,
      full_name.trim(),
      email.trim().toLowerCase(),
      mobile.trim(),
      validDob,
      gender || 'Male',
      blood_group || 'O+',
      finalCatId,
      t_shirt_size || 'M',
      eName,
      eMobile,
      eRelation,
      medical_info || null,
      'Confirmed',
      'Paid'
    ]);

    const participantObj = {
      id: result.insertId || result.lastID,
      registration_id,
      full_name,
      email,
      mobile,
      dob: validDob,
      gender,
      blood_group,
      race_category_id: finalCatId,
      race_name: selectedRace.name,
      race_distance: selectedRace.distance,
      t_shirt_size,
      registration_status: 'Confirmed'
    };

    console.log(`[MySQL] New participant registered: ${registration_id} - ${full_name}`);

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
      registration_id,
      participant: participantObj
    });
  } catch (err) {
    console.error('Create Participant Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process registration.'
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { registration_status, payment_status, full_name, email, mobile, t_shirt_size } = req.body;
    const pool = await getPool();

    const [result] = await pool.query(`
      UPDATE participants 
      SET registration_status = COALESCE(?, registration_status),
          payment_status = COALESCE(?, payment_status),
          full_name = COALESCE(?, full_name),
          email = COALESCE(?, email),
          mobile = COALESCE(?, mobile),
          t_shirt_size = COALESCE(?, t_shirt_size),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR registration_id = ?
    `, [registration_status, payment_status, full_name, email, mobile, t_shirt_size, id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, message: 'Participant updated successfully.' });
  } catch (err) {
    console.error('Update Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update participant.', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const [result] = await pool.query('DELETE FROM participants WHERE id = ? OR registration_id = ?', [id, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, message: 'Participant deleted successfully.' });
  } catch (err) {
    console.error('Delete Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete participant.', error: err.message });
  }
};
