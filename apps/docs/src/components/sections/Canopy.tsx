'use client';

import React from 'react';
import { MoonOrb } from '../atmosphere/MoonOrb';
import { ThreeDBeamCircle } from '../lightswind/3d-beam-circle';
import { useReducedMotion } from '../atmosphere/useReducedMotion';

export interface CanopyProps {
  onJumpToExample?: () => void;
  onJumpToDocs?: () => void;
}

function scrollToSection(id: string) {
  if (typeof document === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Motes circling the moon. Purely ornamental. */
const ORBITS = [
  {
    id: 1,
    size: 7,
    radiusFactor: 0.44,
    speed: 30,
    delay: 0,
    boxColor: 'rgb(242 176 61 / 0.9)',
    glowColor: '#F2B03D',
    orbitColor: '#F2B03D',
  },
  {
    id: 2,
    size: 5,
    radiusFactor: 0.36,
    speed: 41,
    delay: 0.35,
    boxColor: 'rgb(233 242 230 / 0.8)',
    glowColor: '#E9F2E6',
    orbitColor: '#E9F2E6',
  },
  {
    id: 3,
    size: 6,
    radiusFactor: 0.5,
    speed: 24,
    delay: 0.68,
    boxColor: 'rgb(123 75 138 / 0.9)',
    glowColor: '#7B4B8A',
    orbitColor: '#7B4B8A',
  },
];

export function Canopy({ onJumpToExample, onJumpToDocs }: CanopyProps) {
  const reduced = useReducedMotion();
  const jumpToExample = onJumpToExample ?? (() => scrollToSection('live-example'));
  const jumpToDocs = onJumpToDocs ?? (() => scrollToSection('docs-hub'));

  return (
    <section
      id="canopy"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-28 pt-36 sm:px-10 lg:px-16"
    >
      {/* The moon, hung upper right and half-swallowed by the foliage. */}
      <div className="pointer-events-none absolute inset-y-0 right-[-22%] flex items-center sm:right-[-8%] lg:right-[1%]">
        <div className="relative h-[clamp(300px,54vw,660px)] w-[clamp(300px,54vw,660px)] opacity-90">
          <MoonOrb className="absolute inset-0" />
          <ThreeDBeamCircle
            className="absolute inset-0"
            mode="full-circle"
            viewBoxWidth={800}
            viewBoxHeight={800}
            orbits={ORBITS}
            orbitThickness={1}
            arcOpacity={0.28}
            arcGlowIntensity={0.9}
            badgeBorderColor="rgb(242 176 61 / 0.45)"
            badgeShadow="glow"
            centerGlow={false}
            animationPaused={reduced}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.34em] text-forest-mist">
            form-os
          </p>

          <h1 className="mt-7 font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-forest-moonlight">
            Describe your form once.
            <span className="mt-2 block text-forest-marigold">
              Run it anywhere.
            </span>
          </h1>

          <p className="mt-9 max-w-xl text-lg leading-relaxed text-forest-mist">
            Every conditional field, every validation rule, every multi-step
            flow — written once as a plain configuration file, then rendered
            wherever you need it. No per-form rewrites. No drift between web
            and mobile. No lock-in to somebody else&apos;s builder.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              type="button"
              data-hero-cta
              onClick={jumpToExample}
              className="rounded-full bg-forest-ember px-7 py-3.5 text-sm font-semibold text-forest-bark transition hover:bg-forest-marigold"
            >
              See it work
            </button>
            <button
              type="button"
              data-hero-cta
              onClick={jumpToDocs}
              className="rounded-full border border-forest-fern/70 px-7 py-3.5 text-sm font-semibold text-forest-moonlight transition hover:border-forest-marigold hover:text-forest-marigold"
            >
              Read the docs
            </button>
          </div>

          <p className="mt-10 font-mono text-xs text-forest-mist/80">
            MIT licensed · @form-os/core · @form-os/react · @form-os/schema
          </p>
        </div>
      </div>
    </section>
  );
}
