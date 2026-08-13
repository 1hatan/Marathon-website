const { getPool } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';

    let sql = 'SELECT * FROM sponsors';
    if (!isAdmin) {
      sql += " WHERE status = 'active'";
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql);
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
      [name.trim(), logo ? logo.trim() : '', tier || 'Silver Sponsor', website ? website.trim() : '', status || 'active']
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
    const [result] = await pool.query(
      'UPDATE sponsors SET name=?, logo=?, tier=?, website=?, status=? WHERE id=?',
      [name, logo, tier, website, status || 'active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }

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
    const [result] = await pool.query('DELETE FROM sponsors WHERE id=?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }

    res.json({ success: true, message: 'Sponsor deleted.' });
  } catch (err) {
    console.error('Delete Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete sponsor.' });
  }
};
