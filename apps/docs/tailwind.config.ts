import path from 'node:path';
import type { Config } from 'tailwindcss';
import lightswindPlugin from 'lightswind/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    path.join(__dirname, './src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, './src/lib/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-instrument)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        forest: {
          bark: 'rgb(var(--bark) / <alpha-value>)',
          moss: 'rgb(var(--moss) / <alpha-value>)',
          fern: 'rgb(var(--fern) / <alpha-value>)',
          ember: 'rgb(var(--ember) / <alpha-value>)',
          marigold: 'rgb(var(--marigold) / <alpha-value>)',
          amethyst: 'rgb(var(--amethyst) / <alpha-value>)',
          moonlight: 'rgb(var(--moonlight) / <alpha-value>)',
          mist: 'rgb(var(--mist) / <alpha-value>)',
          sprout: 'rgb(var(--sprout) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [lightswindPlugin({ effect3d: true })],
};

export default config;
