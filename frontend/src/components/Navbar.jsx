import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (e, link) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      if (link.path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const sectionId = link.path.replace('/', '');
        const elem = document.getElementById(sectionId);
        if (elem) {
          e.preventDefault();
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full bg-white text-black font-sans z-50 sticky top-0 shadow-sm border-b border-gray-100">
      
      {/* MAIN HEADER NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col group shrink-0">
          <span className="text-2xl sm:text-3xl font-black tracking-tighter text-black leading-tight font-outfit uppercase">
            Infinity <span className="text-rock-cyan">Run</span>
          </span>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider font-sans uppercase -mt-1">
            Running Series
          </span>
        </Link>

        {/* Desktop Navigation Links in a STRAIGHT HORIZONTAL LINE */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-black uppercase tracking-wider text-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className={`py-1.5 transition-colors relative ${
                isActive(link.path)
                  ? 'text-black border-b-2 border-rock-yellow font-black'
                  : 'hover:text-rock-cyan'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Far Right Action Buttons: REGISTER NOW button */}
        <div className="hidden sm:flex items-center space-x-4 text-xs font-bold shrink-0">
          {/* REGISTER NOW CTA Button */}
          <Link
            to="/register"
            className="inline-flex items-center gap-1 bg-rock-yellow hover:bg-rock-yellowHover text-black px-4 py-1.5 rounded-full font-black tracking-wide shadow-sm hover:shadow-md transition-all text-xs"
          >
            <span>REGISTER NOW</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/register"
            className="bg-rock-yellow text-black px-3 py-1 rounded-full text-xs font-black"
          >
            REGISTER NOW
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-black hover:bg-gray-100 rounded-md focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3 animate-fadeIn shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-bold text-gray-800 uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`py-2 border-b border-gray-100 transition-colors ${
                  isActive(link.path) ? 'text-rock-cyan font-black' : 'hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end border-t border-gray-100">
            <Link
              to="/register"
              className="bg-rock-yellow text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-sm"
            >
              Register Now →
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
