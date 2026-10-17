import React from 'react';
import { Github } from 'lucide-react';

const REPOSITORY = 'https://github.com/BossBele/formsjs';
const BASE_PATH = process.env.DOCS_BASE_PATH || '';

export function Community() {
  return (
    <section
      id="community"
      className="relative px-6 pb-32 pt-28 sm:px-10 sm:pt-36 lg:px-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-forest-fern/25 bg-forest-moss/25 p-8 sm:p-12">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            the open part
          </p>

          <h2 className="mt-6 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-forest-moonlight">
            Built in the open, and yours to change.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-[1.75] text-forest-mist">
            form-os is MIT licensed and developed in public. Bug reports, new
            field components, and adapters for other frameworks are all welcome
            — the core has no framework in it, so the work is usually smaller
            than it looks.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={REPOSITORY}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest-ember px-6 py-3 text-sm font-semibold text-forest-bark transition hover:bg-forest-marigold"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              BossBele/formsjs on GitHub
            </a>
            <a
              href={`${BASE_PATH}/llms.txt`}
              className="inline-flex items-center gap-2 rounded-full border border-forest-fern/50 px-6 py-3 text-sm font-semibold text-forest-moonlight transition hover:border-forest-marigold hover:text-forest-marigold"
            >
              Read /llms.txt
            </a>
          </div>

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-forest-mist">
            <code className="font-mono">/llms.txt</code> is this documentation in
            a form an AI assistant can read — useful when you want help writing
            a configuration without pasting half a website into a prompt.
          </p>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-forest-mist">
          <p className="font-mono">
            @form-os/core · @form-os/react · @form-os/schema — version 1.0.1
          </p>
          <p className="font-mono">MIT licensed</p>
        </footer>
      </div>
    </section>
  );
}
