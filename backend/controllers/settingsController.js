const { EventSetting } = require('../db');

exports.getSettings = async (req, res) => {
  try {
    let settings = await EventSetting.findOne().lean();
    if (!settings) {
      settings = {
        event_name: 'Infinity Run 2026',
        event_date: 'Sunday, November 15, 2026',
        venue: 'Salem Sports Complex',
        location: 'Salem, Tamil Nadu',
        registration_open: true
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
    const { event_name, event_date, venue, location, registration_open } = req.body;

    let settings = await EventSetting.findOne();
    if (!settings) {
      settings = new EventSetting({
        event_name: event_name || 'Infinity Run 2026',
        event_date: event_date || 'Sunday, November 15, 2026',
        venue: venue || 'Salem Sports Complex',
        location: location || 'Salem, Tamil Nadu',
        registration_open: registration_open !== undefined ? registration_open : true
      });
    } else {
      if (event_name) settings.event_name = event_name;
      if (event_date) settings.event_date = event_date;
      if (venue) settings.venue = venue;
      if (location) settings.location = location;
      if (registration_open !== undefined) settings.registration_open = registration_open;
      settings.updated_at = Date.now();
    }

    await settings.save();
    res.json({ success: true, message: 'Settings updated successfully.', settings });
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update event settings.' });
  }
};
