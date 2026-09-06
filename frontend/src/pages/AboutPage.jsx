import React from 'react';
import {
  Flag,
  Shirt,
  Medal,
  FileCheck,
  Coffee,
  Droplet
} from 'lucide-react';

export default function AboutPage() {
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

        {/* 2. Runner Entitlements & Benefits Grid */}
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


