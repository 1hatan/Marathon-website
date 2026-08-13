import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white font-sans border-t border-slate-900">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center group">
              <span className="text-2xl font-black tracking-tight text-white uppercase font-outfit">
                INFINITY<span className="text-rock-yellow">RUN</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium max-w-sm">
              Every Step Creates a Better Tomorrow. Join thousands of runners making a positive impact in the ultimate annual community marathon event.
            </p>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-rock-yellow mb-4 font-outfit">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-300">
              <li><Link to="/" className="hover:text-rock-yellow transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-rock-yellow transition-colors">About & Event Info</Link></li>
              <li><Link to="/prizes" className="hover:text-rock-yellow transition-colors">Prizes & Awards</Link></li>
              <li><Link to="/gallery" className="hover:text-rock-yellow transition-colors">Photo Gallery</Link></li>
              <li><Link to="/faq" className="hover:text-rock-yellow transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-rock-yellow transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: RACE CATEGORIES */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-rock-yellow mb-4 font-outfit">
              RACE CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li><span className="font-bold text-white">21K Half Marathon</span> — Timed Chip</li>
              <li><span className="font-bold text-white">10K Challenge</span> — Competitive</li>
              <li><span className="font-bold text-white">5K Run</span> — Fitness Run</li>
              <li><span className="font-bold text-white">3K Fun Run</span> — Open for All</li>
            </ul>
          </div>

          {/* Column 4: CONTACT SUPPORT */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-rock-yellow mb-4 font-outfit">
              CONTACT SUPPORT
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rock-yellow shrink-0 mt-0.5" />
                <span>Salem Sports Complex & Mahatma Gandhi Stadium, Salem, Tamil Nadu</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rock-yellow shrink-0" />
                <a href="mailto:saleminfo@infinityrun.org" className="hover:text-white transition-colors">saleminfo@infinityrun.org</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rock-yellow shrink-0" />
                <a href="tel:+919840012700" className="hover:text-white transition-colors">+91 98400 12700</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/90 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Infinity Run. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
