import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchContactMessages, updateContactStatus, deleteContactMessage } from '../../services/api';
import { Mail, Trash2, CheckCircle, Eye, X } from 'lucide-react';

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const res = await fetchContactMessages();
      if (res.success) setMessages(res.messages);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateContactStatus(id, status);
      if (res.success) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await deleteContactMessage(id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  return (
    <AdminLayout title="Contact Message Center">
      <div className="space-y-6">
        
        <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs font-black text-black uppercase tracking-wider bg-gray-50 font-outfit">
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Message Preview</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 font-extrabold font-outfit uppercase">Loading messages...</td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 font-extrabold font-outfit uppercase">No contact messages received yet.</td>
                  </tr>
                ) : (
                  messages.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black font-outfit">{m.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{m.email} {m.phone ? `| ${m.phone}` : ''}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-black font-outfit">{m.subject}</td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium truncate max-w-xs">{m.message}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit bg-black text-white">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 font-medium">{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveMessage(m);
                            if (m.status === 'Unread') handleStatusChange(m.id, 'Read');
                          }}
                          className="p-2 rounded-xl bg-gray-100 text-black hover:bg-rock-cyan hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(m.id, 'Replied')}
                          className="p-2 rounded-xl bg-rock-yellow/20 text-black hover:bg-rock-yellow transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                        >
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

        {/* View Message Modal */}
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative border-2 border-gray-100 shadow-2xl">
              <button onClick={() => setActiveMessage(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-black text-black uppercase font-outfit border-b-2 border-rock-yellow pb-2">{activeMessage.subject}</h3>
              <div className="text-xs text-gray-500 border-b border-gray-100 pb-3 font-medium">
                From: <strong className="text-black font-extrabold">{activeMessage.name}</strong> ({activeMessage.email}) on {new Date(activeMessage.created_at).toLocaleString()}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{activeMessage.message}</p>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

