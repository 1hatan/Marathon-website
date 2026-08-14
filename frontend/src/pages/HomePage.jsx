import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Activity,
  Sparkles,
  Zap
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
    <div className="w-full bg-white text-black font-sans antialiased overflow-x-hidden">
      
      {/* 1. HERO SECTION — EXACT 55% / 45% SPLIT, 100VH ON DESKTOP */}
      <section className="w-full min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] flex flex-col lg:flex-row items-stretch overflow-hidden bg-white relative">
        
        {/* LEFT COLUMN — EXACTLY 55% WIDTH ON DESKTOP */}
        <div className="w-full lg:w-[55%] h-full flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-10 lg:py-12 z-10 relative bg-white">
          
          {/* Subtle background geometric accent */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Top Label */}
          <div className="space-y-4 hero-enter delay-100">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-widest uppercase font-outfit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rock-yellow animate-ping" />
              <span>INFINITY RUN</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 text-[11px] font-bold">2026 EDITION</span>
            </div>
          </div>

          {/* Core Content Area */}
          <div className="my-auto py-6 space-y-6 max-w-2xl">
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-5xl xl:text-6xl font-black font-outfit uppercase tracking-tight leading-[1.08] text-black hero-enter delay-200">
              Every Step Creates a{' '}
              <span className="text-rock-yellow block sm:inline">
                Better Tomorrow.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-base xl:text-lg text-gray-600 font-medium leading-relaxed max-w-xl hero-enter delay-300">
              Join thousands of runners in Salem’s ultimate premier marathon event. Unleash your potential, conquer new distances, and run toward a stronger, healthier future.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 hero-enter delay-400">
              
              {/* Primary Filled Button — Rock Yellow */}
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2.5 bg-rock-yellow hover:bg-rock-yellowHover text-black font-black px-8 py-4 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>REGISTER NOW</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Secondary Outlined Button — Black Border */}
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-black hover:text-white text-black border-2 border-black font-black px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider transition-all group"
              >
                <span>EXPLORE EVENT</span>
                <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

          {/* Bottom Highlights & Event Metadata */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-bold text-gray-500 hero-enter delay-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rock-yellow" />
              <span className="text-black font-extrabold font-outfit">{settings.event_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rock-cyan" />
              <span className="text-black font-extrabold font-outfit">{settings.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-black" />
              <span className="text-black font-extrabold font-outfit">21K | 10K | 5K | 3K</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — EXACTLY 45% WIDTH ON DESKTOP WITH PROMINENT VIDEO */}
        <div className="w-full lg:w-[45%] h-[55vh] lg:h-full relative overflow-hidden bg-black shrink-0">
          
          {/* Main Running Video */}
          <video
            src="https://res.cloudinary.com/bgr6hlyu/video/upload/v1786680194/VID_20260813_224356_2.mp4"
            poster="https://res.cloudinary.com/bgr6hlyu/video/upload/v1786680194/VID_20260813_224356_2.jpg"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000"
          />

          {/* Subtle Left Edge Gradient Blend Overlay */}
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/20 to-transparent pointer-events-none hidden lg:block" />

          {/* Subtle Bottom Gradient Blend Overlay for Mobile */}
          <div className="absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-white via-white/20 to-transparent pointer-events-none lg:hidden" />

          {/* Floating Subtle Live Runner Tag */}
          <div className="absolute bottom-6 right-6 z-20 backdrop-blur-md bg-black/70 border border-white/20 px-4 py-2 rounded-2xl text-white text-xs font-bold flex items-center gap-2.5 shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-rock-yellow animate-pulse" />
            <span className="font-outfit uppercase tracking-wider text-[11px] font-black">Official Marathon Highlight</span>
          </div>

        </div>

      </section>

      {/* 2. RACE CATEGORIES SUMMARY SECTION */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black tracking-widest text-rock-cyan uppercase block mb-1 font-outfit">Race Categories</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black uppercase font-outfit tracking-tight">
              Choose Your <span className="text-rock-yellow">Challenge</span>
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium max-w-md text-left md:text-right leading-relaxed">
            All categories include an official dry-fit Infinity Run T-shirt, personalized timing bib, finisher medal, breakfast, and medical support.
          </p>
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
                className="w-full inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-black hover:text-white text-black font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-sm group-hover:shadow-md uppercase font-outfit"
              >
                <span>REGISTER NOW</span>
                <ChevronRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* 3. INFINITY RUN BRANDING & RUNNING ATHLETE FEATURE SECTION */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-1 font-outfit">
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black uppercase">
                  Infinity <span className="text-stroke-light text-gray-300 font-extrabold">Run</span>
                </h2>
                <h3 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-rock-yellow uppercase leading-none">
                  Salem Tamil Nadu 2026
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal pt-2">
                Historic heritage, scenic Yercaud foothills, vibrant culture, true local flavor – Salem, Tamil Nadu is a place unlike any other. Join thousands of runners creating an unforgettable experience with Infinity Run. Every step creates a better tomorrow.
              </p>
            </div>

            <div className="space-y-6">
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-4">Official Partners</span>
                <div className="flex flex-wrap items-center gap-8 text-xs font-black text-gray-800 tracking-wider">
                  <span className="flex items-center gap-1.5 text-black font-extrabold font-outfit text-sm">
                    <span className="w-2.5 h-2.5 bg-black rotate-45 inline-block" /> ALWAYS ADVANCING
                  </span>
                  <span className="text-red-600 font-black text-sm tracking-tight">
                    Finisher<span className="text-black">Pix</span>
                  </span>
                  <span className="lowercase font-bold text-base tracking-tighter text-black">
                    lululemon
                  </span>
                  <span className="font-black text-sm tracking-widest uppercase text-black">
                    SUUNTO
                  </span>
                </div>
              </div>

              <div>
                <div className="h-6 w-full bg-hazard-stripes rounded-md shadow-sm transform -skew-x-12" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-gray-900 rounded-3xl overflow-hidden relative min-h-[380px] flex flex-col justify-end p-6 group shadow-lg border-2 border-gray-100 hover:border-black transition-all">
            <img 
              src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80" 
              alt="Infinity Run City Marathon Race" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="relative z-10 space-y-3 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rock-yellow text-black rounded-full text-xs font-black uppercase font-outfit shadow">
                <span>Infinity Run 2026</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tight text-white leading-tight">
                Unleash Your <span className="text-rock-yellow">Potential</span>
              </h3>
              
              <p className="text-xs text-gray-200 font-medium leading-relaxed">
                Experience Salem's premier marathon event with chip timing, scenic routes & vibrant community spirit.
              </p>

              <Link
                to="/register"
                className="w-full inline-flex items-center justify-between bg-rock-cyan hover:bg-sky-500 text-white font-black px-5 py-3.5 rounded-2xl text-xs uppercase font-outfit tracking-wider transition-all shadow-md group-hover:shadow-lg"
              >
                <span>REGISTER FOR RACE</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
