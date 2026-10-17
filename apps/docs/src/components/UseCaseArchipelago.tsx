'use client';

import React, { useState } from 'react';
import type { FormConfig } from '@form-os/core';
import { USE_CASE_ARCHIPELAGO } from '../lib/docs-data';
import { FormOSLiveRenderer } from './FormRenderer';
import {
  Compass,
  Navigation,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface UseCaseArchipelagoProps {
  onMountConfig?: (config: FormConfig, title: string) => void;
}

export function UseCaseArchipelago({ onMountConfig }: UseCaseArchipelagoProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIsland = USE_CASE_ARCHIPELAGO[activeIndex];

  return (
    <section
      id="use-case-archipelago"
      className="rounded-3xl border border-slate-800 bg-slate-900/75 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
            <Compass className="h-4 w-4" />
            3D FORM ARCHIPELAGO FLYTHROUGH · 10 PRODUCTION USE CASES
          </div>
          <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            Form Archipelago — 10 Islands, One FormConfig Kernel
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Fly between 10 real-world industry scenarios — each powered by a working <code className="font-mono text-teal-300">@form-os/react</code> runtime.
          </p>
        </div>

        {/* Camera Waypoint Stepper */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous Island"
            onClick={() =>
              setActiveIndex(
                (i) => (i - 1 + USE_CASE_ARCHIPELAGO.length) % USE_CASE_ARCHIPELAGO.length
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-300 hover:border-teal-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-teal-300 px-2">
            ISLAND {String(activeIsland.index).padStart(2, '0')} / 10 · coords ({activeIsland.coordinates.x},{' '}
            {activeIsland.coordinates.y}, {activeIsland.coordinates.z})
          </span>
          <button
            type="button"
            aria-label="Next Island"
            onClick={() =>
              setActiveIndex((i) => (i + 1) % USE_CASE_ARCHIPELAGO.length)
            }
            className="rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-300 hover:border-teal-400 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Spatial Archipelago Map Strip */}
      <div
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5"
        style={{ perspective: '900px' }}
      >
        {USE_CASE_ARCHIPELAGO.map((island, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={island.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={{
                transform: isCurrent
                  ? 'translateZ(16px) scale(1.02)'
                  : 'translateZ(0px)',
              }}
              className={`rounded-xl border p-3 text-left transition-all duration-300 ${
                isCurrent
                  ? 'border-teal-400 bg-teal-950/35 text-white shadow-[0_0_25px_-8px_rgba(0,245,212,0.5)]'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-teal-400">#{String(island.index).padStart(2, '0')}</span>
                <span className="truncate max-w-[90px] text-slate-500">
                  {island.category}
                </span>
              </div>
              <div className="mt-1 line-clamp-1 text-xs font-bold">
                {island.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Island Inspection Deck */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-5 lg:col-span-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-cyan-500/15 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300">
                Island #{activeIsland.index} · {activeIsland.category}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-400">
                <Navigation className="h-3.5 w-3.5 text-teal-400" />
                {activeIsland.config.fields.length} fields
              </span>
            </div>

            <h3 className="font-display text-xl font-black text-white sm:text-2xl">
              {activeIsland.title}
            </h3>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase text-amber-300">
                Business Outcome
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                {activeIsland.businessOutcome}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase text-teal-300">
                form-os Implementation
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                {activeIsland.technicalMechanism}
              </p>
            </div>

            <pre className="max-h-56 overflow-auto rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-[11px] text-teal-100">
              {JSON.stringify(activeIsland.config, null, 2)}
            </pre>
          </div>

          {onMountConfig && (
            <button
              type="button"
              onClick={() =>
                onMountConfig(
                  structuredClone(activeIsland.config),
                  activeIsland.title
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Mount Island Config in Top Playground Cockpit
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/85 p-5 lg:col-span-6">
          <div className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
            Live Working Demo — {activeIsland.title}
          </div>
          <FormOSLiveRenderer config={activeIsland.config} />
        </div>
      </div>
    </section>
  );
}
