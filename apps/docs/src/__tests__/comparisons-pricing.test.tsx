import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { COMPARISON_ROWS } from '../lib/comparison';
import { PRICING_TIERS } from '../lib/pricing';
import { Comparisons } from '../components/sections/Comparisons';
import { Pricing } from '../components/sections/Pricing';

describe('Task 8: Comparisons and pricing', () => {
  it('compares against three real alternatives without disparaging them', () => {
    const alternatives = new Set(
      COMPARISON_ROWS.map((row) => row.alternativeName)
    );
    expect([...alternatives].sort()).toEqual([
      'Hosted form builders',
      'JSON Forms',
      'react-hook-form',
    ]);
    for (const row of COMPARISON_ROWS) {
      expect(row.formOs.length).toBeGreaterThan(10);
      expect(row.alternative.length).toBeGreaterThan(10);
    }
  });

  it('states plainly that react-hook-form is a foundation, not a rival', () => {
    const html = renderToString(<Comparisons />);
    expect(html).toContain('react-hook-form');
    expect(html.toLowerCase()).toContain('built on');
  });

  it('states plainly that the core is MIT and free forever', () => {
    const html = renderToString(<Pricing />);
    expect(html).toContain('MIT');
    expect(html.toLowerCase()).toContain('free');
  });

  it('carries all three tiers with concrete guarantees', () => {
    expect(PRICING_TIERS.map((tier) => tier.id)).toEqual([
      'open-source',
      'scale',
      'sovereign',
    ]);
    for (const tier of PRICING_TIERS) {
      expect(tier.features.length).toBeGreaterThanOrEqual(3);
      expect(tier.guarantee.length).toBeGreaterThan(30);
      expect(tier.dream.length).toBeGreaterThan(30);
    }
    const html = renderToString(<Pricing />);
    expect(html).toContain('Form-OS Scale');
    expect(html).toContain('Form-OS Sovereign');
  });

  it('keeps the free tier visually equal rather than diminished', () => {
    const html = renderToString(<Pricing />);
    expect(html).toContain('data-tier="open-source"');
    expect(html).toContain('data-tier="scale"');
    expect(html).toContain('data-tier="sovereign"');
  });

  it('renders both sections with their anchor ids', () => {
    expect(renderToString(<Comparisons />)).toContain('id="comparisons"');
    expect(renderToString(<Pricing />)).toContain('id="pricing"');
  });
});
