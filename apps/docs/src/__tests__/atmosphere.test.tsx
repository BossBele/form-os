import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { ForestBackdrop, setForestScroll } from '../components/atmosphere/ForestBackdrop';
import { Fireflies } from '../components/atmosphere/Fireflies';
import { FoliageLayers } from '../components/atmosphere/FoliageLayers';
import { useReducedMotion } from '../components/atmosphere/useReducedMotion';

describe('Task 2: Atmosphere', () => {
  it('is inert to assistive technology and never blocks pointer input', () => {
    const html = renderToString(<ForestBackdrop />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('pointer-events-none');
    expect(html).toContain('fixed');
  });

  it('renders the requested number of fireflies as an ordered, stable set', () => {
    const html = renderToString(<Fireflies count={12} />);
    const matches = html.match(/data-firefly/g) ?? [];
    expect(matches.length).toBe(12);
  });

  it('renders the requested foliage depth', () => {
    const html = renderToString(<FoliageLayers depth={4} />);
    const matches = html.match(/data-foliage-layer/g) ?? [];
    expect(matches.length).toBe(4);
  });

  it('reads reduced-motion safely on the server instead of touching matchMedia during render', () => {
    function Probe() {
      return <span data-probe>{String(useReducedMotion())}</span>;
    }
    const html = renderToString(<Probe />);
    expect(html).toContain('data-probe');
    expect(html).toContain('>false<');
  });

  it('collapses every animation and transition globally for reduced-motion visitors', () => {
    const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toContain('animation-duration: 0.01ms !important');
    expect(css).toContain('transition-duration: 0.01ms !important');
  });

  it('drives foliage parallax from a scroll offset that something actually sets', () => {
    const target = {
      style: {
        store: {} as Record<string, string>,
        setProperty(key: string, value: string) {
          this.store[key] = value;
        },
      },
    };
    setForestScroll(target as never, 800);
    expect(target.style.store['--forest-scroll']).toBe('-800px');
    expect(renderToString(<FoliageLayers depth={3} />)).toContain(
      'var(--forest-scroll'
    );
  });
});
