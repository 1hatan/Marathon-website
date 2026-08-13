const { getPool } = require('../db');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), phone ? phone.trim() : '', subject ? subject.trim() : 'General Inquiry', message.trim(), 'Unread']
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      id: result.insertId || result.lastID
    });
  } catch (err) {
    console.error('Submit Contact Message Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, messages: rows || [] });
  } catch (err) {
    console.error('Get Contact Messages Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = await getPool();

    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status || 'Read', id]);
    res.json({ success: true, message: 'Message status updated.' });
  } catch (err) {
    console.error('Update Contact Status Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update message status.', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Delete Contact Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete message.', error: err.message });
  }
};
