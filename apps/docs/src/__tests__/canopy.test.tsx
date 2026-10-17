import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Canopy } from '../components/sections/Canopy';
import { MoonOrb, MoonOrbVisual, supportsWebGL } from '../components/atmosphere/MoonOrb';

describe('Task 3: Canopy', () => {
  it('states what form-os is in plain words and offers exactly two actions', () => {
    const html = renderToString(
      <Canopy onJumpToExample={() => {}} onJumpToDocs={() => {}} />
    );
    expect(html).toContain('Describe your form once');
    expect(html).toContain('Run it anywhere');
    expect(html).toContain('See it work');
    expect(html).toContain('Read the docs');
    expect((html.match(/data-hero-cta/g) ?? []).length).toBe(2);
  });

  it('never describes the product in operating-system terms', () => {
    const html = renderToString(
      <Canopy onJumpToExample={() => {}} onJumpToDocs={() => {}} />
    );
    expect(html.toLowerCase()).not.toMatch(
      /\bkernel\b|\bcockpit\b|\bterminal\b|operating system/
    );
  });

  it('renders no orb markup on the server, so a WebGL-less client loses nothing', () => {
    expect(renderToString(<MoonOrb />)).toBe('');
  });

  it('detects a missing WebGL context instead of throwing', () => {
    expect(supportsWebGL()).toBe(false);
  });

  it('cannot swallow clicks with its decorative canvas', () => {
    const html = renderToString(<MoonOrbVisual />);
    expect(html).toContain('!pointer-events-none');
  });

  it('hides the decorative orb from assistive technology', () => {
    const html = renderToString(<Canopy />);
    expect(html).toMatch(
      /aria-hidden="true"[^>]*data-decorative-orb|data-decorative-orb[^>]*aria-hidden="true"/
    );
  });
});
