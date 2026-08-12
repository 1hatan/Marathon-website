import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchFaqs, createFaq, updateFaq, deleteFaq } from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    status: 'active'
  });

  useEffect(() => {
    loadFaqsData();
  }, []);

  async function loadFaqsData() {
    try {
      const res = await fetchFaqs(true);
      if (res.success) setFaqs(res.faqs);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingFaq(null);
    setForm({ question: '', answer: '', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      status: faq.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ question?')) return;
    try {
      const res = await deleteFaq(id);
      if (res.success) setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Delete FAQ error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, form);
      } else {
        await createFaq(form);
      }
      setShowModal(false);
      loadFaqsData();
    } catch (err) {
      console.error('Save FAQ error:', err);
    }
  };

  return (
    <AdminLayout title="FAQ Management">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">Manage frequently asked questions displayed on the website.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-rock-yellow hover:bg-rock-yellowHover text-black text-xs font-extrabold font-outfit uppercase px-5 py-3 rounded-full transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add FAQ Item
          </button>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 hover:border-black space-y-3 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-black text-black uppercase font-outfit text-lg group-hover:text-rock-cyan transition-colors">{faq.question}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEditModal(faq)} className="p-2 bg-rock-yellow/20 text-black rounded-xl hover:bg-rock-yellow transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative border-2 border-gray-100 shadow-2xl">
              <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">{editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}</h3>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Question</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  required
                  placeholder="e.g. Who can participate in Infinity Run?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Answer</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                  rows="4"
                  placeholder="Provide clear, concise answer..."
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
                Save FAQ Item
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

