const { getPool } = require('../db');

exports.getSettings = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM event_settings LIMIT 1');
    const settings = rows.length > 0 ? rows[0] : {
      event_name: 'Infinity Run',
      event_date: 'Sunday, November 15, 2026',
      venue: 'City Sports Complex & National Stadium',
      location: 'Central Boulevard, Metro City',
      reporting_time: '05:00 AM',
      flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
      registration_deadline: 'November 10, 2026',
      contact_email: 'support@infinityrun.org',
      contact_phone: '+1 (800) 555-0199'
    };
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Get Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve event settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      event_name,
      event_date,
      venue,
      location,
      reporting_time,
      flagoff_time,
      registration_deadline,
      contact_email,
      contact_phone
    } = req.body;

    const pool = await getPool();
    const [rows] = await pool.query('SELECT id FROM event_settings LIMIT 1');

    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO event_settings (id, event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone]);
    } else {
      await pool.query(`
        UPDATE event_settings
        SET event_name=?, event_date=?, venue=?, location=?, reporting_time=?, flagoff_time=?, registration_deadline=?, contact_email=?, contact_phone=?
        WHERE id=?
      `, [event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone, rows[0].id]);
    }

    res.json({ success: true, message: 'Event settings updated successfully.' });
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update event settings.' });
  }
};
