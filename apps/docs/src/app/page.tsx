import React from 'react';
import { ForestBackdrop } from '../components/atmosphere/ForestBackdrop';
import { Canopy } from '../components/sections/Canopy';
import { FormOSExample } from '../components/example/FormOSExample';
import { MentalModel } from '../components/sections/MentalModel';
import { DocsHub } from '../components/docs/DocsHub';
import { UseCases } from '../components/sections/UseCases';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <ForestBackdrop />
      <main className="relative z-10">
        <Canopy />
        <FormOSExample />
        <MentalModel />
        <DocsHub />
        <UseCases />
      </main>
    </div>
  );
}
