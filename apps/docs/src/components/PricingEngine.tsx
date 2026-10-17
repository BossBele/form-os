'use client';

import React, { useState } from 'react';
import {
  PRICING_TIERS,
  BONUS_STACK,
  calculateHormoziROI,
  type PricingTierId,
} from '../lib/roi-calculator';
import {
  ShieldCheck,
  Sparkles,
  Gauge,
  Clock,
  Flame,
  Gift,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Lock,
  Award,
} from 'lucide-react';

export interface PricingEngineProps {
  onEarnXp?: (amount: number, reason: string) => void;
}

export function PricingEngine({ onEarnXp }: PricingEngineProps) {
  const [selectedTierId, setSelectedTierId] = useState<PricingTierId>('sovereign');
  const [engineersCount, setEngineersCount] = useState(14);
  const [formsPerMonth, setFormsPerMonth] = useState(8);
  const [avgConditionalFieldsPerForm, setAvgConditionalFieldsPerForm] =
    useState(12);
  const [hourlyEngineeringRate, setHourlyEngineeringRate] = useState(135);

  const selectedTier =
    PRICING_TIERS.find((t) => t.id === selectedTierId) ?? PRICING_TIERS[2];

  const roi = calculateHormoziROI({
    engineersCount,
    formsPerMonth,
    avgConditionalFieldsPerForm,
    hourlyEngineeringRate,
    tierId: selectedTierId,
  });

  return (
    <section id="pricing-engine" className="space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-500/35 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 font-mono text-xs font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              ENTERPRISE MONETIZATION · $100M GRAND SLAM OFFER ARCHITECTURE
            </div>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              MIT Open-Source Core Forever. Sovereign Infrastructure When You Scale.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Engineered strictly on Alex Hormozi’s Value Equation: we maximize your{' '}
              <strong className="text-teal-300">Dream Outcome</strong> and{' '}
              <strong className="text-teal-300">Perceived Likelihood of Achievement</strong> while driving{' '}
              <strong className="text-amber-300">Time Delay</strong> and{' '}
              <strong className="text-amber-300">Engineering Effort &amp; Sacrifice</strong> toward zero.
            </p>
          </div>

          {/* Tasteful Cohort Scarcity Badge */}
          <div className="rounded-2xl border border-amber-500/40 bg-slate-950/90 p-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Flame className="h-4 w-4 text-amber-400" />
              Q4 DFY MIGRATION COHORT STATUS
            </div>
            <p className="mt-1 text-slate-300">
              4 of 10 <strong className="text-white">Done-For-You</strong> engineering migration slots remaining this month.
            </p>
          </div>
        </div>
      </div>

      {/* Physical 4-Lever Value Equation Machine */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-teal-300">
              <Gauge className="h-4 w-4" />
              Interactive Value-Equation Telemetry Machine
            </span>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              Inspect How Each Tier Moves the 4 Hormozi Value Levers
            </h3>
          </div>

          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1">
            {PRICING_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  setSelectedTierId(tier.id);
                  onEarnXp?.(25, `Inspected ${tier.name} Value Equation levers`);
                }}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                  selectedTierId === tier.id
                    ? 'bg-teal-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Physical Levers Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-teal-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>NUMERATOR LEVER 01</span>
              <span className="font-bold text-teal-300">MAXIMIZE ↑</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold text-white">
              Dream Outcome
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-500"
                style={{ width: `${roi.valueEquation.dreamOutcome}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-xl font-black text-teal-300">
              {roi.valueEquation.dreamOutcome} / 100
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {selectedTier.dreamOutcome}
            </p>
          </div>

          <div className="rounded-2xl border border-teal-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>NUMERATOR LEVER 02</span>
              <span className="font-bold text-teal-300">MAXIMIZE ↑</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold text-white">
              Perceived Likelihood
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300 transition-all duration-500"
                style={{ width: `${roi.valueEquation.perceivedLikelihood}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-xl font-black text-emerald-300">
              {roi.valueEquation.perceivedLikelihood}% Certainty
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {selectedTier.perceivedLikelihood}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>DENOMINATOR LEVER 03</span>
              <span className="font-bold text-amber-300">MINIMIZE ↓</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold text-white">
              Time Delay
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${Math.max(8, roi.valueEquation.timeDelayDays * 40)}%`,
                }}
              />
            </div>
            <div className="mt-2 font-mono text-xl font-black text-amber-300">
              {selectedTierId === 'sovereign'
                ? '< 2h Engineer / < 48h Prod'
                : selectedTierId === 'scale'
                  ? 'Instant NPM (< 5m)'
                  : '< 15 min Setup'}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {selectedTier.timeDelayAndEffort}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>DENOMINATOR LEVER 04</span>
              <span className="font-bold text-amber-300">MINIMIZE ↓</span>
            </div>
            <div className="mt-1 font-display text-lg font-bold text-white">
              Effort &amp; Sacrifice
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-rose-400 transition-all duration-500"
                style={{ width: `${Math.max(6, roi.valueEquation.effortScore)}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-xl font-black text-rose-300">
              {roi.valueEquation.effortScore}% Friction Index
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {selectedTier.effortAndSacrifice}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards: Open Source (MIT), Form-OS Scale, Form-OS Sovereign */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PRICING_TIERS.map((tier) => {
          const isSovereign = tier.id === 'sovereign';
          const isScale = tier.id === 'scale';
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`flex cursor-pointer flex-col justify-between rounded-3xl border p-6 transition-all ${
                isSovereign
                  ? 'border-amber-400/70 bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/20 shadow-[0_0_55px_-15px_rgba(255,183,3,0.35)]'
                  : isScale
                    ? 'border-teal-400/70 bg-gradient-to-b from-slate-900 via-slate-950 to-teal-950/20 shadow-[0_0_55px_-15px_rgba(0,245,212,0.3)]'
                    : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-teal-300">
                    {tier.targetAudience}
                  </span>
                  {tier.badge && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold ${
                        isSovereign
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-teal-400 text-slate-950'
                      }`}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-2xl font-black text-white">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-400">{tier.magicSubtitle}</p>

                <div className="mt-4 flex items-baseline gap-2 border-b border-slate-800 pb-4">
                  <span className="font-display text-4xl font-black text-white">
                    {tier.priceLabel}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {tier.billingCadence}
                  </span>
                </div>

                {/* Explicit Hormozi Value Equation Breakdown per Tier */}
                <div className="mt-4 space-y-2.5 rounded-2xl border border-slate-800/90 bg-slate-950/80 p-3.5 text-xs">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-teal-300">
                      Dream Outcome:
                    </span>
                    <p className="text-slate-200">{tier.dreamOutcome}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-cyan-300">
                      Perceived Likelihood:
                    </span>
                    <p className="text-slate-200">{tier.perceivedLikelihood}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-300">
                      Time Delay &amp; Effort:
                    </span>
                    <p className="text-slate-200">{tier.timeDelayAndEffort}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-rose-300">
                      Effort &amp; Sacrifice Eliminated:
                    </span>
                    <p className="text-slate-200">{tier.effortAndSacrifice}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={tier.ctaHref}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-mono text-xs font-extrabold uppercase tracking-wider transition ${
                  isSovereign
                    ? 'bg-amber-400 text-slate-950 hover:brightness-110'
                    : isScale
                      ? 'bg-teal-400 text-slate-950 hover:brightness-110'
                      : 'border border-slate-700 bg-slate-950 text-white hover:border-teal-400'
                }`}
              >
                <span>{tier.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Itemized Value Bonus Stack + Unconditional/Conditional Guarantee */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/75 p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-300">
              <Gift className="h-4 w-4" />
              ITEMIZED BONUS STACK ($48,500 TOTAL ANCHORED VALUE)
            </span>
            <span className="font-mono text-xs text-teal-300">
              Included Free in Sovereign
            </span>
          </div>

          <div className="space-y-2.5">
            {BONUS_STACK.map((bonus) => (
              <div
                key={bonus.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {bonus.title}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    ${bonus.anchoredValueUsd.toLocaleString()} Value
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-amber-300">
                  {bonus.problemSolved}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {bonus.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Adoption & Engineering Hours Saved ROI Calculator */}
        <div
          id="enterprise-Calculator"
          className="flex flex-col justify-between rounded-3xl border border-teal-500/40 bg-slate-900/85 p-6 lg:col-span-5"
        >
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-teal-300">
              <Calculator className="h-4 w-4" />
              Interactive Adoption &amp; Engineering Hours Saved Calculator
            </div>
            <h3 className="mt-1 font-display text-xl font-black text-white">
              Quantify Your Monthly Engineering Hours Reclaimed
            </h3>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-mono text-slate-300">
                  <label htmlFor="roi-devs">Frontend / Full-Stack Engineers</label>
                  <span className="text-teal-300 font-bold">{engineersCount} devs</span>
                </div>
                <input
                  id="roi-devs"
                  type="range"
                  min={2}
                  max={100}
                  value={engineersCount}
                  onChange={(e) => setEngineersCount(Number(e.target.value))}
                  className="mt-1 w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300">
                  <label htmlFor="roi-forms">New or Modified Forms / Month</label>
                  <span className="text-teal-300 font-bold">{formsPerMonth} forms/mo</span>
                </div>
                <input
                  id="roi-forms"
                  type="range"
                  min={1}
                  max={40}
                  value={formsPerMonth}
                  onChange={(e) => setFormsPerMonth(Number(e.target.value))}
                  className="mt-1 w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300">
                  <label htmlFor="roi-cond">Avg Conditional Fields per Form</label>
                  <span className="text-teal-300 font-bold">
                    {avgConditionalFieldsPerForm} fields
                  </span>
                </div>
                <input
                  id="roi-cond"
                  type="range"
                  min={2}
                  max={35}
                  value={avgConditionalFieldsPerForm}
                  onChange={(e) =>
                    setAvgConditionalFieldsPerForm(Number(e.target.value))
                  }
                  className="mt-1 w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300">
                  <label htmlFor="roi-rate">Fully-Loaded Engineering Hourly Rate</label>
                  <span className="text-teal-300 font-bold">
                    ${hourlyEngineeringRate}/hr
                  </span>
                </div>
                <input
                  id="roi-rate"
                  type="range"
                  min={60}
                  max={250}
                  step={5}
                  value={hourlyEngineeringRate}
                  onChange={(e) =>
                    setHourlyEngineeringRate(Number(e.target.value))
                  }
                  className="mt-1 w-full accent-teal-400"
                />
              </div>
            </div>

            {/* Output Telemetry Cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-teal-500/40 bg-slate-950 p-3.5">
                <div className="font-mono text-[10px] uppercase text-slate-400">
                  Monthly Engineering Hours Saved
                </div>
                <div className="mt-1 font-mono text-2xl font-black text-teal-300">
                  {roi.monthlyHoursSaved} hrs/mo
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  {roi.speedupMultiplier}x faster form delivery
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-slate-950 p-3.5">
                <div className="font-mono text-[10px] uppercase text-slate-400">
                  Annual Engineering Savings
                </div>
                <div className="mt-1 font-mono text-2xl font-black text-amber-300">
                  ${roi.annualDollarsSaved.toLocaleString()}/yr
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  +${roi.totalStackedBonusUsd.toLocaleString()} bonus stack
                </div>
              </div>
            </div>
          </div>

          {/* Ironclad Guarantee Box */}
          <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-300">
              <Award className="h-4 w-4" />
              THE DOUBLE IRONCLAD MIGRATION GUARANTEE
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">
              1. <strong>Done-For-You Legacy Rewrite:</strong> Our engineers migrate your legacy Typeform, Jotform, or Formik schemas into validated <code className="font-mono text-teal-300">@form-os/schema</code> configs free of charge.
              <br />
              2. <strong>48-Hour Deployment SLA:</strong> If you aren’t live in production within 48 hours on Sovereign, your first 90 days are 100% free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
