const { ContactMessage } = require('../db');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      status: 'Unread'
    });

    console.log(`[MongoDB] New contact message saved from: ${name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      contact: newMessage
    });
  } catch (err) {
    console.error('Submit Contact Message Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ created_at: -1 }).lean();
    const enriched = messages.map(m => ({ ...m, id: m._id.toString() }));
    res.json({ success: true, messages: enriched });
  } catch (err) {
    console.error('Get Contact Messages Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status: status || 'Read' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message status updated.', contact: updated });
  } catch (err) {
    console.error('Update Contact Status Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update message status.', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Delete Contact Error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete message.', error: err.message });
  }
};
