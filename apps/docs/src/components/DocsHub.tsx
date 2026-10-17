'use client';

import React, { useState } from 'react';
import type { FormConfig } from '@form-os/core';
import { DOCS_SECTIONS, API_REFERENCE_ENTRIES } from '../lib/docs-data';
import { DOCK_MODULES, createDockFieldConfig } from './ComponentDock';
import {
  BookOpen,
  Check,
  Copy,
  Cpu,
  FileJson,
  Layers,
  Play,
  Search,
  Terminal,
} from 'lucide-react';

export interface DocsHubProps {
  onMountConfig?: (config: FormConfig, label: string) => void;
}

const PKG_MANAGERS: Array<{ id: 'pnpm' | 'npm' | 'yarn' | 'bun'; cmd: string }> = [
  {
    id: 'pnpm',
    cmd: 'pnpm add @form-os/core @form-os/react react-hook-form @form-os/schema',
  },
  {
    id: 'npm',
    cmd: 'npm install @form-os/core @form-os/react react-hook-form @form-os/schema',
  },
  {
    id: 'yarn',
    cmd: 'yarn add @form-os/core @form-os/react react-hook-form @form-os/schema',
  },
  {
    id: 'bun',
    cmd: 'bun add @form-os/core @form-os/react react-hook-form @form-os/schema',
  },
];

export function DocsHub({ onMountConfig }: DocsHubProps) {
  const [activeSectionId, setActiveSectionId] = useState(DOCS_SECTIONS[0].id);
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>(
    'pnpm'
  );
  const [apiFilter, setApiFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSection =
    DOCS_SECTIONS.find((s) => s.id === activeSectionId) ?? DOCS_SECTIONS[0];
  const activePkgCmd =
    PKG_MANAGERS.find((p) => p.id === pkgManager)?.cmd ?? PKG_MANAGERS[0].cmd;

  const filteredApis = API_REFERENCE_ENTRIES.filter((entry) => {
    const matchesPkg = apiFilter === 'ALL' || entry.pkg === apiFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPkg && matchesQuery;
  });

  const copyText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <section id="docs-hub" className="space-y-8">
      {/* Section Header + Package Manager Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/75 p-6 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 font-mono text-xs font-bold text-teal-300">
            <BookOpen className="h-3.5 w-3.5" />
            DEVELOPER-FIRST DOCUMENTATION HUB · v1.0.0 MIT
          </div>
          <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            One Declarative Form OS. Zero Boilerplate.
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Every concept explained in plain English for product leaders first, followed by exact TypeScript contracts for engineers.
          </p>
        </div>

        {/* Copyable Install Command Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {PKG_MANAGERS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPkgManager(pm.id)}
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                    pkgManager === pm.id
                      ? 'bg-teal-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pm.id}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => copyText('install-cmd', activePkgCmd)}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-teal-300 hover:underline"
            >
              {copiedId === 'install-cmd' ? (
                <>
                  <Check className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>
          <code className="block font-mono text-xs text-teal-200">
            {activePkgCmd}
          </code>
        </div>
      </div>

      {/* Main Docs Split View: Left Sidebar + Right Interactive Guide */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar Navigation */}
        <nav
          aria-label="Documentation Sections"
          className="space-y-1.5 rounded-2xl border border-slate-800 bg-slate-900/65 p-3 lg:col-span-4"
        >
          <div className="px-2 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Architecture & Packages
          </div>
          {DOCS_SECTIONS.map((sec) => {
            const active = sec.id === activeSection.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full rounded-xl p-3 text-left transition ${
                  active
                    ? 'border border-teal-500/40 bg-teal-500/10 text-white shadow'
                    : 'border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="font-mono text-[10px] font-bold uppercase text-teal-400">
                  {sec.category}
                </div>
                <div className="mt-0.5 text-xs font-bold">{sec.title}</div>
              </button>
            );
          })}
        </nav>

        {/* Active Doc Reader + Code Block */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/75 p-6 lg:col-span-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-md bg-teal-500/15 px-2.5 py-1 font-mono text-xs font-bold text-teal-300">
                {activeSection.category}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {activeSection.codeTitle}
              </span>
            </div>

            <h3 className="mt-3 font-display text-xl font-black text-white sm:text-2xl">
              {activeSection.title}
            </h3>

            {/* Dual-Track Explanation Cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-3.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Plain-English Outcome (Product & Ops)
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {activeSection.plainEnglishSummary}
                </p>
              </div>

              <div className="rounded-xl border border-teal-500/30 bg-teal-950/15 p-3.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  Technical Contract (Engineering)
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {activeSection.developerSummary}
                </p>
              </div>
            </div>

            {/* Interactive Code Block */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                <span className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <Terminal className="h-3.5 w-3.5 text-teal-400" />
                  {activeSection.codeTitle}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyText(activeSection.id, activeSection.codeSnippet)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-200 hover:border-teal-400"
                >
                  {copiedId === activeSection.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-teal-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Snippet
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-teal-100">
                {activeSection.codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 11 Built-In Field Component Gallery (@form-os/react/fields) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
              @form-os/react/fields · 11 Built-In Tree-Shakeable Components
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              Built-In Component Gallery & Config Blueprints
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Import individually or via <code className="text-teal-300">defaultComponents</code>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOCK_MODULES.map((mod, idx) => {
            const sampleCfg = createDockFieldConfig(mod.type, idx + 1);
            return (
              <div
                key={mod.exportName}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/85 p-3.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-teal-300">
                      {`<${mod.exportName} />`}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      type: &quot;{mod.type}&quot;
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{mod.summary}</p>
                  <pre className="mt-2.5 overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-900/80 p-2 font-mono text-[10px] text-slate-300">
                    {JSON.stringify(sampleCfg, null, 2)}
                  </pre>
                </div>

                {onMountConfig && (
                  <button
                    type="button"
                    onClick={() =>
                      onMountConfig(
                        { validationMode: 'onTouched', fields: [sampleCfg] },
                        `Mounted ${mod.exportName} demo config`
                      )
                    }
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-[11px] text-teal-300 hover:border-teal-400"
                  >
                    <Play className="h-3 w-3" />
                    Test {mod.exportName} in Playground
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Searchable API Reference Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Complete v1.0.0 API Reference
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              Every Export Across @form-os/core, @form-os/react, and @form-os/schema
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                aria-label="Filter API symbols"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search API symbol..."
                className="rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 font-mono text-xs text-white"
              />
            </div>

            {(['ALL', '@form-os/core', '@form-os/react', '@form-os/schema'] as const).map(
              (pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setApiFilter(pkg)}
                  className={`rounded-lg px-2.5 py-1.5 font-mono text-xs ${
                    apiFilter === pkg
                      ? 'bg-teal-400 font-bold text-slate-950'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {pkg}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredApis.map((api) => (
            <div
              key={`${api.pkg}-${api.name}`}
              className="rounded-xl border border-slate-800 bg-slate-950/90 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-white">
                  {api.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-teal-500/15 px-2 py-0.5 font-mono text-[10px] text-teal-300">
                    {api.pkg}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    {api.kind}
                  </span>
                </div>
              </div>
              <code className="mt-2 block overflow-x-auto rounded bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-amber-300">
                {api.signature}
              </code>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {api.description}
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-slate-900/60 px-2.5 py-1.5 font-mono text-[11px] text-cyan-200">
                {api.example}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
