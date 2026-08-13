const { RaceCategory } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';
    const filter = isAdmin ? {} : { status: 'active' };

    const races = await RaceCategory.find(filter).sort({ fee: 1 }).lean();
    res.json({ success: true, races });
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

    const highest = await RaceCategory.findOne().sort({ id: -1 }).lean();
    const nextId = highest ? (highest.id + 1) : 1;

    const newRace = await RaceCategory.create({
      id: nextId,
      name,
      distance,
      fee: Number(fee),
      description: description || '',
      age_limit: age_limit || 'Open to all ages',
      status: status || 'active'
    });

    res.status(201).json({ success: true, message: 'Race category created.', race: newRace, id: newRace.id });
  } catch (err) {
    console.error('Create Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create race category.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, distance, description, age_limit, fee, status } = req.body;

    const numId = parseInt(id);
    let filter = isNaN(numId) ? { _id: id } : { id: numId };

    const updated = await RaceCategory.findOneAndUpdate(
      filter,
      { name, distance, description, age_limit, fee: Number(fee), status: status || 'active', updated_at: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Race category not found.' });
    }

    res.json({ success: true, message: 'Race category updated.', race: updated });
  } catch (err) {
    console.error('Update Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update race category.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const numId = parseInt(id);
    let filter = isNaN(numId) ? { _id: id } : { id: numId };

    const deleted = await RaceCategory.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Race category not found.' });
    }

    res.json({ success: true, message: 'Race category deleted.' });
  } catch (err) {
    console.error('Delete Race Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete race category.' });
  }
};
