'use client';

import React, { useEffect, useState } from 'react';
import {
  createDefaultValues,
  type DependencyType,
  type FieldConfig,
  type FormConfig,
} from '@form-os/core';
import {
  PLAYGROUND_PRESETS,
  generateConfigFromPrompt,
  generateTypeScriptSnippet,
} from '../lib/prompt-to-config';
import { validateFormConfigSchema } from '../lib/schema-validator';
import { FormOSLiveRenderer } from './FormRenderer';
import { ComponentDock, createDockFieldConfig } from './ComponentDock';
import { CockpitCanvas } from './CockpitCanvas';
import {
  Code2,
  Sliders,
  Sparkles,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  Cpu,
  Eye,
} from 'lucide-react';

export interface HeroPlaygroundProps {
  config: FormConfig;
  onConfigChange: (nextConfig: FormConfig) => void;
  onValuesChange?: (values: Record<string, any>) => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

export function HeroPlayground({
  config,
  onConfigChange,
  onValuesChange,
  onEarnXp,
}: HeroPlaygroundProps) {
  const [promptText, setPromptText] = useState(
    'Describe a complex multi-step KYC onboarding form with EU VAT conditional logic, PEP disclosures, and beneficial owner verification...'
  );
  const [viewMode, setViewMode] = useState<'developer' | 'business'>('developer');
  const [devTab, setDevTab] = useState<'json' | 'typescript'>('json');
  const [rightTab, setRightTab] = useState<'preview' | 'cockpit'>('preview');
  const [jsonDraft, setJsonDraft] = useState(() =>
    JSON.stringify(config, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [compilerBanner, setCompilerBanner] = useState<string>(
    'Mounted image: Multi-Step KYC & AML Onboarding (9 fields, 6 active dependency rules)'
  );
  const [liveValues, setLiveValues] = useState<Record<string, any>>(() =>
    createDefaultValues(config.fields)
  );

  useEffect(() => {
    setJsonDraft(JSON.stringify(config, null, 2));
    setJsonError(null);
    setLiveValues(createDefaultValues(config.fields));
  }, [config]);

  const schemaValidation = validateFormConfigSchema(config);
  const tsCode = generateTypeScriptSnippet(config);

  const applyNewConfig = (nextConfig: FormConfig, bannerMessage?: string) => {
    onConfigChange(nextConfig);
    setJsonDraft(JSON.stringify(nextConfig, null, 2));
    setJsonError(null);
    const defaults = createDefaultValues(nextConfig.fields);
    setLiveValues(defaults);
    onValuesChange?.(defaults);
    if (bannerMessage) {
      setCompilerBanner(bannerMessage);
    }
  };

  const handlePromptGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = generateConfigFromPrompt(promptText);
    applyNewConfig(res.config, res.explanation);
    onEarnXp?.(75, 'Compiled natural-language prompt to FormConfig');
  };

  const handleJsonEdit = (nextRaw: string) => {
    setJsonDraft(nextRaw);
    try {
      const parsed = JSON.parse(nextRaw);
      const check = validateFormConfigSchema(parsed);
      if (!check.valid) {
        setJsonError(check.errors[0] ?? 'Schema validation error');
        return;
      }
      setJsonError(null);
      onConfigChange(parsed as FormConfig);
    } catch (err: any) {
      setJsonError(err?.message ?? 'Invalid JSON syntax');
    }
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= config.fields.length) return;
    const nextFields = [...config.fields];
    const [moved] = nextFields.splice(index, 1);
    nextFields.splice(target, 0, moved);
    applyNewConfig({ ...config, fields: nextFields });
    onEarnXp?.(20, 'Reordered field module in Business View');
  };

  const removeField = (index: number) => {
    if (config.fields.length <= 1) return;
    const nextFields = config.fields.filter((_, i) => i !== index);
    applyNewConfig({ ...config, fields: nextFields });
  };

  const toggleFieldRequired = (index: number) => {
    const nextFields = config.fields.map((f, i) => {
      if (i !== index) return f;
      const isReq = !!f.rules?.required;
      return {
        ...f,
        rules: {
          ...f.rules,
          required: isReq ? false : `${f.label ?? f.name} is required`,
        },
      };
    });
    applyNewConfig({ ...config, fields: nextFields });
  };

  const addQuickDependency = (
    fieldIndex: number,
    sourceName: string,
    depType: DependencyType,
    expectedVal: any
  ) => {
    const nextFields = config.fields.map((f, i) => {
      if (i !== fieldIndex) return f;
      const existing = f.dependencies ?? [];
      return {
        ...f,
        dependencies: [
          ...existing,
          { name: sourceName, value: expectedVal, type: depType },
        ],
      };
    });
    applyNewConfig({ ...config, fields: nextFields });
    onEarnXp?.(50, `Wired ${depType} dependency rule`);
  };

  const handleCopyCode = () => {
    const textToCopy = devTab === 'json' ? jsonDraft : tsCode;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="playground-cockpit" className="relative">
      {/* Plain-English Prompt Compiler Bar */}
      <div className="mb-6 rounded-2xl border border-teal-500/30 bg-slate-900/80 p-4 shadow-[0_0_60px_-15px_rgba(0,245,212,0.25)] backdrop-blur-md">
        <form
          onSubmit={handlePromptGenerate}
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <Wand2 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-teal-400" />
            <input
              type="text"
              aria-label="Describe a complex multi-step KYC onboarding form"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe a complex multi-step KYC onboarding form..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg shadow-teal-500/20 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Compile Prompt → FormConfig
          </button>
        </form>

        {/* Preset Scenario Pills */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] text-slate-400 mr-1">
              Mount Preset Image:
            </span>
            {PLAYGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setPromptText(preset.prompt);
                  applyNewConfig(
                    structuredClone(preset.config),
                    `Mounted preset "${preset.title}" (${preset.config.fields.length} fields)`
                  );
                  onEarnXp?.(30, `Mounted ${preset.title}`);
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/90 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition hover:border-teal-400/60 hover:text-teal-300"
              >
                {preset.title}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] text-teal-300">
            {compilerBanner}
          </span>
        </div>
      </div>

      {/* Split-Screen Interactive Hero & Live Playground */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Instant Toggle between Developer View & Business View */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/75 p-4 lg:col-span-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            {/* Developer View vs Business View Switcher */}
            <div
              role="tablist"
              aria-label="Builder View Mode"
              className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'developer'}
                onClick={() => setViewMode('developer')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'developer'
                    ? 'bg-teal-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                Developer View
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'business'}
                onClick={() => setViewMode('business')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'business'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Business View
              </button>
            </div>

            {/* @form-os/schema Live ABI Badge */}
            <div className="flex items-center gap-2">
              {schemaValidation.valid && !jsonError ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 font-mono text-[11px] text-teal-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  @form-os/schema VALID ({schemaValidation.fieldCount} fields ·{' '}
                  {schemaValidation.dependencyCount} deps)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {jsonError ?? schemaValidation.errors[0]}
                </span>
              )}
            </div>
          </div>

          {viewMode === 'developer' ? (
            <div className="flex flex-1 flex-col">
              <div className="mb-2 flex items-center justify-between">
                <div className="inline-flex gap-1 rounded-lg bg-slate-950 p-1">
                  <button
                    type="button"
                    onClick={() => setDevTab('json')}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs ${
                      devTab === 'json'
                        ? 'bg-slate-800 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    form-config.json (@form-os/schema)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevTab('typescript')}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs ${
                      devTab === 'typescript'
                        ? 'bg-slate-800 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    FormView.tsx (@form-os/react)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-300 hover:border-teal-400 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-teal-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {devTab === 'json' ? (
                <textarea
                  aria-label="Editable FormConfig JSON"
                  value={jsonDraft}
                  onChange={(e) => handleJsonEdit(e.target.value)}
                  spellCheck={false}
                  className="min-h-[460px] w-full flex-1 rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-teal-100 focus:border-teal-400 focus:outline-none"
                />
              ) : (
                <pre className="min-h-[460px] w-full flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-cyan-200">
                  {tsCode}
                </pre>
              )}
            </div>
          ) : (
            <div
              className="flex flex-1 flex-col gap-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedType = e.dataTransfer.getData('text/plain') || 'text';
                const nextField = createDockFieldConfig(
                  droppedType,
                  config.fields.length + 1
                );
                applyNewConfig({
                  ...config,
                  fields: [...config.fields, nextField],
                });
                onEarnXp?.(45, `Dropped ${droppedType} module into form`);
              }}
            >
              <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {config.fields.map((field, idx) => (
                  <div
                    key={field.name}
                    className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/90 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {field.label ?? field.name}
                        </span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-teal-300">
                          {field.type}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-slate-400">
                        key: <span className="text-slate-200">{field.name}</span> ·{' '}
                        {field.dependencies?.length ?? 0} dependency rules
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleFieldRequired(idx)}
                        className={`rounded px-2 py-1 font-mono text-[10px] font-semibold ${
                          field.rules?.required
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {field.rules?.required ? 'Required ✓' : '+ Required'}
                      </button>

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            addQuickDependency(
                              idx,
                              config.fields[0].name,
                              'show',
                              config.fields[0].defaultValue || 'EU'
                            )
                          }
                          className="rounded border border-teal-500/30 bg-teal-500/10 px-2 py-1 font-mono text-[10px] text-teal-300 hover:bg-teal-500/20"
                        >
                          + Wire Show Rule
                        </button>
                      )}

                      <button
                        type="button"
                        aria-label={`Move ${field.name} up`}
                        onClick={() => moveField(idx, -1)}
                        className="rounded border border-slate-800 bg-slate-900 p-1 text-slate-400 hover:text-white"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${field.name} down`}
                        onClick={() => moveField(idx, 1)}
                        className="rounded border border-slate-800 bg-slate-900 p-1 text-slate-400 hover:text-white"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${field.name}`}
                        onClick={() => removeField(idx)}
                        className="rounded border border-slate-800 bg-slate-900 p-1 text-rose-400 hover:bg-rose-950"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <ComponentDock
                existingFieldCount={config.fields.length}
                onAddField={(newField: FieldConfig) => {
                  applyNewConfig({
                    ...config,
                    fields: [...config.fields, newField],
                  });
                  onEarnXp?.(40, `Docked ${newField.type} module`);
                }}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Working Form Preview (@form-os/react) + 3D Cockpit */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/75 p-4 lg:col-span-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_10px_#00F5D4]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Live @form-os/react Runtime Preview
              </span>
            </div>

            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setRightTab('preview')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs ${
                  rightTab === 'preview'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Form UI
              </button>
              <button
                type="button"
                onClick={() => setRightTab('cockpit')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs ${
                  rightTab === 'cockpit'
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                3D Cockpit Rack
              </button>
            </div>
          </div>

          {rightTab === 'preview' ? (
            <FormOSLiveRenderer
              config={config}
              onValuesChange={(vals) => {
                setLiveValues(vals);
                onValuesChange?.(vals);
              }}
              onSubmitSuccess={() =>
                onEarnXp?.(100, 'Validated and committed live FormConfig state')
              }
            />
          ) : (
            <CockpitCanvas config={config} values={liveValues} />
          )}
        </div>
      </div>
    </section>
  );
}
