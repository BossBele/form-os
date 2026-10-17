'use client';

import React, { useEffect, useState } from 'react';
import NebulaFlow from '../lightswind/nebula-flow';
import { cn } from '../../lib/utils';

/** Pure capability probe — never throws, and false wherever there is no DOM. */
export function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export interface MoonOrbProps {
  size?: number;
  className?: string;
}

/**
 * The visual half, split out so it can be rendered and inspected without a
 * WebGL context. `[&_*]:!pointer-events-none` is load-bearing: the shader's
 * canvas sets `pointer-events: auto` inline, which would otherwise let a purely
 * decorative layer swallow clicks and text selection in the hero.
 */
export function MoonOrbVisual({ size, className }: MoonOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative [&_*]:!pointer-events-none',
        className
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          WebkitMaskImage:
            'radial-gradient(circle at 50% 46%, #000 50%, transparent 71%)',
          maskImage:
            'radial-gradient(circle at 50% 46%, #000 50%, transparent 71%)',
        }}
      >
        <NebulaFlow
          colors={['#B25E4A', '#F2B03D', '#F6F1E4']}
          speed={0.5}
          scale={1.15}
          density={0.6}
          interactive={false}
        />
      </div>

      {/* Halo, so the orb sits in the air rather than on top of it. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgb(var(--marigold) / 0.2) 0%, rgb(var(--amethyst) / 0.12) 44%, transparent 66%)',
        }}
      />
    </div>
  );
}

/**
 * A drifting nebula caught inside a circle — the moon hanging behind the
 * branches. Purely decorative: it encodes nothing about the library, and it
 * renders nothing at all on the server or without a WebGL context, so a page
 * that cannot draw it loses atmosphere and nothing else.
 */
export function MoonOrb(props: MoonOrbProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(supportsWebGL());
  }, []);

  if (!ready) return null;
  return <MoonOrbVisual {...props} />;
}
