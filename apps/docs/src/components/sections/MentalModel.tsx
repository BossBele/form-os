import React from 'react';

interface Piece {
  name: string;
  role: string;
  gloss: string;
}

const PIECES: Piece[] = [
  {
    name: 'FormConfig',
    role: 'the form itself',
    gloss:
      'A plain file listing the fields, the rules, and the conditions. Readable by anyone, reviewable in a pull request, storable anywhere.',
  },
  {
    name: '@form-os/schema',
    role: 'the contract',
    gloss:
      'Checks that a configuration is well formed before anything tries to render it — which is what lets a form be written by a tool, an API, or a person.',
  },
  {
    name: '@form-os/core',
    role: 'the rules',
    gloss:
      'Answers one question, quickly and identically everywhere: what should this field be doing right now, given what has been filled in so far?',
  },
  {
    name: '@form-os/react',
    role: 'the picture',
    gloss:
      'Takes those answers and draws real inputs on the screen, wired into react-hook-form and yours to style however you like.',
  },
];

export function MentalModel() {
  return (
    <section
      id="mental-model"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-forest-moonlight">
            A form is not markup.
            <span className="block text-forest-marigold">
              It is a configuration.
            </span>
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-forest-mist">
            Once a form is a file rather than a pile of components, everything
            else follows. You can version it, diff it, generate it, check it
            before it ever reaches a browser, and hand it to a colleague who
            does not write code. These four pieces are the whole system.
          </p>
        </div>

        <ol className="relative mt-20 grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* The path between the pieces — a dotted trail, not an arrow chain. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[0.4rem] top-2 hidden h-[calc(100%-1rem)] border-l border-dashed border-forest-marigold/25 lg:left-0 lg:top-[0.4rem] lg:h-px lg:w-full lg:border-l-0 lg:border-t"
          />

          {PIECES.map((piece, index) => (
            <li key={piece.name} className="relative min-w-0 pl-8 lg:pl-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.35rem] h-2 w-2 rounded-full bg-forest-marigold lg:static lg:block"
              />
              <div className="lg:mt-6">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-forest-mist">
                  {String(index + 1).padStart(2, '0')} · {piece.role}
                </p>
                <h3 className="mt-2 min-w-0 break-words font-display text-xl font-semibold text-forest-moonlight">
                  {piece.name}
                </h3>
                <p className="mt-3 min-w-0 break-words text-sm leading-relaxed text-forest-mist">
                  {piece.gloss}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
