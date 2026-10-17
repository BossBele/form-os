import React from 'react';
import { ALTERNATIVE_NOTES, COMPARISON_ROWS } from '../../lib/comparison';

export function Comparisons() {
  return (
    <section
      id="comparisons"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            an honest comparison
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-forest-moonlight">
            What this is, and what it is not.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-forest-mist">
            form-os is not the first attempt at this, and the alternatives are
            not bad software. Most of them are very good at a slightly different
            job. Here is the difference, stated fairly.
          </p>
        </header>

        <dl className="mt-20 space-y-12">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.capability}
              className="min-w-0 border-t border-forest-fern/15 pt-8"
            >
              <dt className="font-display text-xl font-semibold text-forest-moonlight sm:text-2xl">
                {row.capability}
              </dt>
              <dd className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-8">
                <p className="min-w-0 break-words text-sm leading-[1.75] text-forest-mist">
                  <span className="mb-1.5 block font-mono text-[0.64rem] uppercase tracking-[0.18em] text-forest-marigold">
                    form-os
                  </span>
                  {row.formOs}
                </p>
                <p className="min-w-0 break-words text-sm leading-[1.75] text-forest-mist">
                  <span className="mb-1.5 block font-mono text-[0.64rem] uppercase tracking-[0.18em] text-forest-mist">
                    {row.alternativeName}
                  </span>
                  {row.alternative}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid min-w-0 gap-4 sm:grid-cols-3">
          {ALTERNATIVE_NOTES.map((note) => (
            <div
              key={note.name}
              className="min-w-0 rounded-2xl border border-forest-fern/20 bg-forest-moss/20 p-4"
            >
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-forest-marigold">
                {note.name}
              </p>
              <p className="mt-2 break-words text-sm leading-relaxed text-forest-mist">
                {note.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
