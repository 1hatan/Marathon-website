import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchRaces, createRace, updateRace, deleteRace } from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminRaces() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRace, setEditingRace] = useState(null);

  const [form, setForm] = useState({
    name: '',
    distance: '',
    description: '',
    age_limit: '',
    fee: '',
    status: 'active'
  });

  useEffect(() => {
    loadRaces();
  }, []);

  async function loadRaces() {
    try {
      const res = await fetchRaces();
      if (res.success) setRaces(res.races);
    } catch (err) {
      console.error('Failed to load races:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingRace(null);
    setForm({ name: '', distance: '', description: '', age_limit: '', fee: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (race) => {
    setEditingRace(race);
    setForm({
      name: race.name,
      distance: race.distance,
      description: race.description || '',
      age_limit: race.age_limit || '',
      fee: race.fee,
      status: race.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this race category?')) return;
    try {
      const res = await deleteRace(id);
      if (res.success) {
        setRaces((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRace) {
        await updateRace(editingRace.id, form);
      } else {
        await createRace(form);
      }
      setShowModal(false);
      loadRaces();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <AdminLayout title="Race Category Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">Manage race distances, registration fees, and age limits.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-rock-yellow hover:bg-rock-yellowHover text-black text-xs font-extrabold font-outfit uppercase px-5 py-3 rounded-full transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Race Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {races.map((race) => (
            <div key={race.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 hover:border-black flex flex-col justify-between space-y-4 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-black text-white font-black text-xs font-outfit uppercase">{race.distance}</span>
                  <span className="text-xl font-black text-black font-outfit">₹{parseFloat(race.fee).toFixed(0)}</span>
                </div>
                <h3 className="text-lg font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">{race.name}</h3>
                <p className="text-xs text-gray-500 font-extrabold font-outfit uppercase">Age Limit: {race.age_limit || 'Open to all'}</p>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{race.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="px-3 py-0.5 rounded-full font-black text-[10px] uppercase font-outfit bg-black text-white">
                  {race.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEditModal(race)} className="p-2 bg-rock-yellow/20 text-black rounded-xl hover:bg-rock-yellow transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(race.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
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
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">{editingRace ? 'Edit Race Category' : 'Add Race Category'}</h3>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. 21K Half Marathon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Distance Badge</label>
                <input
                  type="text"
                  value={form.distance}
                  onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  required
                  placeholder="e.g. 21K"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Registration Fee (₹)</label>
                <input
                  type="number"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  required
                  placeholder="e.g. 1199"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Age Limit</label>
                <input
                  type="text"
                  value={form.age_limit}
                  onChange={(e) => setForm({ ...form, age_limit: e.target.value })}
                  placeholder="e.g. Min. 18 years old"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Short Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <button type="submit" className="w-full bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 rounded-2xl shadow-md transition-all">
                Save Race Category
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

