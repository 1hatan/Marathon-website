import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchGallery, createGallery, updateGallery, deleteGallery } from '../../services/api';
import { Plus, Trash2, X, Edit, Eye, EyeOff } from 'lucide-react';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);

  const [form, setForm] = useState({
    image_url: '',
    title: '',
    status: 'active'
  });

  useEffect(() => {
    loadGalleryData();
  }, []);

  async function loadGalleryData() {
    try {
      const res = await fetchGallery(true);
      if (res.success) setPhotos(res.gallery);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingPhoto(null);
    setForm({ image_url: '', title: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setForm({
      image_url: photo.image_url,
      title: photo.title || '',
      status: photo.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      const res = await deleteGallery(id);
      if (res.success) setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete gallery error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPhoto) {
        await updateGallery(editingPhoto.id, form);
      } else {
        await createGallery(form);
      }
      setShowModal(false);
      loadGalleryData();
    } catch (err) {
      console.error('Save gallery photo error:', err);
    }
  };

  return (
    <AdminLayout title="Photo Gallery Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">Add, update, or hide photos in the public event gallery.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-rock-yellow hover:bg-rock-yellowHover text-black text-xs font-extrabold font-outfit uppercase px-5 py-3 rounded-full transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Photo
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-black flex flex-col justify-between transition-all group">
              <div className="h-44 w-full bg-black relative overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit bg-black text-white">
                  {item.status}
                </span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <h4 className="font-black text-black font-outfit uppercase text-sm truncate max-w-[200px]">{item.title || 'Untitled'}</h4>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEditModal(item)} className="p-2 bg-rock-yellow/20 text-black rounded-xl hover:bg-rock-yellow transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
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
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">{editingPhoto ? 'Edit Photo' : 'Add Photo'}</h3>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Photo Title / Caption</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Marathon Flag Off Moment"
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
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 rounded-2xl shadow-md transition-all">
                Save Photo
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

