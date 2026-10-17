'use client';

import React from 'react';
import { PRICING_TIERS } from '../../lib/pricing';
import { ScrollReveal } from '../lightswind/scroll-reveal';

const VALUE_LEVERS = [
  { key: 'dream', label: 'what you get' },
  { key: 'likelihood', label: 'why you can believe it' },
  { key: 'timeDelay', label: 'how soon' },
  { key: 'effort', label: 'what you stop doing' },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            pricing
          </p>
          <ScrollReveal
            size="xl"
            align="left"
            threshold={0.15}
            textClassName="font-display tracking-[-0.02em] text-forest-moonlight"
          >
            Free where it should be. Paid where it saves you work.
          </ScrollReveal>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-forest-mist">
            The library is MIT licensed and always will be — everything you need
            to build is in the free package. The paid tiers exist for the work
            around the library: hosting, analytics, compliance, and the
            migration nobody wants to do by hand.
          </p>
        </header>

        <div className="mt-20 grid min-w-0 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              data-tier={tier.id}
              className="flex min-w-0 flex-col justify-between rounded-3xl border border-forest-fern/25 bg-forest-moss/25 p-6"
            >
              <div className="min-w-0">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-forest-mist">
                  {tier.audience}
                </p>
                <h3 className="mt-3 min-w-0 break-words font-display text-2xl font-semibold text-forest-moonlight">
                  {tier.name}
                </h3>

                <p className="mt-5 flex min-w-0 flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-4xl font-semibold text-forest-marigold">
                    {tier.price}
                  </span>
                  <span className="font-mono text-xs text-forest-mist">
                    {tier.cadence}
                  </span>
                </p>

                <dl className="mt-7 space-y-3.5">
                  {VALUE_LEVERS.map((lever) => (
                    <div key={lever.key} className="min-w-0">
                      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-forest-fern">
                        {lever.label}
                      </dt>
                      <dd className="mt-1 break-words text-sm leading-relaxed text-forest-mist">
                        {tier[lever.key]}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-7 space-y-2.5 border-t border-forest-fern/20 pt-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex min-w-0 gap-2.5 text-sm leading-relaxed text-forest-mist"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-forest-marigold"
                      />
                      <span className="min-w-0 break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 min-w-0 rounded-2xl border border-forest-marigold/30 bg-forest-bark/50 p-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-forest-marigold">
                  the guarantee
                </p>
                <p className="mt-2 break-words text-sm leading-relaxed text-forest-mist">
                  {tier.guarantee}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-forest-mist">
          There is no per-response pricing on any tier, and no ceiling on how
          many forms you build.
        </p>
      </div>
    </section>
  );
}
