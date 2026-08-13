import React, { useEffect, useState } from 'react';
import { fetchSponsors } from '../services/api';
import { Award, ArrowUpRight } from 'lucide-react';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetchSponsors(false);
        if (res && res.success && Array.isArray(res.sponsors)) {
          setSponsors(res.sponsors);
        }
      } catch (err) {
        console.error('Failed to load sponsors:', err);
      }
    }
    loadSponsors();
  }, []);

  const tiers = [
    { title: 'Title Sponsor', badgeColor: 'bg-rock-yellow text-black' },
    { title: 'Gold Sponsor', badgeColor: 'bg-rock-cyan text-white' },
    { title: 'Silver Sponsor', badgeColor: 'bg-black text-white' },
    { title: 'Supporting Partner', badgeColor: 'bg-rock-yellow text-black' }
  ];

  const defaultSponsors = [
    { id: 1, name: 'ALWAYS ADVANCING', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80', tier: 'Title Sponsor', website: 'https://apexathletics.com' },
    { id: 2, name: 'FinisherPix', logo: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&auto=format&fit=crop&q=80', tier: 'Gold Sponsor', website: 'https://hydromax.com' },
    { id: 3, name: 'lululemon', logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80', tier: 'Gold Sponsor', website: 'https://fitnutrition.com' },
    { id: 4, name: 'SUUNTO', logo: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=300&auto=format&fit=crop&q=80', tier: 'Silver Sponsor', website: 'https://pulsewearables.com' },
  ];

  const displaySponsors = (sponsors && sponsors.length > 0) ? sponsors : defaultSponsors;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Our Event Partners
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Official <span className="text-rock-yellow">Sponsors</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            We express our deep gratitude to our esteemed brand sponsors and supporting partners who make Infinity Run possible.
          </p>
        </div>

        {/* Sponsor Tiers Grid */}
        <div className="space-y-12">
          {tiers.map((tierObj) => {
            const tierSponsors = displaySponsors.filter((s) => s.tier === tierObj.title);
            if (tierSponsors.length === 0) return null;

            return (
              <div key={tierObj.title} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase font-outfit ${tierObj.badgeColor}`}>
                    {tierObj.title}
                  </span>
                  <div className="flex-1 h-0.5 bg-gray-100" />
                </div>

                <div className={`grid gap-6 ${
                  tierObj.title === 'Title Sponsor' ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {tierSponsors.map((sponsor) => (
                    <a
                      key={sponsor.id}
                      href={sponsor.website || '#'}
                      target={sponsor.website ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col items-center justify-center group"
                    >
                      <div className="h-24 w-full flex items-center justify-center p-2">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-all"
                        />
                      </div>
                      <h4 className="font-black font-outfit text-black text-sm uppercase mt-3 flex items-center gap-1 group-hover:text-rock-cyan transition-colors">
                        <span>{sponsor.name}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </h4>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
