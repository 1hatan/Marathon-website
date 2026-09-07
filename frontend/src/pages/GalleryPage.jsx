import React, { useEffect, useState } from 'react';
import { fetchGallery } from '../services/api';
import LightboxModal from '../components/LightboxModal';
import LogoLoop from '../components/LogoLoop';
import { Maximize2, Sparkles, Repeat } from 'lucide-react';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultGallery = [
    { id: 1, image_url: '/images/running_marathon_city.png', title: 'Salem City Marathon Runners' },
    { id: 2, image_url: '/images/running_marathon_pro.png', title: 'Elite Lead Marathon Runners' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', title: 'Marathon Runners Pack' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', title: 'Sunrise Road Runners' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', title: 'Finisher Sprint Challenge' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&auto=format&fit=crop&q=80', title: 'Community Pace Runners' },
    { id: 7, image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80', title: 'Athlete Sprint Focus' },
    { id: 8, image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80', title: 'Mountain Trail Runners' },
    { id: 9, image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', title: 'Victory & Triumph Sprint' },
    { id: 10, image_url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80', title: 'Finish Line Medals' }
  ];

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetchGallery(false);
        if (res && res.success && Array.isArray(res.gallery) && res.gallery.length > 0) {
          setGallery(res.gallery);
        } else {
          setGallery(defaultGallery);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
        setGallery(defaultGallery);
      }
    }
    loadGallery();
  }, []);

  const displayGallery = (gallery && gallery.length > 0) ? gallery : defaultGallery;

  // Split photos into two sets for dual loop scrolling
  const halfLength = Math.ceil(displayGallery.length / 2);
  const loopSet1 = displayGallery.slice(0, halfLength);
  const loopSet2 = displayGallery.slice(halfLength).concat(displayGallery.slice(0, 2));

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16 overflow-x-hidden">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Continuous Photo Stream
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Race Day <span className="text-rock-yellow">Gallery Loop</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Hover over any scrolling photo card to pause and zoom. Tap to open in high resolution.
          </p>
        </div>

        {/* 1. ENDLESS HORIZONTAL MARQUEE PHOTO LOOPS */}
        <div className="space-y-6 bg-gray-50/70 border-2 border-gray-100 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-rock-cyan animate-spin-slow" />
              <span className="font-black text-black uppercase font-outfit text-base">
                Infinite Photo Loop
              </span>
            </div>
            <span className="text-xs font-bold text-gray-500">
              Hover to pause • Click to expand
            </span>
          </div>

          {/* Row 1: Leftward Infinite Scroll */}
          <LogoLoop
            logos={loopSet1}
            speed={110}
            direction="left"
            logoHeight={240}
            gap={24}
            hoverSpeed={0}
            scaleOnHover={true}
            fadeOut={true}
            fadeOutColor="#f9fafb"
            ariaLabel="Top race photo marquee loop"
            onImageClick={(item) => setSelectedImage(item)}
          />

          {/* Row 2: Rightward Infinite Scroll */}
          <LogoLoop
            logos={loopSet2}
            speed={90}
            direction="right"
            logoHeight={240}
            gap={24}
            hoverSpeed={0}
            scaleOnHover={true}
            fadeOut={true}
            fadeOutColor="#f9fafb"
            ariaLabel="Bottom race photo marquee loop"
            onImageClick={(item) => setSelectedImage(item)}
          />
        </div>

        {/* Lightbox Preview Modal */}
        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      </div>
    </div>
  );
}
