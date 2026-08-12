const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM race_categories ORDER BY fee ASC');
    res.json({ success: true, races: rows });
  } catch (err) {
    console.error('Get Races Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve race categories.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, distance, description, age_limit, fee, status } = req.body;
    if (!name || !distance || fee === undefined) {
      return res.status(400).json({ success: false, message: 'Name, distance, and fee are required.' });
    }
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO race_categories (name, distance, description, age_limit, fee, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, distance, description || '', age_limit || 'Open to all', fee, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Race category created.', id: result.insertId });
  } catch (err) {
    console.error('Create Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create race category.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, distance, description, age_limit, fee, status } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE race_categories SET name=?, distance=?, description=?, age_limit=?, fee=?, status=? WHERE id=?',
      [name, distance, description, age_limit, fee, status, id]
    );
    res.json({ success: true, message: 'Race category updated.' });
  } catch (err) {
    console.error('Update Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update race category.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.query('DELETE FROM race_categories WHERE id=?', [id]);
    res.json({ success: true, message: 'Race category deleted.' });
  } catch (err) {
    console.error('Delete Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete race category.' });
  }
};
