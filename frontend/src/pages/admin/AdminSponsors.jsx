import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchSponsors, createSponsor, updateSponsor, deleteSponsor } from '../../services/api';
import { Plus, Edit, Trash2, X, ExternalLink } from 'lucide-react';

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);

  const [form, setForm] = useState({
    name: '',
    logo: '',
    tier: 'Gold Sponsor',
    website: '',
    status: 'active'
  });

  useEffect(() => {
    loadSponsorsData();
  }, []);

  async function loadSponsorsData() {
    try {
      const res = await fetchSponsors(true);
      if (res.success) setSponsors(res.sponsors);
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingSponsor(null);
    setForm({ name: '', logo: '', tier: 'Gold Sponsor', website: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setForm({
      name: sponsor.name,
      logo: sponsor.logo,
      tier: sponsor.tier,
      website: sponsor.website || '',
      status: sponsor.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sponsor?')) return;
    try {
      const res = await deleteSponsor(id);
      if (res.success) setSponsors((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete sponsor error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSponsor) {
        await updateSponsor(editingSponsor.id, form);
      } else {
        await createSponsor(form);
      }
      setShowModal(false);
      loadSponsorsData();
    } catch (err) {
      console.error('Save sponsor error:', err);
    }
  };

  return (
    <AdminLayout title="Sponsor Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">Add, update, or remove event sponsors and tier classifications.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-rock-yellow hover:bg-rock-yellowHover text-black text-xs font-extrabold font-outfit uppercase px-5 py-3 rounded-full transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Sponsor
          </button>
        </div>

        {/* Sponsor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-gray-100 hover:border-black flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-3">
                <div className="h-20 w-full flex items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase font-outfit text-rock-cyan block">{s.tier}</span>
                  <h4 className="font-black text-black font-outfit uppercase text-base">{s.name}</h4>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="px-3 py-0.5 rounded-full font-black text-[10px] uppercase font-outfit bg-black text-white">
                  {s.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEditModal(s)} className="p-2 bg-rock-yellow/20 text-black rounded-xl hover:bg-rock-yellow transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 relative border-2 border-gray-100 shadow-2xl">
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">{editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}</h3>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Sponsor Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Apex Athletics"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Logo Image URL</label>
                <input
                  type="url"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Sponsor Tier</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl font-bold font-outfit bg-white"
                >
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Gold Sponsor">Gold Sponsor</option>
                  <option value="Silver Sponsor">Silver Sponsor</option>
                  <option value="Supporting Partner">Supporting Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://sponsorwebsite.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl font-bold font-outfit bg-white"
                >
                  <option value="active">Active (Visible on Website)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 rounded-2xl shadow-md transition-all">
                Save Sponsor
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

