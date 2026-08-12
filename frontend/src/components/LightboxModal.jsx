import React from 'react';
import { X } from 'lucide-react';

export default function LightboxModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="relative max-w-4xl w-full bg-navy-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy-900/80 text-white flex items-center justify-center hover:bg-orange-500 transition-colors"
          aria-label="Close Preview"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="max-h-[80vh] flex items-center justify-center bg-black">
          <img
            src={image.image_url}
            alt={image.title || 'Gallery Preview'}
            className="max-h-[80vh] w-auto object-contain"
          />
        </div>
        {image.title && (
          <div className="p-4 bg-navy-800 text-center">
            <h3 className="text-lg font-bold text-white">{image.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
