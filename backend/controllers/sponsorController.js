const { Sponsor } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ is_active: true }).sort({ created_at: -1 }).lean();
    res.json({ success: true, sponsors });
  } catch (err) {
    console.error('Get Sponsors Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve sponsors.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, tier, logo_url, website_url } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Sponsor name is required.' });
    }

    const newSponsor = await Sponsor.create({
      name,
      tier: tier || 'Silver',
      logo_url: logo_url || '',
      website_url: website_url || '',
      is_active: true
    });

    res.status(201).json({ success: true, message: 'Sponsor added.', sponsor: newSponsor });
  } catch (err) {
    console.error('Create Sponsor Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create sponsor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tier, logo_url, website_url, is_active } = req.body;

    const updated = await Sponsor.findByIdAndUpdate(
      id,
      { name, tier, logo_url, website_url, is_active },
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
