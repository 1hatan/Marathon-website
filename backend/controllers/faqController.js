const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';

    let sql = 'SELECT * FROM faq';
    if (!isAdmin) {
      sql += " WHERE status = 'active'";
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql);
    res.json({ success: true, faqs: rows || [] });
  } catch (err) {
    console.error('Get FAQs Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve FAQs.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { question, answer, status } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO faq (question, answer, status) VALUES (?, ?, ?)',
      [question, answer, status || 'active']
    );
    res.status(201).json({ success: true, message: 'FAQ created.', id: result.insertId || result.lastID });
  } catch (err) {
    console.error('Create FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create FAQ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, status } = req.body;
    const pool = await getPool();
    const [result] = await pool.query(
      'UPDATE faq SET question=?, answer=?, status=? WHERE id=?',
      [question, answer, status || 'active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }

    res.json({ success: true, message: 'FAQ updated.' });
  } catch (err) {
    console.error('Update FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update FAQ.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const [result] = await pool.query('DELETE FROM faq WHERE id=?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }

    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (err) {
    console.error('Delete FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete FAQ.' });
  }
};
