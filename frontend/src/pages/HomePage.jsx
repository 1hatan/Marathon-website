import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Flag,
  Shirt,
  Medal,
  Award
} from 'lucide-react';
import { fetchSettings, fetchRaces } from '../services/api';

export default function HomePage() {
  const [settings, setSettings] = useState({
    event_date: 'Sunday, November 15, 2026',
    venue: 'Salem Sports Complex',
    location: 'Salem, Tamil Nadu',
    reporting_time: '05:00 AM',
    flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)'
  });

  const [races, setRaces] = useState([
    { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages' },
    { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old' },
    { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old' },
    { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old' }
  ]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [settingsRes, racesRes] = await Promise.all([
          fetchSettings(),
          fetchRaces()
        ]);

        if (settingsRes && settingsRes.success && settingsRes.settings) {
          setSettings((prev) => ({ ...prev, ...settingsRes.settings }));
        }
        if (racesRes && racesRes.success && Array.isArray(racesRes.races) && racesRes.races.length > 0) {
          setRaces(racesRes.races);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16 space-y-12 sm:space-y-16">

      {/* 1. HERO SECTION — FULL-WIDTH HERO CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white min-h-[70vh] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center group bg-gray-900 text-white">
          <img
            src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1600&auto=format&fit=crop&q=80"
            alt="Infinity Run Marathon Hero"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-rock-yellow font-outfit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rock-yellow animate-pulse" />
              <span>INFINITY RUN 2026 • SALEM, TAMIL NADU</span>
            </div>

            {/* Prominent HALF MARATHON 5K Headline */}
            <div className="space-y-2 font-outfit">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  HALF
                </span>
                <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-rock-yellow drop-shadow-md">
                  MARATHON
                </span>
                <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  5K
                </span>
              </div>
              <p className="text-sm sm:text-xl font-black tracking-widest text-gray-200 uppercase font-sans pt-2">
                3K • 5K • 10K • 21K RUNNING SERIES
              </p>
            </div>

            <p className="text-xs sm:text-base font-medium text-gray-300 max-w-2xl leading-relaxed">
              Every Step Creates a Better Tomorrow. Join thousands of runners in Salem's premier marathon event with chip timing, scenic routes & vibrant community spirit.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-rock-yellow hover:bg-rock-yellowHover text-black font-black px-8 py-4 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                <span>REGISTER NOW</span>
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-black px-6 py-4 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider transition-all"
              >
                <span>EXPLORE ABOUT</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RACE CATEGORIES HOME SUMMARY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-rock-cyan uppercase block mb-1 font-outfit">Race Categories</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase font-outfit tracking-tight">
              Choose Your <span className="text-rock-yellow">Challenge</span>
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase font-outfit tracking-wider text-black hover:text-rock-cyan transition-colors"
          >
            <span>View All Event Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {races.map((race) => (
            <div 
              key={race.id} 
              className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-black uppercase font-outfit shadow-sm">
                    {race.distance}
                  </span>
                  <span className="text-2xl font-black text-black font-outfit">
                    ₹{race.fee}
                  </span>
                </div>

                <h3 className="text-xl font-black text-black font-outfit uppercase mb-2 group-hover:text-rock-cyan transition-colors">
                  {race.name}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {race.description}
                </p>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-[11px] font-bold text-gray-700 mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 text-rock-cyan" />
                  <span>{race.age_limit || 'Open Entry'}</span>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-black hover:text-white text-black font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-sm group-hover:shadow-md"
              >
                <span>REGISTER NOW</span>
                <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* 3. EVENT KEY DETAILS HOME BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-black tracking-widest text-rock-yellow uppercase font-outfit">Official Marathon Details</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase font-outfit tracking-tight">
              {settings.venue}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-medium">
              {settings.event_date} • {settings.location} • Flag-off starting from {settings.reporting_time}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/about"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-6 py-3.5 rounded-full text-xs transition-all border border-white/20 font-outfit uppercase tracking-wider"
            >
              Event Info
            </Link>
            <Link
              to="/register"
              className="bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold px-7 py-3.5 rounded-full text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5 font-outfit uppercase tracking-wider"
            >
              <span>REGISTER NOW</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
