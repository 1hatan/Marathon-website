import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchSettings, updateSettings } from '../../services/api';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [form, setForm] = useState({
    event_name: 'Infinity Run',
    event_date: 'Sunday, November 15, 2026',
    venue: 'Salem Sports Complex & Mahatma Gandhi Stadium',
    location: 'Salem, Tamil Nadu',
    reporting_time: '05:00 AM',
    flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
    registration_deadline: 'November 10, 2026',
    contact_email: 'saleminfo@infinityrun.org',
    contact_phone: '+91 98765 43210'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchSettings();
        if (res.success && res.settings) {
          setForm(res.settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await updateSettings(form);
      if (res.success) {
        setSuccessMsg('Event settings updated successfully! Changes are live on the public website.');
      }
    } catch (err) {
      console.error('Update settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Event Settings & Configuration">
      <div className="max-w-3xl space-y-6">
        
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black uppercase font-outfit border-2 border-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-gray-100 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Event Name</label>
              <input
                type="text"
                name="event_name"
                value={form.event_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Event Date</label>
              <input
                type="text"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Registration Deadline</label>
              <input
                type="text"
                name="registration_deadline"
                value={form.registration_deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Venue Name</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">City Location Address</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Reporting Time</label>
              <input
                type="text"
                name="reporting_time"
                value={form.reporting_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Flag-off Schedule</label>
              <input
                type="text"
                name="flagoff_time"
                value={form.flagoff_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Support Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Support Phone Number</label>
              <input
                type="text"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black outline-none text-sm font-medium"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 px-8 rounded-full text-xs transition-all shadow-md"
            >
              <Save className="w-4 h-4 stroke-[3]" />
              {saving ? 'SAVING...' : 'SAVE EVENT SETTINGS'}
            </button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}

