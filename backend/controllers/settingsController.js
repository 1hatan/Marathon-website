const { EventSetting } = require('../db');

exports.getSettings = async (req, res) => {
  try {
    let settings = await EventSetting.findOne().lean();
    if (!settings) {
      settings = {
        event_name: 'Infinity Run',
        event_date: 'Sunday, November 15, 2026',
        venue: 'Salem Sports Complex & Mahatma Gandhi Stadium',
        location: 'Salem, Tamil Nadu',
        reporting_time: '05:00 AM',
        flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
        registration_deadline: 'November 10, 2026',
        contact_email: 'saleminfo@infinityrun.org',
        contact_phone: '+91 98765 43210'
      };
    }
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Get Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve event settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { event_name, event_date, venue, location, reporting_time, flagoff_time, registration_deadline, contact_email, contact_phone } = req.body;

    let settings = await EventSetting.findOne();
    if (!settings) {
      settings = new EventSetting({
        event_name: event_name || 'Infinity Run',
        event_date: event_date || 'Sunday, November 15, 2026',
        venue: venue || 'Salem Sports Complex & Mahatma Gandhi Stadium',
        location: location || 'Salem, Tamil Nadu',
        reporting_time: reporting_time || '05:00 AM',
        flagoff_time: flagoff_time || '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
        registration_deadline: registration_deadline || 'November 10, 2026',
        contact_email: contact_email || 'saleminfo@infinityrun.org',
        contact_phone: contact_phone || '+91 98765 43210'
      });
    } else {
      if (event_name) settings.event_name = event_name;
      if (event_date) settings.event_date = event_date;
      if (venue) settings.venue = venue;
      if (location) settings.location = location;
      if (reporting_time) settings.reporting_time = reporting_time;
      if (flagoff_time) settings.flagoff_time = flagoff_time;
      if (registration_deadline) settings.registration_deadline = registration_deadline;
      if (contact_email) settings.contact_email = contact_email;
      if (contact_phone) settings.contact_phone = contact_phone;
      settings.updated_at = Date.now();
    }

    await settings.save();
    res.json({ success: true, message: 'Settings updated successfully.', settings });
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update event settings.' });
  }
};
