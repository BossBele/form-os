import React from 'react';
import { ForestBackdrop } from '../components/atmosphere/ForestBackdrop';
import { ThemeToggle } from '../components/ThemeToggle';
import { Canopy } from '../components/sections/Canopy';
import { FormOSExample } from '../components/example/FormOSExample';
import { MentalModel } from '../components/sections/MentalModel';
import { DocsHub } from '../components/docs/DocsHub';
import { UseCases } from '../components/sections/UseCases';
import { Comparisons } from '../components/sections/Comparisons';
import { Pricing } from '../components/sections/Pricing';
import { Community } from '../components/sections/Community';

const NAV = [
  { href: '#live-example', label: 'See it work' },
  { href: '#docs-hub', label: 'Docs' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#pricing', label: 'Pricing' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <ForestBackdrop />

      <header className="fixed inset-x-0 top-0 z-30 px-6 py-4 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a
            href="#canopy"
            className="font-display text-base font-semibold tracking-[-0.01em] text-forest-moonlight"
          >
            form-os
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav
              aria-label="Sections"
              className="hidden items-center gap-1 md:flex"
            >
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm text-forest-mist transition hover:text-forest-marigold"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Canopy />
        <FormOSExample />
        <MentalModel />
        <DocsHub />
        <UseCases />
        <Comparisons />
        <Pricing />
        <Community />
      </main>
    </div>
  );
}
