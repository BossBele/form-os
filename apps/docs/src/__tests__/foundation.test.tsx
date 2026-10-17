import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FOREST_PALETTE } from '../lib/forest';
import RootLayout from '../app/layout';

describe('Task 1: Foundation', () => {
  it('exposes the exact dusk-forest palette', () => {
    expect(FOREST_PALETTE).toEqual({
      bark: '#0C1512',
      moss: '#16302A',
      fern: '#2F6B4F',
      ember: '#E07A3F',
      marigold: '#F2B03D',
      amethyst: '#7B4B8A',
      moonlight: '#E9F2E6',
      mist: '#8FA99B',
      parchment: '#F7F3E8',
      mossInk: '#16241D',
    });
  });

  it('renders the document in dusk-dark by default with the three forest fonts wired', () => {
    const html = renderToString(
      <RootLayout>
        <main>canopy</main>
      </RootLayout>
    );
    expect(html).toContain('lang="en"');
    expect(html).toContain('--font-fraunces');
    expect(html).toContain('--font-instrument');
    expect(html).toContain('--font-plex-mono');
    expect(html).toContain('canopy');
  });
});
