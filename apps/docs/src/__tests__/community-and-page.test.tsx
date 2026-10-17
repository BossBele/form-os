import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import HomePage from '../app/page';
import DocsPage from '../app/docs/page';
import { ThemeToggle } from '../components/ThemeToggle';
import { Community } from '../components/sections/Community';

const SECTION_IDS = [
  'canopy',
  'live-example',
  'mental-model',
  'use-cases',
  'comparisons',
  'pricing',
  'community',
];

describe('Task 9: Community and the assembled page', () => {
  it('points to the real repository and the machine-readable docs', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('https://github.com/BossBele/formsjs');
    expect(html).toContain('/llms.txt');
  });

  it('assembles all seven sections in the order the spec fixes', () => {
    const html = renderToString(<HomePage />);
    let cursor = -1;
    for (const id of SECTION_IDS) {
      const at = html.indexOf(`id="${id}"`);
      expect(at, `missing section #${id}`).toBeGreaterThan(-1);
      expect(at, `section #${id} out of order`).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it('moves the documentation hub onto its own route, linked from the landing page', () => {
    const landing = renderToString(<HomePage />);
    expect(landing).not.toContain('id="docs-hub"');
    expect(landing).toContain('href="/docs"');

    const docs = renderToString(<DocsPage />);
    expect(docs).toContain('id="docs-hub"');
    expect(docs).toContain('href="#chapter-quickstart"');
    expect(docs).toContain('href="/"');
  });

  it('serves the headline, the mental model and the pricing tiers in server HTML with no JavaScript', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('Describe your form once');
    expect(html).toContain('A form is not markup');
    expect(html).toContain('Form-OS Sovereign');
  });

  it('contains no horizontal-overflow escape hatches on the page shell', () => {
    expect(renderToString(<HomePage />)).toContain('overflow-x-hidden');
  });

  it('carries no cyan or teal utility classes anywhere in the rendered tree', () => {
    const html = renderToString(<HomePage />);
    expect(html).not.toMatch(/-(cyan|teal|sky|slate|zinc)-[0-9]{2,3}/);
  });

  it('marks every decorative full-bleed layer so a 320px viewport cannot scroll sideways', () => {
    const html = renderToString(<HomePage />);
    expect((html.match(/data-full-bleed/g) ?? []).length).toBeGreaterThan(0);
    expect(html).toContain('overflow-x-hidden');
    expect(html).toContain('pointer-events-none');
  });

  it('gives the theme toggle a real button with an accessible name, before it is ever hydrated', () => {
    const html = renderToString(<ThemeToggle />);
    expect(html).toContain('<button');
    expect(html).toMatch(/aria-label="[^"]+"/);
  });

  it('applies a stored theme before first paint so there is no flash of the wrong one', () => {
    const layout = readFileSync(
      new URL('../app/layout.tsx', import.meta.url),
      'utf8'
    );
    expect(layout).toContain('localStorage');
    expect(layout).toContain('dangerouslySetInnerHTML');
    expect(layout).toContain('daybreak');
  });

  it('names the repository in the community section', () => {
    const html = renderToString(<Community />);
    expect(html).toContain('id="community"');
    expect(html).toContain('BossBele/formsjs');
  });

  it('gives the fixed header a scrim so nav text stays readable over content', () => {
    const html = renderToString(<HomePage />);
    expect(html).toMatch(/<header[\s\S]{0,600}?(backdrop-blur|from-forest-bark)/);
  });
});
