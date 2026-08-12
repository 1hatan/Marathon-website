const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const isAdmin = req.query.admin === 'true';
    const query = isAdmin ? 'SELECT * FROM gallery ORDER BY id DESC' : "SELECT * FROM gallery WHERE status = 'active' ORDER BY id DESC";
    const [rows] = await pool.query(query);
    res.json({ success: true, gallery: rows });
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
      [image_url, title || 'Marathon Photo', status || 'active']
    );
    res.status(201).json({ success: true, message: 'Gallery image added.', id: result.insertId });
  } catch (err) {
    console.error('Create Gallery Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add gallery image.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, title, status } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE gallery SET image_url=?, title=?, status=? WHERE id=?',
      [image_url, title, status, id]
    );
    res.json({ success: true, message: 'Gallery item updated.' });
  } catch (err) {
    console.error('Update Gallery Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery item.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.query('DELETE FROM gallery WHERE id=?', [id]);
    res.json({ success: true, message: 'Gallery image deleted.' });
  } catch (err) {
    console.error('Delete Gallery Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gallery image.' });
  }
};
