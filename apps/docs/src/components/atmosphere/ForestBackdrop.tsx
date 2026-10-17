'use client';

import React, { useEffect, useRef } from 'react';
import { Fireflies } from './Fireflies';
import { FoliageLayers } from './FoliageLayers';
import { useReducedMotion } from './useReducedMotion';

export interface ForestBackdropProps {
  intensity?: 'full' | 'quiet';
}

interface ScrollTarget {
  style: { setProperty(key: string, value: string): void };
}

/**
 * Publishes the scroll position as a CSS custom property so the foliage layers
 * can parallax without React re-rendering anything on scroll.
 */
export function setForestScroll(target: ScrollTarget, scrollY: number): void {
  target.style.setProperty('--forest-scroll', `${-scrollY}px`);
}

const RAYS = [
  { left: '12%', width: '7rem', rotate: '-14deg', opacity: 0.1, duration: '19s' },
  { left: '31%', width: '4rem', rotate: '-9deg', opacity: 0.07, duration: '23s' },
  { left: '58%', width: '9rem', rotate: '-17deg', opacity: 0.09, duration: '17s' },
  { left: '79%', width: '5rem', rotate: '-11deg', opacity: 0.06, duration: '26s' },
];

export function ForestBackdrop({ intensity = 'full' }: ForestBackdropProps) {
  const quiet = intensity === 'quiet';
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const element = rootRef.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setForestScroll(element, window.scrollY);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-full-bleed
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-forest-bark"
    >
      {/* Dusk wash — amethyst falling from the upper right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 78% 6%, rgb(var(--amethyst) / 0.34) 0%, rgb(var(--amethyst) / 0.1) 34%, transparent 68%)',
        }}
      />

      {/* Warm light pooling low on the left, as if from a clearing. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 8% 82%, rgb(var(--ember) / 0.14) 0%, transparent 62%)',
        }}
      />

      {/* God rays through the canopy. */}
      {!quiet &&
        RAYS.map((ray, index) => (
          <div
            key={index}
            className="absolute -top-1/3 h-[150%] origin-top"
            style={{
              left: ray.left,
              width: ray.width,
              opacity: ray.opacity,
              transform: `rotate(${ray.rotate})`,
              background:
                'linear-gradient(to bottom, rgb(var(--marigold) / 0.9) 0%, rgb(var(--marigold) / 0.25) 45%, transparent 85%)',
              filter: 'blur(22px)',
              animation: `forest-ray-breathe ${ray.duration} ease-in-out infinite alternate`,
            }}
          />
        ))}

      <FoliageLayers depth={quiet ? 3 : 4} />

      <Fireflies count={quiet ? 9 : 18} interactive={!quiet} />

      {/* Vignette, so the edges sink into the dark. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 95% at 50% 42%, transparent 42%, rgb(var(--bark) / 0.62) 78%, rgb(var(--bark) / 0.9) 100%)',
        }}
      />

      {/* Film grain. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.045]">
        <filter id="forest-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#forest-grain)" />
      </svg>
    </div>
  );
}
