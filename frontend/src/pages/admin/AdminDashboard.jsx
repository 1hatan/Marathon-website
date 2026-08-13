import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import { fetchDashboardStats } from '../../services/api';
import { 
  Users, Calendar, CheckCircle2, Clock, DollarSign, MessageSquare, 
  ArrowUpRight, RefreshCw, AlertCircle, Loader2, UserCheck, Trophy, 
  Shirt, Mail, Phone 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchDashboardStats();
      if (res && res.success) {
        setData(res);
      } else {
        setError(res?.message || 'Failed to fetch dashboard data from server.');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      const apiErrorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || (err.code === 'ERR_NETWORK' ? 'Network Error: Unable to connect to backend server API.' : err.message);
      setError(apiErrorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const COLORS = ['#00A3FF', '#F5CD19', '#111827', '#10B981', '#8B5CF6', '#EC4899'];

  const summary = data?.summary || {
    total_registrations: 0,
    total_participants: 0,
    today_registrations: 0,
    confirmed_registrations: 0,
    pending_registrations: 0,
    total_revenue: 0,
    total_messages: 0,
    male_participants: 0,
    female_participants: 0,
    other_participants: 0,
    reg_3k: 0,
    reg_5k: 0,
    reg_10k: 0,
    reg_21k: 0,
    reg_42k: 0
  };

  const categoryStats = data?.categoryStats || [];
  const genderStats = data?.genderStats || [];
  const tshirtStats = data?.tshirtStats || [];
  const recentRegistrations = data?.recentRegistrations || [];
  const recentMessages = data?.recentMessages || [];

  const isAuthError = error && (error.toLowerCase().includes('token') || error.toLowerCase().includes('denied') || error.toLowerCase().includes('unauthorized') || error.toLowerCase().includes('login'));

  return (
    <AdminLayout title="Executive Dashboard">
      <div className="space-y-8">
        
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-gray-100 p-5 rounded-3xl shadow-sm">
          <div>
            <h2 className="text-lg font-black text-black uppercase font-outfit tracking-tight">
              Real-Time Database Metrics
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Live statistics queried directly from MongoDB database collections.
            </p>
          </div>

          <button
            onClick={() => loadStats(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-full shadow-sm transition-all cursor-pointer font-outfit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Loading Spinner View */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-gray-100 space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-rock-cyan animate-spin mx-auto" />
            <p className="text-sm font-black uppercase tracking-wider font-outfit text-black">
              Fetching latest database statistics...
            </p>
          </div>
        )}

        {/* Detailed Error Alert View */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-red-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="text-base font-black uppercase font-outfit">API / Database Error Details</h3>
                <p className="text-xs text-red-600 font-medium">Exact error received from server request:</p>
              </div>
            </div>

            <div className="bg-white border border-red-200 p-3.5 rounded-2xl font-mono text-xs text-red-900 font-semibold break-all">
              {error}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => loadStats()}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase px-5 py-2.5 rounded-full transition-all cursor-pointer font-outfit"
              >
                Retry Connection
              </button>

              {isAuthError && (
                <Link
                  to="/admin/login"
                  className="bg-black hover:bg-gray-800 text-white font-black text-xs uppercase px-5 py-2.5 rounded-full transition-all font-outfit"
                >
                  Log In Again
                </Link>
              )}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ROW 1: PRIMARY KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard title="Total Registrations" value={summary.total_registrations} icon={Users} color="yellow" />
              <StatCard title="Total Participants" value={summary.total_participants} icon={UserCheck} color="cyan" />
              <StatCard title="Contact Messages" value={summary.total_messages} icon={MessageSquare} color="black" />
              <StatCard title="Male Participants" value={summary.male_participants} icon={UserCheck} color="cyan" />
              <StatCard title="Female Participants" value={summary.female_participants} icon={UserCheck} color="yellow" />
              <StatCard title="Total Revenue" value={`₹${summary.total_revenue.toLocaleString()}`} icon={DollarSign} color="black" />
            </div>

            {/* ROW 2: RACE CATEGORIES BREAKDOWN (3K, 5K, 10K, 21K, 42K) */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-black uppercase font-outfit tracking-wider border-l-4 border-rock-yellow pl-3">
                Marathon Category Registrations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 3KM */}
                <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-4 shadow-sm transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase font-outfit">
                    <span>3KM Run</span>
                    <span className="bg-rock-cyan/10 text-rock-cyan px-2 py-0.5 rounded-full text-[10px]">3K</span>
                  </div>
                  <div className="text-2xl font-black text-black font-outfit">{summary.reg_3k}</div>
                </div>

                {/* 5KM */}
                <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-4 shadow-sm transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase font-outfit">
                    <span>5KM Run</span>
                    <span className="bg-rock-yellow/20 text-black px-2 py-0.5 rounded-full text-[10px]">5K</span>
                  </div>
                  <div className="text-2xl font-black text-black font-outfit">{summary.reg_5k}</div>
                </div>

                {/* 10KM */}
                <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-4 shadow-sm transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase font-outfit">
                    <span>10KM Challenge</span>
                    <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px]">10K</span>
                  </div>
                  <div className="text-2xl font-black text-black font-outfit">{summary.reg_10k}</div>
                </div>

                {/* Half Marathon 21KM */}
                <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-4 shadow-sm transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase font-outfit">
                    <span>Half Marathon</span>
                    <span className="bg-rock-cyan/10 text-rock-cyan px-2 py-0.5 rounded-full text-[10px]">21K</span>
                  </div>
                  <div className="text-2xl font-black text-black font-outfit">{summary.reg_21k}</div>
                </div>

                {/* Full Marathon 42KM */}
                <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-4 shadow-sm transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase font-outfit">
                    <span>Full Marathon</span>
                    <span className="bg-rock-yellow/20 text-black px-2 py-0.5 rounded-full text-[10px]">42K</span>
                  </div>
                  <div className="text-2xl font-black text-black font-outfit">{summary.reg_42k}</div>
                </div>
              </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Race Category Registrations Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
                <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-rock-yellow pl-3">
                  Race-Wise Distribution
                </h3>
                <div className="h-64 w-full">
                  {categoryStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="category" tick={{ fill: '#000000', fontSize: 11, fontWeight: 700 }} />
                        <YAxis tick={{ fill: '#000000', fontSize: 11, fontWeight: 700 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="Participants" fill="#00A3FF" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase">
                      No registrations in database yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Gender Distribution Pie Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
                <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-rock-cyan pl-3">
                  Gender Breakdown
                </h3>
                <div className="h-64 w-full flex items-center justify-center">
                  {genderStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderStats}
                          dataKey="count"
                          nameKey="gender"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          label={({ gender, count }) => `${gender}: ${count}`}
                        >
                          {genderStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-xs font-bold text-gray-400 uppercase">
                      No gender statistics recorded.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* T-SHIRT SIZE DISTRIBUTION BAR & TABLE */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
              <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-black pl-3 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-black" />
                <span>T-Shirt Size Distribution</span>
              </h3>

              {tshirtStats.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {tshirtStats.map((item) => (
                    <div key={item.size} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                      <span className="text-xs font-black text-gray-500 uppercase block font-outfit">Size {item.size}</span>
                      <span className="text-xl font-black text-black font-outfit">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-gray-400 uppercase py-4">No T-Shirt orders recorded in database yet.</p>
              )}
            </div>

            {/* RECENT REGISTRATIONS TABLE */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-rock-yellow pl-3">
                  Recent Registrations
                </h3>
                <Link to="/admin/participants" className="text-xs font-black text-black font-outfit uppercase hover:text-rock-cyan flex items-center gap-1">
                  View All Participants <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100 text-xs font-black text-black uppercase tracking-wider bg-gray-50 font-outfit">
                      <th className="py-3.5 px-4">Reg ID</th>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Gender</th>
                      <th className="py-3.5 px-4">Age</th>
                      <th className="py-3.5 px-4">Category / Distance</th>
                      <th className="py-3.5 px-4">Size</th>
                      <th className="py-3.5 px-4">Reg Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {recentRegistrations.length > 0 ? (
                      recentRegistrations.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-black text-black">{p.registration_id}</td>
                          <td className="py-3.5 px-4 font-extrabold text-black font-outfit">{p.full_name}</td>
                          <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{p.email}</td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-black">{p.mobile || 'N/A'}</td>
                          <td className="py-3.5 px-4 text-xs font-bold text-black uppercase">{p.gender}</td>
                          <td className="py-3.5 px-4 text-xs font-bold text-black">{p.age ? `${p.age} yrs` : 'N/A'}</td>
                          <td className="py-3.5 px-4 font-extrabold text-black font-outfit">
                            {p.race_name || 'Race'} ({p.race_distance || 'N/A'})
                          </td>
                          <td className="py-3.5 px-4 font-black text-black font-outfit">{p.t_shirt_size || 'M'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-500 font-medium">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-xs font-bold text-gray-400 uppercase font-outfit">
                          No registrations found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT CONTACT MESSAGES SECTION */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-black uppercase font-outfit tracking-tight border-l-4 border-rock-cyan pl-3">
                  Recent Contact Messages
                </h3>
                <Link to="/admin/contact" className="text-xs font-black text-black font-outfit uppercase hover:text-rock-cyan flex items-center gap-1">
                  View All Messages <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100 text-xs font-black text-black uppercase tracking-wider bg-gray-50 font-outfit">
                      <th className="py-3.5 px-4">Sender Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-4">Message</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {recentMessages.length > 0 ? (
                      recentMessages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-extrabold text-black font-outfit">{msg.name}</td>
                          <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{msg.email}</td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-black">{msg.phone || 'N/A'}</td>
                          <td className="py-3.5 px-4 text-xs font-bold text-black font-outfit">{msg.subject || 'General'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-600 max-w-xs truncate">{msg.message}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit ${
                              msg.status === 'Unread' ? 'bg-amber-500/20 text-amber-700' : 'bg-black text-white'
                            }`}>
                              {msg.status || 'Unread'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-gray-500 font-medium">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-xs font-bold text-gray-400 uppercase font-outfit">
                          No contact messages received in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

      </div>
    </AdminLayout>
  );
}
