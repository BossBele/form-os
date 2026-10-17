import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-plus-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        os: {
          bg: 'var(--os-bg)',
          surface: 'var(--os-surface)',
          panel: 'var(--os-panel)',
          border: 'var(--os-border)',
          text: 'var(--os-text)',
          muted: 'var(--os-muted)',
          neon: '#00F5D4',
          amber: '#FFB703',
          crimson: '#FF2A85',
          cobalt: '#3B82F6',
        },
      },
      animation: {
        'pulse-fast': 'pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
