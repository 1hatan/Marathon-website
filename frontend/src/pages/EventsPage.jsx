import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Medal, Star, ArrowUpRight, ChevronRight, ShieldCheck, Flag, Shirt, FileCheck, Coffee, Droplet } from 'lucide-react';
import { fetchRaces } from '../services/api';

export default function EventsPage() {
  const [races, setRaces] = useState([
    { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages' },
    { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old' },
    { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old' },
    { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old' }
  ]);

  useEffect(() => {
    async function loadRacesData() {
      try {
        const res = await fetchRaces();
        if (res && res.success && Array.isArray(res.races) && res.races.length > 0) {
          setRaces(res.races);
        }
      } catch (err) {
        console.error('Failed to load races for events page:', err);
      }
    }
    loadRacesData();
  }, []);

  const prizeCategories = [
    {
      race: '21K Half Marathon',
      purse: '₹ 1,50,000 Total Prize Pool',
      icon: Trophy,
      badge: '21K Flagship',
      badgeColor: 'bg-rock-yellow text-black',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: '1st Place', mens: '₹ 40,000 + Trophy', womens: '₹ 40,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 25,000 + Trophy', womens: '₹ 25,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 10,000 + Trophy', womens: '₹ 10,000 + Trophy' },
      ]
    },
    {
      race: '10K Challenge',
      purse: '₹ 80,000 Total Prize Pool',
      icon: Award,
      badge: '10K Timed',
      badgeColor: 'bg-rock-cyan text-white',
      purseColor: 'text-rock-yellow',
      prizes: [
        { place: '1st Place', mens: '₹ 20,000 + Trophy', womens: '₹ 20,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 12,000 + Trophy', womens: '₹ 12,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 8,000 + Trophy', womens: '₹ 8,000 + Trophy' },
      ]
    },
    {
      race: '5K Run',
      purse: '₹ 40,000 Total Prize Pool',
      icon: Medal,
      badge: '5K Fitness',
      badgeColor: 'bg-black text-white',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: '1st Place', mens: '₹ 10,000 + Trophy', womens: '₹ 10,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 6,000 + Trophy', womens: '₹ 6,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 4,000 + Trophy', womens: '₹ 4,000 + Trophy' },
      ]
    },
    {
      race: '3K Fun Run',
      purse: 'Trophies & Special Gifts',
      icon: Star,
      badge: '3K Open',
      badgeColor: 'bg-rock-yellow text-black',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: 'Top 3 Finishers', mens: 'Custom Trophies + Gift Hampers', womens: 'Custom Trophies + Gift Hampers' },
        { place: 'Special Category', mens: 'Youngest & Veteran Trophy', womens: 'Youngest & Veteran Trophy' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            Infinity Run 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Events & Race <span className="text-rock-yellow">Categories</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Choose your distance challenge. All race entries include an official dry-fit T-shirt, personalized timing bib, finisher medal, breakfast, and medical support.
          </p>
        </div>

        {/* 1. Race Categories Overview Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-yellow pl-4">
            Race Distance Categories
          </h2>
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
        </div>

        {/* 2. Prize Purses & Recognition Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-cyan pl-4">
            Prize Purses & Awards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prizeCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.race} className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all space-y-6 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-outfit inline-block mb-1 ${cat.badgeColor}`}>
                          {cat.badge}
                        </span>
                        <h3 className="text-2xl font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">
                          {cat.race}
                        </h3>
                        <p className={`text-xs font-black uppercase tracking-wider mt-0.5 ${cat.purseColor}`}>{cat.purse}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-rock-yellow/20 text-black flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                      {cat.prizes.map((p, idx) => (
                        <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                          <span className="font-black font-outfit text-black uppercase w-32">{p.place}</span>
                          <div className="flex-1 grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-gray-400 text-[10px] font-extrabold uppercase block">Men's</span>
                              <span className="font-bold text-gray-900">{p.mens}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 text-[10px] font-extrabold uppercase block">Women's</span>
                              <span className="font-bold text-gray-900">{p.womens}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/register"
                      className="w-full bg-rock-yellow hover:bg-black hover:text-white text-black font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Compete in {cat.race}</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
