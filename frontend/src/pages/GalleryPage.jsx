import React, { useEffect, useState } from 'react';
import { fetchGallery } from '../services/api';
import LightboxModal from '../components/LightboxModal';
import { Maximize2 } from 'lucide-react';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultGallery = [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', title: 'Marathon Flag Off Moment' },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', title: 'Runners at Sunrise' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', title: 'Finisher Line Joy' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80', title: 'Hydration Station' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', title: 'Medal Presentation' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', title: 'Community Spirit' }
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

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Event Highlights & Moments
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Race Day <span className="text-rock-yellow">Gallery</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Capturing the spirit, passion, and triumph of Infinity Run runners. Tap any photo to expand in high resolution.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-black rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-video sm:aspect-square border-2 border-gray-100 hover:border-black"
            >
              <img
                src={item.image_url}
                alt={item.title || 'Infinity Run Photo'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs text-rock-yellow font-black uppercase tracking-wider flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> View Photo
                </span>
                <h3 className="text-white font-black font-outfit text-lg uppercase mt-1">
                  {item.title || 'Infinity Run Moment'}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Preview Modal */}
        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      </div>
    </div>
  );
}
