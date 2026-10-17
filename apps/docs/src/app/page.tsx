import React from 'react';
import { ForestBackdrop } from '../components/atmosphere/ForestBackdrop';
import { SiteHeader } from '../components/SiteHeader';
import { Canopy } from '../components/sections/Canopy';
import { FormOSExample } from '../components/example/FormOSExample';
import { MentalModel } from '../components/sections/MentalModel';
import { Platforms } from '../components/sections/Platforms';
import { UseCases } from '../components/sections/UseCases';
import { Comparisons } from '../components/sections/Comparisons';
import { Pricing } from '../components/sections/Pricing';
import { Community } from '../components/sections/Community';

const NAV = [
  { href: '#live-example', label: 'See it work' },
  { href: '#platforms', label: 'Platforms' },
  { href: '/docs', label: 'Docs' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#pricing', label: 'Pricing' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <ForestBackdrop />

      <SiteHeader homeHref="#canopy" items={NAV} />

      <main className="relative z-10">
        <Canopy />
        <FormOSExample />
        <MentalModel />
        <Platforms />
        <UseCases />
        <Comparisons />
        <Pricing />
        <Community />
      </main>
    </div>
  );
}
