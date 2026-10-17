import React from 'react';
import { DOC_CHAPTERS } from '../../lib/docs-content';
import { DocChapter } from './DocChapter';
import { ApiReference } from './ApiReference';

const INSTALL_COMMAND = 'pnpm add @form-os/core @form-os/react react-hook-form';

export function DocsHub() {
  return (
    <section
      id="docs-hub"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            documentation
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-forest-moonlight">
            Written for the person who has to maintain it.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-forest-mist">
            Plain language first, then the code that does it. Everything below
            describes version 1.0.0 as it actually is.
          </p>

          <div className="mt-8 min-w-0 rounded-2xl border border-forest-fern/25 bg-forest-bark/70 px-4 py-3">
            <code className="block overflow-x-auto font-mono text-[0.78rem] text-forest-marigold">
              {INSTALL_COMMAND}
            </code>
          </div>
        </header>

        <div className="mt-20 grid gap-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20">
          <nav
            aria-label="Documentation chapters"
            className="min-w-0 lg:sticky lg:top-24 lg:self-start"
          >
            <ol className="space-y-2.5">
              {DOC_CHAPTERS.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#chapter-${chapter.id}`}
                    className="block min-w-0 break-words rounded-lg px-3 py-2 text-sm text-forest-mist transition hover:bg-forest-moss/40 hover:text-forest-marigold"
                  >
                    {chapter.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#api-reference"
                  className="block min-w-0 break-words rounded-lg px-3 py-2 text-sm text-forest-mist transition hover:bg-forest-moss/40 hover:text-forest-marigold"
                >
                  API reference
                </a>
              </li>
            </ol>
          </nav>

          <div className="min-w-0 space-y-14">
            {DOC_CHAPTERS.map((chapter) => (
              <DocChapter key={chapter.id} chapter={chapter} />
            ))}
            <ApiReference />
          </div>
        </div>
      </div>
    </section>
  );
}
