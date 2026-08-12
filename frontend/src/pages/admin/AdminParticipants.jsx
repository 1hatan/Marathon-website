import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchParticipants, updateParticipant, deleteParticipant, fetchRaces } from '../../services/api';
import { Search, Download, Trash2, Edit, Eye, X, Filter } from 'lucide-react';

export default function AdminParticipants() {
  const [participants, setParticipants] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [size, setSize] = useState('');

  // Modals
  const [viewParticipant, setViewParticipant] = useState(null);
  const [editParticipant, setEditParticipant] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, rRes] = await Promise.all([
          fetchParticipants({ search, category_id: categoryId, status, t_shirt_size: size }),
          fetchRaces()
        ]);
        if (pRes.success) setParticipants(pRes.participants);
        if (rRes.success) setRaces(rRes.races);
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, categoryId, status, size]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this participant record?')) return;
    try {
      const res = await deleteParticipant(id);
      if (res.success) {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateParticipant(editParticipant.id, editParticipant);
      if (res.success) {
        setParticipants((prev) => prev.map((p) => (p.id === editParticipant.id ? { ...p, ...editParticipant } : p)));
        setEditParticipant(null);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (participants.length === 0) return;
    const headers = [
      'Registration ID', 'Full Name', 'Email', 'Mobile', 'DOB', 'Gender', 'Blood Group',
      'Race Category', 'T-Shirt Size', 'Emergency Name', 'Emergency Mobile', 'Emergency Relation',
      'Medical Info', 'Registration Status', 'Payment Status', 'Created At'
    ];

    const csvRows = [
      headers.join(','),
      ...participants.map((p) => [
        `"${p.registration_id}"`,
        `"${p.full_name}"`,
        `"${p.email}"`,
        `"${p.mobile}"`,
        `"${p.dob}"`,
        `"${p.gender}"`,
        `"${p.blood_group}"`,
        `"${p.race_name}"`,
        `"${p.t_shirt_size}"`,
        `"${p.emergency_name}"`,
        `"${p.emergency_mobile}"`,
        `"${p.emergency_relation}"`,
        `"${(p.medical_info || '').replace(/"/g, '""')}"`,
        `"${p.registration_status}"`,
        `"${p.payment_status}"`,
        `"${p.created_at}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `infinity_run_participants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Participant Management">
      <div className="space-y-6">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search Name, Email, Reg ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none font-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs font-extrabold font-outfit uppercase text-black bg-white"
            >
              <option value="">All Categories</option>
              {races.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs font-extrabold font-outfit uppercase text-black bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs font-extrabold font-outfit uppercase text-black bg-white"
            >
              <option value="">All Sizes</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black hover:bg-rock-yellow hover:text-black text-white text-xs font-black font-outfit uppercase transition-all shadow-sm shrink-0"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Export CSV
            </button>
          </div>

        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs font-black text-black uppercase tracking-wider bg-gray-50 font-outfit">
                  <th className="py-3.5 px-4">Reg ID</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Race</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Emergency Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500 font-extrabold font-outfit uppercase">Loading records...</td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500 font-extrabold font-outfit uppercase">No participants found matching criteria.</td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-black">{p.registration_id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black font-outfit">{p.full_name}</div>
                        <div className="text-xs text-gray-500 font-medium">{p.email} | {p.mobile}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-black font-outfit">{p.race_name}</td>
                      <td className="py-3.5 px-4 font-black text-black font-outfit">{p.t_shirt_size}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">{p.emergency_name} ({p.emergency_mobile})</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit bg-black text-white">
                          {p.registration_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button onClick={() => setViewParticipant(p)} className="p-2 rounded-xl bg-gray-100 text-black hover:bg-rock-cyan hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditParticipant(p)} className="p-2 rounded-xl bg-rock-yellow/20 text-black hover:bg-rock-yellow transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Modal */}
        {viewParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative border-2 border-gray-100 shadow-2xl">
              <button onClick={() => setViewParticipant(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">Participant Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Reg ID:</strong> {viewParticipant.registration_id}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Name:</strong> {viewParticipant.full_name}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Email:</strong> {viewParticipant.email}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Mobile:</strong> {viewParticipant.mobile}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">DOB:</strong> {viewParticipant.dob}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Gender:</strong> {viewParticipant.gender}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Blood Group:</strong> {viewParticipant.blood_group}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Race Category:</strong> {viewParticipant.race_name}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">T-Shirt Size:</strong> {viewParticipant.t_shirt_size}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Emergency Contact:</strong> {viewParticipant.emergency_name} ({viewParticipant.emergency_mobile} - {viewParticipant.emergency_relation})</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Medical Info:</strong> {viewParticipant.medical_info || 'None'}</p>
                <p><strong className="font-extrabold uppercase text-xs font-outfit">Status:</strong> {viewParticipant.registration_status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <form onSubmit={handleUpdateSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 relative border-2 border-gray-100 shadow-2xl">
              <button type="button" onClick={() => setEditParticipant(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">Edit Participant Status</h3>
              
              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Registration Status</label>
                <select
                  value={editParticipant.registration_status}
                  onChange={(e) => setEditParticipant({ ...editParticipant, registration_status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl font-bold font-outfit"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">T-Shirt Size</label>
                <select
                  value={editParticipant.t_shirt_size}
                  onChange={(e) => setEditParticipant({ ...editParticipant, t_shirt_size: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl font-bold font-outfit"
                >
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 rounded-2xl shadow-md transition-all">
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

