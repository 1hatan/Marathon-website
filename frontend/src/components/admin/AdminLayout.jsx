import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Shirt,
  MessageSquare,
  Award,
  Image as ImageIcon,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('infinity_admin_token');
    localStorage.removeItem('infinity_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Participants', path: '/admin/participants', icon: Users },
    { name: 'Race Categories', path: '/admin/races', icon: Trophy },
    { name: 'T-Shirt Sizes', path: '/admin/tshirts', icon: Shirt },
    { name: 'Contact Messages', path: '/admin/contact', icon: MessageSquare },
    { name: 'Sponsors', path: '/admin/sponsors', icon: Award },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
    { name: 'Event Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white shrink-0 shadow-2xl min-h-screen border-r border-gray-800">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white block font-outfit uppercase">
              INFINITY<span className="text-rock-yellow">RUN</span>
            </span>
            <span className="text-[10px] text-rock-cyan font-extrabold uppercase tracking-wider block font-outfit">Admin Control</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs uppercase font-outfit tracking-wide font-black transition-all ${
                  active
                    ? 'bg-rock-yellow text-black shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-2xl text-xs font-extrabold font-outfit uppercase text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Globe className="w-4 h-4 text-rock-yellow" />
            Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-2xl text-xs font-extrabold font-outfit uppercase text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden bg-black text-white p-4 flex items-center justify-between shadow-md border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg font-outfit uppercase">INFINITY<span className="text-rock-yellow">RUN</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-black text-white p-4 border-b border-white/10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase font-outfit ${
                  active ? 'bg-rock-yellow text-black' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-outfit uppercase text-gray-300"
            >
              <Globe className="w-4 h-4 text-rock-yellow" />
              Public Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-outfit uppercase text-red-400 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {title && (
          <div className="mb-6 pb-2 border-b-4 border-rock-yellow inline-block">
            <h1 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit tracking-tight">{title}</h1>
          </div>
        )}
        {children}
      </main>

    </div>
  );
}

