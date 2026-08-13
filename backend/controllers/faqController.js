const { Faq } = require('../db');

exports.getAll = async (req, res) => {
  try {
    const faqs = await Faq.find({ is_active: true }).sort({ sort_order: 1, created_at: -1 }).lean();
    res.json({ success: true, faqs });
  } catch (err) {
    console.error('Get FAQs Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve FAQs.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { question, answer, category, sort_order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const newFaq = await Faq.create({
      question,
      answer,
      category: category || 'General',
      sort_order: Number(sort_order) || 0,
      is_active: true
    });

    res.status(201).json({ success: true, message: 'FAQ created.', faq: newFaq });
  } catch (err) {
    console.error('Create FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to create FAQ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, sort_order, is_active } = req.body;

    const updated = await Faq.findByIdAndUpdate(
      id,
      { question, answer, category, sort_order, is_active },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }

    res.json({ success: true, message: 'FAQ updated.', faq: updated });
  } catch (err) {
    console.error('Update FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update FAQ.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Faq.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
    res.json({ success: true, message: 'FAQ deleted.' });
  } catch (err) {
    console.error('Delete FAQ Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete FAQ.' });
  }
};
