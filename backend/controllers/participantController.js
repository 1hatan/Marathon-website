const { getPool } = require('../db');

// Helper to generate registration ID
function generateRegistrationId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `INF-2026-${randomDigits}`;
}

exports.getAll = async (req, res) => {
  try {
    const { search, category_id, status, t_shirt_size } = req.query;
    const pool = await getPool();

    let query = `
      SELECT p.*, r.name as race_name, r.distance as race_distance, r.fee as race_fee
      FROM participants p
      LEFT JOIN race_categories r ON p.race_category_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.full_name LIKE ? OR p.email LIKE ? OR p.mobile LIKE ? OR p.registration_id LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (category_id) {
      query += ` AND p.race_category_id = ?`;
      params.push(category_id);
    }

    if (status) {
      query += ` AND p.registration_status = ?`;
      params.push(status);
    }

    if (t_shirt_size) {
      query += ` AND p.t_shirt_size = ?`;
      params.push(t_shirt_size);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, count: rows.length, participants: rows || [] });
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
      SELECT p.*, r.name as race_name, r.distance as race_distance, r.fee as race_fee
      FROM participants p
      LEFT JOIN race_categories r ON p.race_category_id = r.id
      WHERE p.id = ? OR p.registration_id = ?
    `, [id, id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Participant registration not found.' });
    }

    res.json({ success: true, participant: rows[0] });
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

    // 1. Resolve race category ID robustly
    let finalCatId = parseInt(race_category_id);
    let raceRows = [];

    if (!isNaN(finalCatId)) {
      const [rRows] = await pool.query('SELECT * FROM race_categories WHERE id = ?', [finalCatId]);
      raceRows = rRows;
    }

    if (!raceRows || raceRows.length === 0) {
      const [rRows] = await pool.query('SELECT * FROM race_categories WHERE distance = ? OR name LIKE ?', [race_category_id, `%${race_category_id}%`]);
      raceRows = rRows;
    }

    if (!raceRows || raceRows.length === 0) {
      const [rRows] = await pool.query('SELECT * FROM race_categories LIMIT 1');
      raceRows = rRows;
    }

    const selectedRace = (raceRows && raceRows.length > 0) ? raceRows[0] : { id: 1, name: '3K Fun Run', distance: '3K', fee: 499 };
    finalCatId = selectedRace.id;

    // 2. Format / Fallback DOB (Date of Birth) or calculate from Age
    let validDob = dob;
    const ageVal = parseInt(age);
    if (!isNaN(ageVal) && ageVal > 0) {
      const birthYear = new Date().getFullYear() - ageVal;
      validDob = `${birthYear}-01-01`;
    } else if (!validDob || String(validDob).trim() === '') {
      validDob = '2000-01-01';
    } else {
      try {
        const d = new Date(validDob);
        if (!isNaN(d.getTime())) {
          validDob = d.toISOString().split('T')[0];
        } else {
          validDob = '2000-01-01';
        }
      } catch (e) {
        validDob = '2000-01-01';
      }
    }

    // 3. Fallbacks for emergency details
    const eName = emergency_name || `${full_name} Contact`;
    const eMobile = emergency_mobile || mobile;
    const eRelation = emergency_relation || 'Parent/Spouse';

    // 4. Unique Registration ID
    let registration_id = generateRegistrationId();
    try {
      let [existing] = await pool.query('SELECT id FROM participants WHERE registration_id = ?', [registration_id]);
      while (existing && existing.length > 0) {
        registration_id = generateRegistrationId();
        const [nextCheck] = await pool.query('SELECT id FROM participants WHERE registration_id = ?', [registration_id]);
        existing = nextCheck;
      }
    } catch (e) {
      // Table check fallback
    }

    // 5. Insert into database
    const [result] = await pool.query(`
      INSERT INTO participants 
      (registration_id, full_name, email, mobile, dob, gender, blood_group, race_category_id, t_shirt_size, emergency_name, emergency_mobile, emergency_relation, medical_info, registration_status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', 'Paid')
    `, [
      registration_id,
      full_name,
      email,
      mobile,
      validDob,
      gender || 'Male',
      blood_group || 'O+',
      finalCatId,
      t_shirt_size || 'M',
      eName,
      eMobile,
      eRelation,
      medical_info || null
    ]);

    const insertedId = result.insertId || result.lastID;

    // 6. Fetch inserted participant or construct fallback response object
    let participantObj = null;
    if (insertedId) {
      const [createdRows] = await pool.query(`
        SELECT p.*, r.name as race_name, r.distance as race_distance, r.fee as race_fee
        FROM participants p
        LEFT JOIN race_categories r ON p.race_category_id = r.id
        WHERE p.id = ?
      `, [insertedId]);
      if (createdRows && createdRows.length > 0) {
        participantObj = createdRows[0];
      }
    }

    if (!participantObj) {
      participantObj = {
        id: insertedId || Date.now(),
        registration_id,
        full_name,
        email,
        mobile,
        dob: validDob,
        gender: gender || 'Male',
        blood_group: blood_group || 'O+',
        race_category_id: finalCatId,
        race_name: selectedRace.name,
        race_distance: selectedRace.distance,
        race_fee: selectedRace.fee,
        t_shirt_size: t_shirt_size || 'M',
        emergency_name: eName,
        emergency_mobile: eMobile,
        emergency_relation: eRelation,
        registration_status: 'Confirmed',
        payment_status: 'Paid'
      };
    }

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
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

    const [existing] = await pool.query('SELECT * FROM participants WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    const current = existing[0];
    const newStatus = registration_status || current.registration_status;
    const newPayment = payment_status || current.payment_status;
    const newName = full_name || current.full_name;
    const newEmail = email || current.email;
    const newMobile = mobile || current.mobile;
    const newSize = t_shirt_size || current.t_shirt_size;

    await pool.query(`
      UPDATE participants 
      SET registration_status = ?, payment_status = ?, full_name = ?, email = ?, mobile = ?, t_shirt_size = ?
      WHERE id = ?
    `, [newStatus, newPayment, newName, newEmail, newMobile, newSize, id]);

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

    const [result] = await pool.query('DELETE FROM participants WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    res.json({ success: true, message: 'Participant deleted successfully.' });
  } catch (err) {
    console.error('Delete Participant Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete participant.', error: err.message });
  }
};
