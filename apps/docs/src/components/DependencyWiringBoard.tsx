'use client';

import React, { useState } from 'react';
import {
  getFieldState,
  type DependencyType,
  type FormConfig,
} from '@form-os/core';
import { Cable, Cpu, Plus, Trash2, Zap } from 'lucide-react';

export interface DependencyWiringBoardProps {
  config: FormConfig;
  values: Record<string, any>;
  onUpdateConfig: (nextConfig: FormConfig) => void;
}

const DEP_COLORS: Record<DependencyType, string> = {
  show: '#00F5D4',
  hidden: '#F43F5E',
  required: '#FFB703',
  disabled: '#FB7185',
  readonly: '#38BDF8',
};

export function DependencyWiringBoard({
  config,
  values,
  onUpdateConfig,
}: DependencyWiringBoardProps) {
  const [sourceField, setSourceField] = useState(
    config.fields[0]?.name ?? 'jurisdiction'
  );
  const [targetField, setTargetField] = useState(
    config.fields[2]?.name ?? config.fields[1]?.name ?? 'vatNumber'
  );
  const [depType, setDepType] = useState<DependencyType>('show');
  const [matchValue, setMatchValue] = useState<string>('EU');

  const allWires = config.fields.flatMap((field, targetIdx) =>
    (field.dependencies ?? []).map((dep, depIdx) => {
      const sourceIdx = config.fields.findIndex((f) => f.name === dep.name);
      const isSignalHigh = values[dep.name] === dep.value;
      return {
        id: `${field.name}-${dep.name}-${dep.type}-${depIdx}`,
        sourceName: dep.name,
        targetName: field.name,
        sourceIdx: sourceIdx >= 0 ? sourceIdx : 0,
        targetIdx,
        depIdx,
        type: dep.type,
        expectedValue: dep.value,
        liveValue: values[dep.name],
        isSignalHigh,
      };
    })
  );

  const handlePatchCable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceField || !targetField || sourceField === targetField) return;
    const coercedVal =
      matchValue === 'true'
        ? true
        : matchValue === 'false'
          ? false
          : matchValue;

    const nextFields = config.fields.map((f) => {
      if (f.name !== targetField) return f;
      return {
        ...f,
        dependencies: [
          ...(f.dependencies ?? []),
          { name: sourceField, type: depType, value: coercedVal },
        ],
      };
    });
    onUpdateConfig({ ...config, fields: nextFields });
  };

  const removeWire = (targetFieldName: string, depIndex: number) => {
    const nextFields = config.fields.map((f) => {
      if (f.name !== targetFieldName) return f;
      return {
        ...f,
        dependencies: (f.dependencies ?? []).filter((_, i) => i !== depIndex),
      };
    });
    onUpdateConfig({ ...config, fields: nextFields });
  };

  const svgHeight = Math.max(260, config.fields.length * 52 + 24);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
            <Cable className="h-4 w-4" />
            Interactive Dependency Patchbay — Live getFieldState() Signal Bus
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Every cable below represents a declarative <code className="font-mono text-teal-300">Dependency</code> object. Multiple dependencies of the same type evaluate with strict <code className="font-mono text-amber-300">AND</code> semantics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-[10px]">
          {(['show', 'hidden', 'required', 'disabled', 'readonly'] as DependencyType[]).map(
            (t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DEP_COLORS[t] }}
                />
                {t}
              </span>
            )
          )}
        </div>
      </div>

      {/* Visual SVG Patchbay */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3">
        <svg
          viewBox={`0 0 780 ${svgHeight}`}
          className="w-full min-w-[640px]"
          role="img"
          aria-label="Dependency engine wiring diagram"
        >
          {/* Animated Signal Cables */}
          {allWires.map((wire, idx) => {
            const y1 = 36 + wire.sourceIdx * 48;
            const y2 = 36 + wire.targetIdx * 48;
            const color = DEP_COLORS[wire.type] ?? '#00F5D4';
            const pathD = `M 230 ${y1} C 390 ${y1}, 390 ${y2}, 545 ${y2}`;

            return (
              <g key={wire.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth={wire.isSignalHigh ? 3 : 1.5}
                  strokeOpacity={wire.isSignalHigh ? 0.95 : 0.35}
                  strokeDasharray={wire.isSignalHigh ? 'none' : '5 5'}
                />
                <rect
                  x={330 + (idx % 2) * 30}
                  y={(y1 + y2) / 2 - 10}
                  width={118}
                  height={20}
                  rx={6}
                  fill="#090D16"
                  stroke={color}
                  strokeWidth={1}
                />
                <text
                  x={389 + (idx % 2) * 30}
                  y={(y1 + y2) / 2 + 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {wire.type} == {String(wire.expectedValue)}
                </text>
              </g>
            );
          })}

          {/* Left Column: Source Ports & Right Column: Target Field State Gates */}
          {config.fields.map((field, idx) => {
            const y = 18 + idx * 48;
            const state = getFieldState(field, values);
            const val = values[field.name] ?? state.defaultValue;

            return (
              <g key={field.name}>
                {/* Source Port Node */}
                <rect
                  x={14}
                  y={y}
                  width={215}
                  height={36}
                  rx={8}
                  fill="#0F172A"
                  stroke="#334155"
                />
                <text
                  x={26}
                  y={y + 15}
                  fill="#F8FAFC"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {field.name}
                </text>
                <text
                  x={26}
                  y={y + 28}
                  fill="#94A3B8"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  val: {JSON.stringify(val).slice(0, 22)}
                </text>
                <circle cx={229} cy={y + 18} r={5} fill="#00F5D4" />

                {/* Target Evaluated Node */}
                <circle
                  cx={546}
                  cy={y + 18}
                  r={5}
                  fill={state.visible ? '#00F5D4' : '#475569'}
                />
                <rect
                  x={546}
                  y={y}
                  width={220}
                  height={36}
                  rx={8}
                  fill={state.visible ? '#0F172A' : '#090D16'}
                  stroke={state.visible ? '#00F5D4' : '#1E293B'}
                  strokeOpacity={state.visible ? 0.65 : 0.4}
                />
                <text
                  x={558}
                  y={y + 15}
                  fill={state.visible ? '#F8FAFC' : '#64748B'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {field.name}
                </text>
                <text
                  x={558}
                  y={y + 28}
                  fill={state.visible ? '#2DD4BF' : '#64748B'}
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  vis:{String(state.visible)} req:{String(state.required)} dis:{String(state.disabled)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Cable Patcher Bar */}
      <form
        onSubmit={handlePatchCable}
        className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-3 sm:grid-cols-5"
      >
        <select
          aria-label="Source Field"
          value={sourceField}
          onChange={(e) => setSourceField(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-slate-100"
        >
          {config.fields.map((f) => (
            <option key={f.name} value={f.name}>
              from: {f.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Dependency Gate Type"
          value={depType}
          onChange={(e) => setDepType(e.target.value as DependencyType)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-teal-300"
        >
          <option value="show">type: show</option>
          <option value="hidden">type: hidden</option>
          <option value="required">type: required</option>
          <option value="disabled">type: disabled</option>
          <option value="readonly">type: readonly</option>
        </select>

        <input
          type="text"
          aria-label="Expected Value"
          value={matchValue}
          onChange={(e) => setMatchValue(e.target.value)}
          placeholder="Match value (e.g. EU, true)"
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-slate-100"
        />

        <select
          aria-label="Target Dependent Field"
          value={targetField}
          onChange={(e) => setTargetField(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-slate-100"
        >
          {config.fields.map((f) => (
            <option key={f.name} value={f.name}>
              to: {f.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-400 px-3 py-2 font-mono text-xs font-bold text-slate-950 hover:brightness-110"
        >
          <Plus className="h-3.5 w-3.5" />
          Patch Cable
        </button>
      </form>

      {/* Active Wires Pill Strip */}
      {allWires.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {allWires.map((w) => (
            <span
              key={w.id}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] ${
                w.isSignalHigh
                  ? 'border-teal-500/50 bg-teal-500/15 text-teal-200'
                  : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}
            >
              <Zap className="h-3 w-3 text-teal-400" />
              {w.sourceName} == {JSON.stringify(w.expectedValue)} → {w.targetName} [{w.type}]
              <button
                type="button"
                aria-label={`Remove wire ${w.id}`}
                onClick={() => removeWire(w.targetName, w.depIdx)}
                className="ml-1 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
