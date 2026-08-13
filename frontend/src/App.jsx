import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IntroLoader from './components/IntroLoader';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PrizesPage from './pages/PrizesPage';
import SponsorsPage from './pages/SponsorsPage';
import GalleryPage from './pages/GalleryPage';
import FAQPage from './pages/FAQPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminRaces from './pages/admin/AdminRaces';
import AdminTShirtSizes from './pages/admin/AdminTShirtSizes';
import AdminContact from './pages/admin/AdminContact';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminGallery from './pages/admin/AdminGallery';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Wrapper for Admin Pages
function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('infinity_admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Plays automatically on every fresh page load and browser refresh/reload
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-offwhite text-charcoal-900">
      
      {/* Intro loader overlay - covers viewport on initial load until finished */}
      {showIntro && (
        <IntroLoader onComplete={() => setShowIntro(false)} />
      )}

      {/* Show Navbar & Footer only on Public Pages */}
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/prizes" element={<PrizesPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/participants" element={<ProtectedAdminRoute><AdminParticipants /></ProtectedAdminRoute>} />
          <Route path="/admin/races" element={<ProtectedAdminRoute><AdminRaces /></ProtectedAdminRoute>} />
          <Route path="/admin/tshirts" element={<ProtectedAdminRoute><AdminTShirtSizes /></ProtectedAdminRoute>} />
          <Route path="/admin/contact" element={<ProtectedAdminRoute><AdminContact /></ProtectedAdminRoute>} />
          <Route path="/admin/sponsors" element={<ProtectedAdminRoute><AdminSponsors /></ProtectedAdminRoute>} />
          <Route path="/admin/gallery" element={<ProtectedAdminRoute><AdminGallery /></ProtectedAdminRoute>} />
          <Route path="/admin/faq" element={<ProtectedAdminRoute><AdminFAQ /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}

    </div>
  );
}
