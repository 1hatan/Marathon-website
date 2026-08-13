const { Sponsor } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';
    const filter = isAdmin ? {} : { status: 'active' };

    const sponsors = await Sponsor.find(filter).sort({ created_at: -1 }).lean();
    res.json({ success: true, sponsors });
  } catch (err) {
    console.error('Get Sponsors Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve sponsors.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, tier, logo, website, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Sponsor name is required.' });
    }

    const newSponsor = await Sponsor.create({
      name,
      tier: tier || 'Silver Sponsor',
      logo: logo || '',
      website: website || '',
      status: status || 'active'
    });

    res.status(201).json({ success: true, message: 'Sponsor added.', sponsor: newSponsor, id: newSponsor._id.toString() });
  } catch (err) {
    console.error('Create Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create sponsor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tier, logo, website, status } = req.body;

    const updated = await Sponsor.findByIdAndUpdate(
      id,
      { name, tier, logo, website, status: status || 'active' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }

    res.json({ success: true, message: 'Sponsor updated.', sponsor: updated });
  } catch (err) {
    console.error('Update Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update sponsor.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sponsor.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Sponsor not found.' });
    }
    res.json({ success: true, message: 'Sponsor deleted.' });
  } catch (err) {
    console.error('Delete Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete sponsor.' });
  }
};
