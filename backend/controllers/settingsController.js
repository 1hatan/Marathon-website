const { getPool } = require('../db');

exports.getSettings = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM event_settings LIMIT 1');
    const settings = (rows && rows.length > 0) ? rows[0] : {
      event_name: 'Infinity Run',
      event_date: 'Sunday, November 15, 2026',
      venue: 'Salem Sports Complex & Mahatma Gandhi Stadium',
      location: 'Salem, Tamil Nadu'
    };
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Get Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve event settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone } = req.body;
    const pool = await getPool();

    const [existing] = await pool.query('SELECT id FROM event_settings LIMIT 1');
    if (existing && existing.length > 0) {
      await pool.query(`
        UPDATE event_settings 
        SET event_name=?, event_date=?, venue=?, location=?, reporting_time=?, flagoff_time=?, registration_deadline=?, contact_email=?, contact_phone=?
        WHERE id=?
      `, [event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone, existing[0].id]);
    } else {
      await pool.query(`
        INSERT INTO event_settings 
        (id, event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone]);
    }

    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update event settings.' });
  }
};
