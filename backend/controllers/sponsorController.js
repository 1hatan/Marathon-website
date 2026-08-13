const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query("SELECT * FROM sponsors WHERE status = 'active' ORDER BY created_at DESC");
    res.json({ success: true, sponsors: rows || [] });
  } catch (err) {
    console.error('Get Sponsors Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve sponsors.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, logo, tier, website, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Sponsor name is required.' });
    }
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO sponsors (name, logo, tier, website, status) VALUES (?, ?, ?, ?, ?)',
      [name, logo || '', tier || 'Silver Sponsor', website || '', status || 'active']
    );
    res.status(201).json({ success: true, message: 'Sponsor added.', id: result.insertId || result.lastID });
  } catch (err) {
    console.error('Create Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create sponsor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, tier, website, status } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE sponsors SET name=?, logo=?, tier=?, website=?, status=? WHERE id=?',
      [name, logo, tier, website, status || 'active', id]
    );
    res.json({ success: true, message: 'Sponsor updated.' });
  } catch (err) {
    console.error('Update Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update sponsor.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    await pool.query('DELETE FROM sponsors WHERE id=?', [id]);
    res.json({ success: true, message: 'Sponsor deleted.' });
  } catch (err) {
    console.error('Delete Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete sponsor.' });
  }
};
