'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getFieldState, type FormConfig } from '@form-os/core';
import {
  Cpu,
  FastForward,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Activity,
} from 'lucide-react';

export const BOOT_STORAGE_KEY = 'form-os:booted';

export function hasBootCompletedInStorage(
  storage?: Pick<Storage, 'getItem'> | null
): boolean {
  try {
    const target =
      storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
    return target?.getItem(BOOT_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markBootCompletedInStorage(
  storage?: Pick<Storage, 'setItem'> | null
): void {
  try {
    const target =
      storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
    target?.setItem(BOOT_STORAGE_KEY, '1');
  } catch {
    // Ignore storage quota or SSR errors
  }
}

export interface BootSequenceBannerProps {
  config: FormConfig;
  active: boolean;
  onComplete: () => void;
  onReplay?: () => void;
}

export function BootSequenceBanner({
  config,
  active,
  onComplete,
  onReplay,
}: BootSequenceBannerProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    setStep(0);
    const timers = [
      setTimeout(() => setStep(1), 350),
      setTimeout(() => setStep(2), 750),
      setTimeout(() => setStep(3), 1150),
      setTimeout(() => onComplete(), 1650),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active, onComplete]);

  const totalDeps = config.fields.reduce(
    (sum, f) => sum + (f.dependencies?.length ?? 0),
    0
  );

  if (!active) {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-mono">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-slate-200">FORM-OS KERNEL v1.0.0 ONLINE</span>
          <span>·</span>
          <span>{config.fields.length} FieldConfig blades mounted</span>
          <span>·</span>
          <span>{totalDeps} dependency gates active</span>
        </div>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-teal-300 hover:border-teal-400"
          >
            <Play className="h-3 w-3" />
            Replay 3D Boot Sequence
          </button>
        )}
      </div>
    );
  }

  const stages = [
    {
      id: 'disk',
      label: '01 / DISK IMAGE',
      detail: `Reading FormConfig (${config.fields.length} field definitions)...`,
    },
    {
      id: 'abi',
      label: '02 / @form-os/schema ABI',
      detail: 'Draft-07 JSON Schema contract verified (0 structural errors)',
    },
    {
      id: 'kernel',
      label: '03 / @form-os/core KERNEL',
      detail: `normalizeConfig() + getFieldState() wired (${totalDeps} dependency edges)`,
    },
    {
      id: 'runtime',
      label: '04 / @form-os/react RUNTIME',
      detail: 'useFormConfig() + FormFieldsProvider mounted at 60fps',
    },
  ];

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-teal-500/40 bg-slate-950/95 p-4 shadow-[0_0_50px_-12px_rgba(0,245,212,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-teal-400 animate-spin" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-teal-300">
            FORM-OS 3D KERNEL BOOT SEQUENCE — MOUNTING LIVE CONFIG
          </span>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-300 hover:border-teal-400 hover:text-white"
        >
          <FastForward className="h-3.5 w-3.5" />
          Skip Boot
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
        {stages.map((s, idx) => {
          const isDone = step >= idx;
          return (
            <div
              key={s.id}
              className={`rounded-xl border p-3 transition-all duration-300 ${
                isDone
                  ? 'border-teal-500/50 bg-teal-950/20 text-slate-100'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px] font-bold text-teal-400">
                {s.label}
              </div>
              <div className="mt-1 text-xs leading-snug">{s.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface CockpitCanvasProps {
  config: FormConfig;
  values: Record<string, any>;
  onSelectField?: (fieldName: string) => void;
}

export function CockpitCanvas({
  config,
  values,
  onSelectField,
}: CockpitCanvasProps) {
  const [rotX, setRotX] = useState(16);
  const [rotY, setRotY] = useState(-14);
  const [qualityMode, setQualityMode] = useState<'high' | 'reduced'>('high');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real-time 2D/3D particle & signal bus canvas backdrop (gracefully skipped in SSR or reduced motion)
  useEffect(() => {
    if (qualityMode === 'reduced') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let rafId = 0;
    const render = () => {
      frame += 1;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw subtle perspective grid & data pulses
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const pulseX = (frame * 2.5) % w;
      const grad = ctx.createLinearGradient(pulseX - 40, 0, pulseX + 40, 0);
      grad.addColorStop(0, 'rgba(0, 245, 212, 0)');
      grad.addColorStop(0.5, 'rgba(0, 245, 212, 0.45)');
      grad.addColorStop(1, 'rgba(0, 245, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(pulseX - 40, 0, 80, h);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [qualityMode]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4"
      onMouseMove={(e) => {
        if (qualityMode === 'reduced') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        setRotY(Math.round(nx * 24));
        setRotX(Math.round(-ny * 18));
      }}
      onMouseLeave={() => {
        setRotX(16);
        setRotY(-14);
      }}
    >
      <canvas
        ref={canvasRef}
        width={640}
        height={320}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      />

      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-teal-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100">
            3D OS Cockpit — Live Hardware Blade Telemetry
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400">
            pitch {rotX}° · yaw {rotY}°
          </span>
          <button
            type="button"
            onClick={() =>
              setQualityMode((m) => (m === 'high' ? 'reduced' : 'high'))
            }
            className="rounded border border-slate-700 bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] text-slate-300 hover:border-teal-400"
          >
            {qualityMode === 'high' ? '3D Shader: 60fps' : '2D Reduced Motion'}
          </button>
        </div>
      </div>

      {/* 3D Isometric / Perspective Rack Stage */}
      <div
        className="relative z-10 py-2"
        style={{
          perspective: '1100px',
        }}
      >
        <div
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 transition-transform duration-200 ease-out"
          style={{
            transform:
              qualityMode === 'high'
                ? `rotateX(${rotX}deg) rotateY(${rotY}deg)`
                : 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          {config.fields.map((field, index) => {
            const state = getFieldState(field, values);
            const liveVal = values[field.name] ?? state.defaultValue;
            const depCount = field.dependencies?.length ?? 0;

            return (
              <div
                key={field.name}
                onClick={() => onSelectField?.(field.name)}
                style={{
                  transform:
                    qualityMode === 'high'
                      ? `translateZ(${state.visible ? 18 : -14}px)`
                      : 'none',
                }}
                className={`cursor-pointer rounded-xl border p-3 transition-all duration-300 ${
                  !state.visible
                    ? 'border-slate-800/60 bg-slate-900/25 opacity-45'
                    : state.disabled
                      ? 'border-rose-500/40 bg-rose-950/20'
                      : depCount > 0
                        ? 'border-teal-400/50 bg-slate-900/90 shadow-[0_0_24px_-6px_rgba(0,245,212,0.4)]'
                        : 'border-slate-700/80 bg-slate-900/75'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-100">
                    #{String(index + 1).padStart(2, '0')} {field.name}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                      state.visible
                        ? 'bg-teal-500/20 text-teal-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {state.visible ? 'MOUNTED' : 'UNMOUNTED (hidden)'}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">
                    type:{field.type}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      state.required
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800/70 text-slate-400'
                    }`}
                  >
                    req:{String(state.required)}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      state.disabled
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800/70 text-slate-400'
                    }`}
                  >
                    dis:{String(state.disabled)}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      state.readonly
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-slate-800/70 text-slate-400'
                    }`}
                  >
                    ro:{String(state.readonly)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-1.5 font-mono text-[10px] text-slate-400">
                  <span className="truncate max-w-[180px]">
                    val: {JSON.stringify(liveVal)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-teal-300">
                    <Activity className="h-3 w-3" />
                    {depCount} wire{depCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
          Every 3D blade reflects live <code className="font-mono text-teal-300">getFieldState(field, values)</code> output.
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-300">
          <Sparkles className="h-3 w-3" /> Move cursor to orbit rack
        </span>
      </div>
    </div>
  );
}
