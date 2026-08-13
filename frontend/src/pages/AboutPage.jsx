import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Flag,
  Shirt,
  Medal,
  FileCheck,
  Coffee,
  Droplet,
  ChevronRight,
  ArrowUpRight,
  Trophy
} from 'lucide-react';
import { fetchSettings, fetchRaces } from '../services/api';

export default function AboutPage() {
  const [settings, setSettings] = useState({
    event_date: 'Sunday, November 15, 2026',
    venue: 'Salem Sports Complex',
    location: 'Salem, Tamil Nadu',
    reporting_time: '05:00 AM',
    flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)',
    registration_deadline: 'November 10, 2026'
  });
  const [races, setRaces] = useState([
    { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages' },
    { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old' },
    { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old' },
    { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old' }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, racesRes] = await Promise.all([fetchSettings(), fetchRaces()]);
        if (settingsRes && settingsRes.success && settingsRes.settings) {
          setSettings(settingsRes.settings);
        }
        if (racesRes && racesRes.success && racesRes.races && racesRes.races.length > 0) {
          setRaces(racesRes.races);
        }
      } catch (err) {
        console.error('Failed to load about data:', err);
      }
    }
    loadData();
  }, []);

  const benefits = [
    { name: 'Official T-Shirt', desc: 'Premium dry-fit event running tee', icon: Shirt, badgeColor: 'bg-rock-yellow text-black' },
    { name: 'Personalized Bib', desc: 'Timing chip bib for timed races', icon: Flag, badgeColor: 'bg-rock-cyan text-white' },
    { name: 'Finisher Medal', desc: 'Custom engineered commemorative medal', icon: Medal, badgeColor: 'bg-black text-white' },
    { name: 'E-Certificate', desc: 'Digital downloadable timing certificate', icon: FileCheck, badgeColor: 'bg-rock-yellow text-black' },
    { name: 'Hot Refreshments', desc: 'Nutritious breakfast after race completion', icon: Coffee, badgeColor: 'bg-rock-cyan text-white' },
    { name: 'Hydration Stations', desc: 'Water and electrolyte points every 2.5K', icon: Droplet, badgeColor: 'bg-black text-white' },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            About & Event Information
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Infinity <span className="text-rock-yellow">Run 2026</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Everything you need to know about the premier annual community marathon event.
          </p>
        </div>

        {/* 1. About Infinity Run Card */}
        <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 sm:p-10 shadow-sm transition-all space-y-4">
          <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase font-outfit rounded-full">
            Event Motto
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit">
            About Infinity Run
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium">
            Infinity Run is an annual flagship marathon organized to promote health, wellness, and community solidarity. Driven by the motto <strong className="text-black font-extrabold font-outfit">“Every Step Creates a Better Tomorrow,”</strong> the event brings together beginner runners, fitness enthusiasts, and elite athletes on a clean, safe, and beautifully mapped city course in Salem, Tamil Nadu.
          </p>
        </div>

        {/* 2. Event Key Details Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-yellow pl-4">
            Event Key Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Sky Blue Card */}
            <div className="bg-rock-cyan text-white rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/80 block mb-1">Event Date</span>
                <p className="font-extrabold text-white text-lg font-outfit">{settings.event_date}</p>
              </div>
            </div>

            {/* Sunflower Yellow Card */}
            <div className="bg-rock-yellow text-black border border-amber-300 rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">Location & Venue</span>
                <p className="font-extrabold text-black text-lg font-outfit">{settings.venue}</p>
                <p className="text-xs text-black/80 font-bold mt-0.5">{settings.location}</p>
              </div>
            </div>

            {/* Bold Black Card */}
            <div className="bg-black text-white rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rock-yellow text-black flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Reporting Time</span>
                <p className="font-extrabold text-rock-yellow text-lg font-outfit">{settings.reporting_time}</p>
                <p className="text-xs text-gray-300 font-semibold mt-0.5">Flag-off: {settings.flagoff_time}</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Race Categories Section */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-yellow pl-4">
            Race Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {races.map((race) => (
              <div 
                key={race.id} 
                className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-black uppercase font-outfit">
                      {race.distance}
                    </span>
                    <span className="text-xl font-black text-black font-outfit">
                      ₹{race.fee}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">
                    {race.name}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {race.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs font-bold text-gray-500">
                  <span>Age Limit:</span>
                  <span className="text-black font-extrabold">{race.age_limit || 'Open to all'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Runner Entitlements & Benefits Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-cyan pl-4">
            Runner Entitlements & Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div key={idx} className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-rock-yellow group-hover:text-black transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit ${b.badgeColor}`}>
                      Included
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

