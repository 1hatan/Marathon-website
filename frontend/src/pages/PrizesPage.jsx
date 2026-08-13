import React from 'react';
import { Trophy, Award, Medal, Star, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrizesPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Prizes & Recognition
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Prize Purse & <span className="text-rock-yellow">Awards</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Over ₹2,70,000 in total cash prize purses, trophies, and commemorative awards for top male and female athletes across race categories.
          </p>
        </div>

        {/* Prize Category Cards Grid */}
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
  );
}
