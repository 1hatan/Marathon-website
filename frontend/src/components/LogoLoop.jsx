import React from 'react';
import { Maximize2 } from 'lucide-react';
import './LogoLoop.css';

export default function LogoLoop({
  logos = [],
  speed = 100,
  direction = 'left',
  logoHeight = 260,
  gap = 24,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#ffffff',
  ariaLabel = 'Interactive Gallery Loop',
  onImageClick,
  className = ''
}) {
  if (!logos || logos.length === 0) return null;

  // Duplicate items to guarantee seamless infinite loop seamlessly without blanks
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Calculate animation duration based on speed
  const duration = Math.max(8, Math.round(1800 / (speed || 100)));

  const containerStyle = {
    '--loop-duration': `${duration}s`,
    '--loop-gap': `${gap}px`,
    '--fade-color': fadeOutColor
  };

  return (
    <div
      className={`logoloop-container ${className}`}
      style={containerStyle}
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div className="logoloop-fade-left" />
          <div className="logoloop-fade-right" />
        </>
      )}

      <div
        className={`logoloop-track-wrapper direction-${direction} ${
          hoverSpeed === 0 ? 'pause-on-hover' : ''
        }`}
      >
        <div className="logoloop-list">
          {duplicatedLogos.map((item, index) => (
            <div
              key={`${item?.id || index}-${index}`}
              onClick={() => onImageClick && onImageClick(item)}
              className={`logoloop-item group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-black bg-black ${
                scaleOnHover ? 'scale-on-hover' : ''
              }`}
              style={{
                height: `${logoHeight}px`,
                aspectRatio: '4 / 3'
              }}
            >
              {item?.src || item?.image_url ? (
                <img
                  src={item.src || item.image_url}
                  alt={item.title || item.alt || 'Gallery Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              ) : (
                item?.node || <div className="w-full h-full bg-gray-100" />
              )}

              {/* Hover overlay with title & expand icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[11px] text-rock-yellow font-black uppercase tracking-wider flex items-center gap-1 font-outfit">
                  <Maximize2 className="w-3.5 h-3.5" /> View Photo
                </span>
                {(item?.title || item?.alt) && (
                  <h4 className="text-white font-black font-outfit text-sm uppercase mt-0.5 truncate">
                    {item.title || item.alt}
                  </h4>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
