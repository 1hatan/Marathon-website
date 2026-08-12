const { getPool } = require('../db');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    const pool = await getPool();
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || 'General Query', message, 'Unread']
    );
    res.status(201).json({ success: true, message: 'Thank you! Your message has been sent successfully.' });
  } catch (err) {
    console.error('Contact Form Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, messages: rows });
  } catch (err) {
    console.error('Get Contact Messages Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = await getPool();
    await pool.query('UPDATE contact_messages SET status=? WHERE id=?', [status || 'Read', id]);
    res.json({ success: true, message: 'Message status updated.' });
  } catch (err) {
    console.error('Update Message Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.query('DELETE FROM contact_messages WHERE id=?', [id]);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    console.error('Delete Message Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};
