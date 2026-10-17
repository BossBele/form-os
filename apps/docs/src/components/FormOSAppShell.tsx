'use client';

import React, { useEffect, useState } from 'react';
import { createDefaultValues, type FormConfig } from '@form-os/core';
import { PLAYGROUND_PRESETS } from '../lib/prompt-to-config';
import type { ShellAction } from '../lib/os-shell';
import { BootSequenceBanner } from './CockpitCanvas';
import { HeroPlayground } from './HeroPlayground';
import { DependencyWiringBoard } from './DependencyWiringBoard';
import { WireItGame } from './WireItGame';
import { DocsHub } from './DocsHub';
import { UseCaseArchipelago } from './UseCaseArchipelago';
import { ComparisonSection } from './ComparisonSection';
import { PricingEngine } from './PricingEngine';
import { CommandShellModal } from './CommandShellModal';
import { KernelPanicModal } from './KernelPanicModal';
import {
  Terminal,
  Sun,
  Moon,
  Github,
  Cpu,
  Sparkles,
  Zap,
  ShieldAlert,
  BookOpen,
  Gamepad2,
  CreditCard,
  Compass,
} from 'lucide-react';

export function FormOSAppShell() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeConfig, setActiveConfig] = useState<FormConfig>(
    () => PLAYGROUND_PRESETS[0].config
  );
  const [liveValues, setLiveValues] = useState<Record<string, any>>(() =>
    createDefaultValues(PLAYGROUND_PRESETS[0].config.fields)
  );
  const [bootActive, setBootActive] = useState(false);
  const [shellOpen, setShellOpen] = useState(false);
  const [panicOpen, setPanicOpen] = useState(false);
  const [xp, setXp] = useState(150);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const earnXp = (amount: number, reason: string) => {
    setXp((prev) => prev + amount);
    setToastMessage(`+${amount} XP · ${reason}`);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Global ⌘K shortcut + Konami code listener for KERNEL PANIC Easter Egg
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShellOpen((o) => !o);
        return;
      }

      if (e.key === konamiSequence[konamiIndex]) {
        konamiIndex += 1;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          setPanicOpen(true);
          earnXp(250, 'Unlocked Konami 0xF04M_OS Kernel Panic');
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShellAction = (action: ShellAction) => {
    switch (action.type) {
      case 'BOOT_SEQUENCE':
        setShellOpen(false);
        setBootActive(true);
        break;
      case 'MOUNT_PRESET': {
        const found = PLAYGROUND_PRESETS.find((p) => p.id === action.presetId);
        if (found) {
          const clone = structuredClone(found.config);
          setActiveConfig(clone);
          setLiveValues(createDefaultValues(clone.fields));
        }
        break;
      }
      case 'SCROLL_SECTION': {
        setShellOpen(false);
        if (typeof document !== 'undefined') {
          document
            .getElementById(action.sectionId)
            ?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
      case 'SET_THEME':
        setTheme(action.theme);
        break;
      case 'KERNEL_PANIC':
        setShellOpen(false);
        setPanicOpen(true);
        break;
      default:
        break;
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className={
        isLight
          ? 'min-h-screen bg-slate-100 text-slate-950 selection:bg-teal-400 selection:text-slate-950'
          : 'dark min-h-screen bg-[#060913] text-slate-100 selection:bg-teal-400 selection:text-slate-950'
      }
    >
      {/* Ambient Neon OS Mesh Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-45"
      >
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-teal-500/20 blur-[130px]" />
        <div className="absolute top-1/3 right-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      {/* Achievement / XP Toast HUD */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl border border-teal-400 bg-slate-950/95 px-4 py-2.5 font-mono text-xs font-bold text-teal-300 shadow-[0_0_30px_rgba(0,245,212,0.4)]"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky OS System Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 font-mono text-sm font-black tracking-wider text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow">
                <Cpu className="h-4 w-4" />
              </span>
              <span>form-os</span>
              <span className="rounded border border-teal-500/40 bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-teal-300">
                v1.0.0 MIT
              </span>
            </a>

            <nav
              aria-label="Primary Navigation"
              className="hidden items-center gap-4 pl-4 font-mono text-xs text-slate-300 md:flex"
            >
              <a href="#playground-cockpit" className="hover:text-teal-300">
                Cockpit
              </a>
              <a href="#wiring-board" className="hover:text-teal-300">
                Wiring Board
              </a>
              <a
                href="#wire-it-game"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
              >
                <Gamepad2 className="h-3.5 w-3.5" /> Wire It Game
              </a>
              <a href="#docs-hub" className="hover:text-teal-300">
                Docs &amp; API
              </a>
              <a href="#use-case-archipelago" className="hover:text-teal-300">
                10 Use Cases
              </a>
              <a
                href="#pricing-engine"
                className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200"
              >
                <CreditCard className="h-3.5 w-3.5" /> Scale &amp; Sovereign
              </a>
            </nav>
          </div>

          {/* Right OS Controls: XP Badge, ⌘K Shell, Theme Toggle, Kernel Panic, GitHub */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-xs text-amber-300 sm:inline-flex">
              <Zap className="h-3.5 w-3.5" />
              {xp} XP
            </span>

            <button
              type="button"
              onClick={() => setShellOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-200 hover:border-teal-400"
            >
              <Terminal className="h-3.5 w-3.5 text-teal-400" />
              <span>Shell</span>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-teal-300">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              aria-label="Toggle dark or light theme"
              onClick={() =>
                setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
              }
              className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:border-teal-400"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-teal-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setPanicOpen(true);
                earnXp(200, 'Triggered 0xF04M_OS Kernel Panic');
              }}
              title="Trigger 0xF04M_OS Kernel Panic Mini-Game"
              className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-2 py-1.5 font-mono text-[11px] text-rose-300 hover:border-rose-400"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
            </button>

            <a
              href="https://github.com/BossBele/formsjs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-950 transition hover:bg-teal-300"
            >
              <Github className="h-3.5 w-3.5" />
              <span>BossBele/formsjs</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6">
        {/* Hero Banner */}
        <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3.5 py-1 font-mono text-xs text-teal-300">
              <span>@form-os/core</span>
              <span>·</span>
              <span>@form-os/react</span>
              <span>·</span>
              <span>@form-os/schema</span>
              <span className="text-amber-300">
                — The &ldquo;better-auth&rdquo; Equivalent for Forms
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
              <span className="bg-gradient-to-r from-white via-teal-200 to-amber-300 bg-clip-text text-transparent">
                Describe your form once. Run it anywhere.
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              A form is not markup — it’s a configuration.{' '}
              <strong className="text-white">form-os</strong> turns complex conditional workflows, validation rules, and multi-step onboarding into a portable, schema-validated JSON image that boots into real React Hook Form components in sub-millisecond time.
            </p>
          </div>

          <div className="mt-6">
            <BootSequenceBanner
              config={activeConfig}
              active={bootActive}
              onComplete={() => setBootActive(false)}
              onReplay={() => setBootActive(true)}
            />
          </div>

          {/* Interactive Split-Screen Hero & Live Playground */}
          <HeroPlayground
            config={activeConfig}
            onConfigChange={(next) => setActiveConfig(next)}
            onValuesChange={(vals) => setLiveValues(vals)}
            onEarnXp={earnXp}
          />
        </div>

        {/* Interactive Dependency Engine Wiring Board */}
        <div id="wiring-board">
          <DependencyWiringBoard
            config={activeConfig}
            values={liveValues}
            onUpdateConfig={(next) => {
              setActiveConfig(next);
              earnXp(60, 'Patched live dependency cable on Wiring Board');
            }}
          />
        </div>

        {/* Playable Tutorial Game: WIRE IT */}
        <WireItGame onEarnXp={earnXp} />

        {/* Developer-First Documentation Hub */}
        <DocsHub
          onMountConfig={(cfg, label) => {
            setActiveConfig(cfg);
            setLiveValues(createDefaultValues(cfg.fields));
            earnXp(45, label);
          }}
        />

        {/* 10 Use-Case Archipelago 3D Flythrough */}
        <UseCaseArchipelago
          onMountConfig={(cfg, title) => {
            setActiveConfig(cfg);
            setLiveValues(createDefaultValues(cfg.fields));
            earnXp(50, `Mounted Archipelago Island: ${title}`);
            if (typeof document !== 'undefined') {
              document
                .getElementById('playground-cockpit')
                ?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Mental Model, Framework Matrix & Comparisons */}
        <ComparisonSection />

        {/* Enterprise Monetization & $100M Offers Pricing Engine */}
        <PricingEngine onEarnXp={earnXp} />

        {/* Open-Source Community Contribution Callout & Footer */}
        <footer className="rounded-3xl border border-teal-500/30 bg-slate-900/90 p-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
                OPEN-SOURCE COMMUNITY · MIT LICENSED FOREVER
              </div>
              <h2 className="mt-1 font-display text-2xl font-black text-white">
                Built in the Open at BossBele/formsjs
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-300">
                Star the repository, contribute custom field adapters (Svelte, Vue, Solid, React Native), or inspect the machine-readable documentation at{' '}
                <a href="/llms.txt" className="font-mono text-teal-300 underline">
                  /llms.txt
                </a>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/BossBele/formsjs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-slate-950 hover:brightness-110"
              >
                <Github className="h-4 w-4" />
                Star BossBele/formsjs on GitHub
              </a>
              <a
                href="/llms.txt"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-xs font-bold text-slate-200 hover:border-teal-400"
              >
                <BookOpen className="h-4 w-4 text-teal-400" />
                View /llms.txt for AI Agents
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals: ⌘K Command Shell + Easter Egg KERNEL PANIC */}
      <CommandShellModal
        open={shellOpen}
        onClose={() => setShellOpen(false)}
        config={activeConfig}
        values={liveValues}
        xp={xp}
        onAction={handleShellAction}
        onEarnXp={earnXp}
      />

      <KernelPanicModal
        open={panicOpen}
        onClose={() => setPanicOpen(false)}
        onEarnXp={earnXp}
      />
    </div>
  );
}
