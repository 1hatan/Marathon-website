const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';

    let sql = 'SELECT * FROM gallery';
    if (!isAdmin) {
      sql += " WHERE status = 'active'";
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql);
    res.json({ success: true, gallery: rows || [] });
  } catch (err) {
    console.error('Get Gallery Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery items.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { image_url, title, status } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO gallery (image_url, title, status) VALUES (?, ?, ?)',
      [image_url, title || '', status || 'active']
    );
    res.status(201).json({ success: true, message: 'Gallery item added.', id: result.insertId || result.lastID });
  } catch (err) {
    console.error('Create Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, title, status } = req.body;
    const pool = await getPool();
    const [result] = await pool.query(
      'UPDATE gallery SET image_url=?, title=?, status=? WHERE id=?',
      [image_url, title, status || 'active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.json({ success: true, message: 'Gallery item updated.' });
  } catch (err) {
    console.error('Update Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery item.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const [result] = await pool.query('DELETE FROM gallery WHERE id=?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) {
    console.error('Delete Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
};
