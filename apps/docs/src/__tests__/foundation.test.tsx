import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FOREST_PALETTE } from '../lib/forest';
import RootLayout from '../app/layout';

describe('Task 1: Foundation', () => {
  it('exposes the exact ember-dusk palette', () => {
    expect(FOREST_PALETTE).toEqual({
      bark: '#17120D',
      moss: '#261F17',
      fern: '#8C7557',
      ember: '#E8662B',
      marigold: '#F2B03D',
      amethyst: '#B25E4A',
      moonlight: '#F6F1E4',
      mist: '#B7A996',
      parchment: '#F7F3E8',
      mossInk: '#1E1710',
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
