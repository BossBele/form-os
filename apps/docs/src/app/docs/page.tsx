import React from 'react';
import type { Metadata } from 'next';
import { ForestBackdrop } from '../../components/atmosphere/ForestBackdrop';
import { SiteHeader } from '../../components/SiteHeader';
import { DocsHub } from '../../components/docs/DocsHub';

export const metadata: Metadata = {
  title: 'form-os — Documentation',
  description:
    'Plain-language documentation for @form-os/core, @form-os/react and @form-os/schema — quickstart, chapters and the full v1.0.1 API surface.',
};

const NAV = [
  { href: '/#live-example', label: 'See it work' },
  { href: '/#platforms', label: 'Platforms' },
  { href: '/docs', label: 'Docs' },
  { href: '/#use-cases', label: 'Use cases' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function DocsPage() {
  return (
    <div className="relative overflow-x-hidden">
      <ForestBackdrop />

      <SiteHeader homeHref="/" items={NAV} />

      <main className="relative z-10">
        <DocsHub />
      </main>
    </div>
  );
}
