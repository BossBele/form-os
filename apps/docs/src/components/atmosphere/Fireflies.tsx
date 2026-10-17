'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface FirefliesProps {
  count?: number;
  interactive?: boolean;
}

/**
 * Deterministic pseudo-random in [0, 1). Index-driven rather than Math.random
 * so the server and client produce byte-identical markup.
 */
function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const PUSH_RADIUS = 130;
const PUSH_STRENGTH = 34;

export function Fireflies({ count = 18, interactive = true }: FirefliesProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !interactive) return;
    const container = containerRef.current;
    if (!container) return;

    const onPointerMove = (event: PointerEvent) => {
      const nodes = container.querySelectorAll<HTMLElement>('[data-firefly]');
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - event.clientX;
        const dy = rect.top + rect.height / 2 - event.clientY;
        const distance = Math.hypot(dx, dy);

        if (distance < PUSH_RADIUS) {
          const push = (PUSH_RADIUS - distance) / PUSH_RADIUS;
          const scale = (push * PUSH_STRENGTH) / (distance || 1);
          node.style.setProperty('--fly-push-x', `${dx * scale}px`);
          node.style.setProperty('--fly-push-y', `${dy * scale}px`);
        } else {
          node.style.removeProperty('--fly-push-x');
          node.style.removeProperty('--fly-push-y');
        }
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduced, interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => {
        const left = seeded(index, 1) * 100;
        const top = 8 + seeded(index, 2) * 84;
        const size = 2 + seeded(index, 3) * 3;
        const duration = 7 + seeded(index, 4) * 11;
        const delay = -seeded(index, 5) * 18;
        const opacity = 0.3 + seeded(index, 6) * 0.5;

        return (
          <span
            key={index}
            data-firefly
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              background: 'rgb(var(--marigold))',
              boxShadow: '0 0 10px 3px rgb(var(--marigold) / 0.45)',
              transform:
                'translate3d(var(--fly-push-x, 0px), var(--fly-push-y, 0px), 0)',
              transition: reduced ? undefined : 'transform 900ms ease-out',
              animation: reduced
                ? undefined
                : `firefly-drift ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}
