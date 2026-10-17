import React from 'react';
import { API_ENTRIES, ROADMAP_ENTRIES } from '../../lib/docs-content';

export function ApiReference() {
  const packages = Array.from(new Set(API_ENTRIES.map((entry) => entry.pkg)));

  return (
    <section
      id="api-reference"
      className="min-w-0 scroll-mt-28 border-t border-forest-fern/15 pt-14"
    >
      <h3 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.01em] text-forest-moonlight">
        API reference
      </h3>
      <p className="mt-4 max-w-[46rem] text-base leading-relaxed text-forest-mist">
        Every export in version 1.0.1, with the signature it actually has. If
        something is not listed here, it does not exist yet.
      </p>

      {packages.map((pkg) => (
        <div key={pkg} className="mt-12 min-w-0">
          <h4 className="font-mono text-sm tracking-[0.06em] text-forest-marigold">
            {pkg}
          </h4>

          <dl className="mt-5 space-y-6">
            {API_ENTRIES.filter((entry) => entry.pkg === pkg).map((entry) => (
              <div
                key={entry.name}
                className="min-w-0 rounded-2xl border border-forest-fern/20 bg-forest-moss/20 p-5"
              >
                <dt className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="min-w-0 break-words font-display text-lg font-semibold text-forest-moonlight">
                    {entry.name}
                  </span>
                  <span className="shrink-0 rounded-full border border-forest-fern/35 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-forest-mist">
                    {entry.kind}
                  </span>
                </dt>

                <dd className="mt-3 min-w-0">
                  <code className="block overflow-x-auto rounded-lg bg-forest-bark/70 px-3 py-2 font-mono text-[0.72rem] text-forest-marigold/90">
                    {entry.signature}
                  </code>

                  <p className="mt-3 break-words text-sm leading-relaxed text-forest-mist">
                    {entry.description}
                  </p>

                  <pre className="mt-3 overflow-x-auto rounded-lg bg-forest-bark/50 px-3 py-2 font-mono text-[0.72rem] leading-relaxed text-forest-sprout">
                    {entry.example}
                  </pre>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <div className="mt-12 min-w-0 rounded-2xl border border-dashed border-forest-fern/30 p-5">
        <h4 className="font-mono text-sm tracking-[0.06em] text-forest-mist">
          Not built yet
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-forest-mist">
          These adapters are planned, not shipped. They are listed so nobody
          spends an afternoon looking for them.
        </p>
        <dl className="mt-5 space-y-4">
          {ROADMAP_ENTRIES.map((entry) => (
            <div key={entry.pkg} className="min-w-0">
              <dt className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="min-w-0 break-words font-mono text-sm text-forest-moonlight">
                  {entry.pkg}
                </span>
                <span className="shrink-0 rounded-full border border-forest-marigold/40 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-forest-marigold">
                  {entry.status}
                </span>
              </dt>
              <dd className="mt-1.5 break-words text-sm leading-relaxed text-forest-mist">
                {entry.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
