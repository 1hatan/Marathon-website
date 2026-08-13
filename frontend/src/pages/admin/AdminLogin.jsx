import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminLogin(email, password);
      if (res.success && res.token) {
        localStorage.setItem('infinity_admin_token', res.token);
        localStorage.setItem('infinity_admin_user', JSON.stringify(res.admin));
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-black tracking-tight font-outfit uppercase">INFINITY<span className="text-rock-yellow">RUN</span></h1>
          <p className="text-xs font-black text-rock-cyan uppercase tracking-widest font-outfit">Admin Control Portal</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase font-outfit text-black mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black text-sm font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold font-outfit uppercase py-3.5 rounded-2xl text-sm shadow-md transition-all"
          >
            {loading ? 'AUTHENTICATING...' : 'LOG IN TO ADMIN PANEL'}
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </div>
  );
}

