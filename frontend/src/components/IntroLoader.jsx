import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import StrokeText from './StrokeText';
import './IntroLoader.css';

export default function IntroLoader({ onComplete }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const hasTriggeredExitRef = useRef(false);

  const [shouldRender, setShouldRender] = useState(true);

  // Responsive font size for optimal SVG text layout
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 76 : window.innerWidth < 1024 ? 104 : 128;
    }
    return 110;
  });

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth < 640 ? 76 : window.innerWidth < 1024 ? 104 : 128);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scrolling while intro loader is active
  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [shouldRender]);

  // Color mapping: "Infinity " -> Black (#111827), "Run" -> Brand Blue (#00A3FF)
  const getCharColor = (char, index) => {
    // "Infinity " is 9 chars (index 0..8)
    return index < 9 ? '#111827' : '#00A3FF';
  };

  // Completion sequence after StrokeText finishes
  const handleStrokeComplete = () => {
    if (hasTriggeredExitRef.current || !shouldRender) return;
    hasTriggeredExitRef.current = true;

    const prefersReduced = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setShouldRender(false);
      if (onComplete) onComplete();
      return;
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;

    const exitTl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false);
        if (onComplete) onComplete();
      }
    });

    const pauseTime = 0.3; // Small pause after fill completes

    // 1. Slightly scale & fade text out
    if (content) {
      exitTl.to(
        content,
        {
          opacity: 0,
          scale: 1.05,
          y: -12,
          duration: 0.5,
          ease: 'power2.in'
        },
        `+=${pauseTime}`
      );
    }

    // 2. Smoothly fade out full-screen white overlay to reveal the website
    if (overlay) {
      exitTl.to(
        overlay,
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        },
        '-=0.3'
      );
    }
  };

  if (!shouldRender) return null;

  return (
    <div ref={overlayRef} className="intro-loader">
      <div ref={contentRef} className="intro-loader__content">
        <div className="intro-loader__title-wrapper">
          <StrokeText
            text="INFINITY RUN"
            strokeColor={getCharColor}
            fillColor={getCharColor}
            strokeWidth={1.8}
            drawDuration={1.7}
            fillDelay={0.25}
            stagger={0.06}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={fontSize}
            fontWeight={900}
            letterSpacing={-3}
            onComplete={handleStrokeComplete}
          />
        </div>
      </div>
    </div>
  );
}
