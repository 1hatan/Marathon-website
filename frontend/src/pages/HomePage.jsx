import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, ArrowRight, Trophy, Calendar, MapPin, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { fetchSettings, fetchRaces } from '../services/api';

export default function HomePage() {
  const [settings, setSettings] = useState({
    event_date: 'Sunday, November 15, 2026',
    venue: 'Salem Sports Complex',
    location: 'Salem, Tamil Nadu'
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
        const [settingsRes, racesRes] = await Promise.all([fetchSettings(), fetchRaces()]);
        if (settingsRes.success && settingsRes.settings) setSettings(settingsRes.settings);
        if (racesRes.success && racesRes.races && racesRes.races.length > 0) setRaces(racesRes.races);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      
      {/* 1ST LOAD: BENTO BOX GRID HERO SECTION & IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Card 1: Top Left Vertical Runner Card (Tall) - Phase 1 (0ms) */}
          <div className="md:col-span-3 bg-gray-100 rounded-3xl overflow-hidden relative min-h-[380px] flex flex-col justify-end group shadow-sm animate-hero-card delay-0 transition-transform duration-300 hover:shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80" 
              alt="Infinity Run Athlete" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Yellow Accent Shape */}
            <div className="absolute top-4 left-4 w-14 h-14 bg-rock-yellow rounded-full opacity-90 blur-xs animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            <div className="relative z-10 p-5 text-white">
              <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase mb-1">
                District Running Collective
              </span>
              <p className="text-xs text-gray-200 font-semibold">Infinity Run 2026 Athlete</p>
            </div>
          </div>

          {/* Center Column (Span 6) */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Card 2: Date Badges (Sky Blue Card) - Phase 1 (100ms) */}
              <div className="sm:col-span-5 bg-rock-cyan rounded-3xl p-4 flex flex-col justify-between items-center text-white shadow-sm min-h-[140px] animate-hero-card delay-100 hover:scale-[1.02] transition-all">
                {/* Top pill with arrow button */}
                <div className="w-full flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1.5">
                  <span className="text-sm font-extrabold tracking-tight">Nov 15</span>
                  <div className="w-6 h-6 rounded-full bg-white text-rock-cyan flex items-center justify-center shadow">
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                {/* Bottom 2026 pill */}
                <div className="w-full text-center bg-white/30 backdrop-blur-md rounded-2xl py-2 mt-2">
                  <span className="text-3xl font-black tracking-tight">2026</span>
                </div>
              </div>

              {/* Card 3: $80 Instant Feed Credit Banner - Phase 1 (150ms) */}
              <div className="sm:col-span-7 bg-gray-900 rounded-3xl overflow-hidden relative min-h-[140px] flex items-center justify-center shadow-sm group animate-hero-card delay-200 hover:scale-[1.02] transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80" 
                  alt="Runners Medals" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                
                <div className="relative z-10 px-6 py-4 text-white">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black font-outfit text-white">$80</span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-black tracking-wider uppercase text-white">INSTANT FEED</span>
                      <span className="text-xs font-black tracking-wider uppercase text-gray-200">CREDIT</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Card 4: Main Horizontal Hero Pill Container (Spans Center) - Phase 1 (250ms) */}
            <div className="relative rounded-[40px] overflow-hidden border-4 border-white shadow-xl min-h-[220px] flex items-center justify-center group animate-hero-card delay-300">
              <img 
                src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80" 
                alt="Infinity Run Finish Line" 
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
              
              {/* Overlay Typography matching UI layout */}
              <div className="relative z-10 text-center text-white px-6 py-8">
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-outfit">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-white uppercase">Half</span>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-normal text-white uppercase">Marathon</span>
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-white uppercase">5k</span>
                  <span className="text-2xl sm:text-3xl font-normal lowercase tracking-wide text-gray-200 font-sans italic">runners</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card Right Column (Span 3) */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            
            {/* Top Right Card: 100 Miles Medal Graphic Box - Phase 1 (350ms) */}
            <div className="bg-rock-cyan/10 border border-rock-cyan/30 rounded-3xl p-4 flex flex-col items-center justify-center text-center min-h-[140px] relative overflow-hidden group animate-hero-card delay-400 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-full bg-rock-cyan/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-rock-cyan">100</span>
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-gray-900">100 MILES MEDAL</span>
            </div>

            {/* Bottom Right Card: Action Runner with Yellow CTA Button - Phase 1 (400ms) */}
            <div className="bg-gray-900 rounded-3xl overflow-hidden relative flex-1 min-h-[220px] flex flex-col justify-end p-4 group shadow-sm animate-hero-card delay-500">
              <img 
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80" 
                alt="Runner in Action" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="relative z-10 w-full">
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-between bg-rock-yellow hover:bg-rock-yellowHover text-black font-extrabold px-5 py-3 rounded-full text-xs transition-all shadow-md transform group-hover:translate-x-0.5"
                >
                  <span>Join us now!</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Row Stats Bar (Under Grid) - Phase 1 (450ms) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 animate-hero-card delay-500">
          
          <div className="md:col-span-6 bg-gray-900 text-white rounded-3xl p-5 relative overflow-hidden flex items-center justify-between shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=80" 
              alt="Race Crowd" 
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

            <div className="relative z-10 grid grid-cols-3 gap-6 w-full text-center sm:text-left">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">Distances</span>
                <span className="text-3xl font-black font-outfit text-white">04</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">Avg. Air Temp</span>
                <span className="text-3xl font-black font-outfit text-white">48f</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">Airport</span>
                <span className="text-3xl font-black font-outfit text-white">DCA</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-rock-yellow rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider uppercase text-black">OFFICIAL REGISTRATION OPEN</span>
              <span className="text-sm font-bold text-gray-800">Secure your bib for Infinity Run 2026</span>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-1 bg-black text-white font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-800 transition-colors shrink-0"
            >
              <span>REGISTER NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>

      {/* 2ND LOAD: RACE CATEGORIES SECTION (STAGGERED ANIMATED SLIDE UP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 animate-section-fade delay-600">
          <div>
            <span className="text-xs font-black tracking-widest text-rock-cyan uppercase block mb-1">Race Categories</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase font-outfit tracking-tight">
              Choose Your <span className="text-rock-yellow">Challenge</span>
            </h2>
          </div>
          <p className="text-xs text-gray-500 max-w-md mt-2 md:mt-0 font-medium">
            All categories include an official dry-fit Infinity Run T-shirt, personalized timing bib, finisher medal, breakfast, and medical support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {races.map((race, index) => {
            const delayClasses = ['delay-600', 'delay-700', 'delay-800', 'delay-900'];
            const cardDelay = delayClasses[index % delayClasses.length];

            return (
              <div 
                key={race.id} 
                className={`bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-race-card ${cardDelay}`}
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
            );
          })}
        </div>
      </section>

      {/* 3RD LOAD: LOWER SECTION - INFINITY RUN BRANDING & RUNNING FEATURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 animate-section-fade delay-1000">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Title, Description, Sponsor Logos, Hazard Tape */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title Block matching reference image styling */}
            <div className="space-y-1 font-outfit">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-black uppercase">
                Infinity <span className="text-stroke-light text-gray-300 font-extrabold">Run</span>
              </h1>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-rock-yellow uppercase leading-none">
                Salem Tamil Nadu 2026
              </h2>
            </div>

            {/* Description Paragraph */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Historic heritage, scenic Yercaud foothills, vibrant culture, true local flavor – Salem, Tamil Nadu is a place unlike any other. Join thousands of runners creating an unforgettable experience with Infinity Run. Every step creates a better tomorrow.
            </p>

            {/* Sponsor Logos Row */}
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

            {/* Caution Hazard Stripe Tape Accent */}
            <div className="pt-4">
              <div className="h-6 w-full bg-hazard-stripes rounded-md shadow-sm transform -skew-x-12" />
            </div>

          </div>

          {/* Right Column: Running Athlete Feature Card */}
          <div className="lg:col-span-4 bg-gray-900 rounded-3xl overflow-hidden relative min-h-[340px] flex flex-col justify-end p-6 group shadow-lg border-2 border-gray-100 hover:border-black transition-all">
            <img 
              src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80" 
              alt="Infinity Run City Marathon Race" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
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
                className="w-full inline-flex items-center justify-between bg-rock-cyan hover:bg-sky-500 text-white font-black px-5 py-3 rounded-2xl text-xs uppercase font-outfit tracking-wider transition-all shadow-md group-hover:shadow-lg"
              >
                <span>Register For Race</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
