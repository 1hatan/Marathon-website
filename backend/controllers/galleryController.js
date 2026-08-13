const { GalleryItem } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true' || req.query.admin === '1';
    const filter = isAdmin ? {} : { status: 'active' };

    const items = await GalleryItem.find(filter).sort({ created_at: -1 }).lean();
    res.json({ success: true, gallery: items });
  } catch (err) {
    console.error('Get Gallery Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery items.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, image_url, category, status } = req.body;
    if (!image_url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const newItem = await GalleryItem.create({
      title: title || '',
      image_url,
      category: category || 'General',
      status: status || 'active'
    });

    res.status(201).json({ success: true, message: 'Gallery item added.', galleryItem: newItem, id: newItem._id.toString() });
  } catch (err) {
    console.error('Create Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add gallery item.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, category, status } = req.body;

    const updated = await GalleryItem.findByIdAndUpdate(
      id,
      { title, image_url, category, status: status || 'active' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }

    res.json({ success: true, message: 'Gallery item updated.', galleryItem: updated });
  } catch (err) {
    console.error('Update Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery item.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    }
    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) {
    console.error('Delete Gallery Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gallery item.' });
  }
};
