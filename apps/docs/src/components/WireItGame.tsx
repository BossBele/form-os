'use client';

import React, { useState } from 'react';
import type { Dependency, DependencyType } from '@form-os/core';
import {
  WIRE_IT_LEVELS,
  evaluateWireItSubmission,
  buildLeaderboardScoreObject,
} from '../lib/wire-it-engine';
import {
  Gamepad2,
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Plus,
  Trash2,
  Share2,
  Lightbulb,
} from 'lucide-react';

export interface WireItGameProps {
  onEarnXp?: (amount: number, reason: string) => void;
}

export function WireItGame({ onEarnXp }: WireItGameProps) {
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const level = WIRE_IT_LEVELS[activeLevelIdx];

  const [wiredDeps, setWiredDeps] = useState<Dependency[]>([
    { name: 'country', value: 'EU', type: 'show' },
  ]);
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [basePoints, setBasePoints] = useState(150);
  const [selectedSource, setSelectedSource] = useState(
    level.sourceFields[0].name
  );
  const [selectedType, setSelectedType] = useState<DependencyType>('show');
  const [selectedValue, setSelectedValue] = useState<string>(
    String(level.sourceFields[0].sampleValues[0].value)
  );
  const [copiedCard, setCopiedCard] = useState(false);

  const evaluation = evaluateWireItSubmission(level, wiredDeps);
  const scoreCard = buildLeaderboardScoreObject({
    completedLevelIds,
    streak,
    basePoints,
  });

  const selectLevel = (idx: number) => {
    const nextLvl = WIRE_IT_LEVELS[idx];
    setActiveLevelIdx(idx);
    setWiredDeps([]);
    setSelectedSource(nextLvl.sourceFields[0].name);
    setSelectedType('show');
    setSelectedValue(String(nextLvl.sourceFields[0].sampleValues[0].value));
  };

  const addCandidateWire = () => {
    const coercedVal =
      selectedValue === 'true'
        ? true
        : selectedValue === 'false'
          ? false
          : selectedValue;
    const next = [
      ...wiredDeps,
      { name: selectedSource, type: selectedType, value: coercedVal },
    ];
    setWiredDeps(next);

    const check = evaluateWireItSubmission(level, next);
    if (check.passed && !completedLevelIds.includes(level.id)) {
      setCompletedLevelIds((prev) => [...prev, level.id]);
      setStreak((s) => s + 1);
      setBasePoints((p) => p + level.xpReward);
      onEarnXp?.(level.xpReward, `Solved Wire It Level ${level.levelNumber}: ${level.title}`);
    }
  };

  const applySolutionHint = () => {
    setWiredDeps(structuredClone(level.solutionDependencies));
    if (!completedLevelIds.includes(level.id)) {
      setCompletedLevelIds((prev) => [...prev, level.id]);
      setBasePoints((p) => p + level.xpReward);
      onEarnXp?.(level.xpReward, `Verified Wire It Level ${level.levelNumber}`);
    }
  };

  return (
    <section
      id="wire-it-game"
      className="rounded-3xl border border-teal-500/35 bg-gradient-to-b from-slate-900/95 to-slate-950 p-6 shadow-[0_0_70px_-20px_rgba(0,245,212,0.3)]"
    >
      {/* Header & Score HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 font-mono text-xs font-bold text-teal-300">
            <Gamepad2 className="h-4 w-4" />
            PLAYABLE TUTORIAL ARENA · WIRE IT
          </div>
          <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            Wire the Dependency Engine. Prove It Against Real Test Vectors.
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Every puzzle below runs your <code className="font-mono text-teal-300">Dependency[]</code> cables directly through <code className="font-mono text-teal-300">@form-os/core</code>’s <code className="font-mono text-amber-300">getFieldState(field, values)</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase text-slate-400">
              SCORE · STREAK x{streak}
            </div>
            <div className="font-mono text-xl font-black text-teal-300">
              {scoreCard.totalScore} PTS
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="font-mono text-[10px] uppercase text-slate-400">
              ENGINEER RANK
            </div>
            <div className="font-mono text-xs font-bold text-amber-300">
              {scoreCard.playerRank}
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {WIRE_IT_LEVELS.map((lvl, idx) => {
          const isSolved = completedLevelIds.includes(lvl.id);
          const isCurrent = idx === activeLevelIdx;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => selectLevel(idx)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-left font-mono text-xs transition ${
                isCurrent
                  ? 'border-teal-400 bg-teal-400/15 text-white shadow'
                  : isSolved
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-bold">0{lvl.levelNumber}</span>
              <span>{lvl.title}</span>
              {isSolved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Arena Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Scenario Brief + Wire Builder */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 lg:col-span-6">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-amber-500/15 px-2.5 py-1 font-mono text-xs font-bold text-amber-300">
              Level {level.levelNumber} · {level.difficulty} (+{level.xpReward} XP)
            </span>
            <button
              type="button"
              onClick={applySolutionHint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1 font-mono text-xs text-teal-300 hover:bg-teal-500/20"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Auto-Wire Solution
            </button>
          </div>

          <p className="text-sm font-medium leading-relaxed text-slate-200">
            {level.scenarioBrief}
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs text-slate-300">
            <div className="text-[10px] uppercase text-slate-400">
              Target Field Node to Control:
            </div>
            <div className="mt-1 text-teal-300 font-bold">
              {level.targetField.name} ({level.targetField.type}) — &ldquo;{level.targetField.label}&rdquo;
            </div>
          </div>

          {/* Wire Patcher Controls */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <select
              aria-label="Wire Source Field"
              value={selectedSource}
              onChange={(e) => {
                const nextName = e.target.value;
                setSelectedSource(nextName);
                const found = level.sourceFields.find((s) => s.name === nextName);
                if (found && found.sampleValues[0]) {
                  setSelectedValue(String(found.sampleValues[0].value));
                }
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-white"
            >
              {level.sourceFields.map((sf) => (
                <option key={sf.name} value={sf.name}>
                  src: {sf.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Wire Dependency Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DependencyType)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-teal-300"
            >
              <option value="show">show</option>
              <option value="hidden">hidden</option>
              <option value="required">required</option>
              <option value="disabled">disabled</option>
              <option value="readonly">readonly</option>
            </select>

            <input
              type="text"
              aria-label="Wire Match Value"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 font-mono text-xs text-white"
            />

            <button
              type="button"
              onClick={addCandidateWire}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-400 px-3 py-2 font-mono text-xs font-bold text-slate-950 hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" />
              Connect Wire
            </button>
          </div>

          {/* Active Candidate Wires */}
          <div className="space-y-1.5">
            <div className="font-mono text-[11px] text-slate-400">
              Patched Dependencies on <code className="text-white">{level.targetField.name}</code>:
            </div>
            {wiredDeps.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-800 p-3 font-mono text-xs text-slate-500">
                No dependency cables connected yet. Connect a wire above!
              </div>
            ) : (
              wiredDeps.map((dep, idx) => (
                <div
                  key={`${dep.name}-${dep.type}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200"
                >
                  <span>
                    <span className="text-teal-300">{`{ name: "${dep.name}", type: "${dep.type}", value: ${JSON.stringify(dep.value)} }`}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setWiredDeps((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Real-Time getFieldState() Verification Matrix & OG Score Card */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 lg:col-span-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Live @form-os/core Test Vectors
              </span>
              {evaluation.passed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  ALL VECTORS GREEN — LEVEL CLEARED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs text-amber-300">
                  <Zap className="h-3.5 w-3.5" />
                  Awaiting Valid Wiring
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {evaluation.caseResults.map((c) => (
                <div
                  key={c.vectorId}
                  className={`rounded-xl border p-3.5 ${
                    c.matched
                      ? 'border-emerald-500/40 bg-emerald-950/15'
                      : 'border-rose-500/40 bg-rose-950/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {c.label}
                    </span>
                    {c.matched ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    )}
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-slate-400">
                    actual getFieldState() →{' '}
                    <span className="text-slate-200">
                      {JSON.stringify({
                        visible: c.actualState.visible,
                        required: c.actualState.required,
                        disabled: c.actualState.disabled,
                        readonly: c.actualState.readonly,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OG Shareable Form Engineer Score Card */}
          <div className="rounded-xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-white">
                  OG Form Engineer Credential — {scoreCard.playerRank}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(scoreCard.shareableBadgeText);
                  }
                  setCopiedCard(true);
                  setTimeout(() => setCopiedCard(false), 1800);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-200 hover:bg-teal-500/25"
              >
                <Share2 className="h-3 w-3" />
                {copiedCard ? 'Copied Credential!' : 'Share Score Card'}
              </button>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-slate-400">
              {scoreCard.shareableBadgeText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
