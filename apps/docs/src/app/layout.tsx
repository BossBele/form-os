import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import 'lightswind/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'form-os — Describe your form once. Run it anywhere.',
  description:
    'An open-source, config-driven form library for JavaScript and TypeScript. @form-os/core, @form-os/react, @form-os/schema.',
  openGraph: {
    title: 'form-os — Describe your form once. Run it anywhere.',
    description:
      'Turn complex conditional forms into a portable, schema-validated configuration that renders anywhere.',
    url: 'https://github.com/BossBele/formsjs',
    siteName: 'form-os',
    type: 'website',
  },
};

/**
 * Font stacks live on <html> so every descendant inherits them and so the
 * wiring is inspectable in the served markup. Loaded from Google Fonts via
 * <link> rather than next/font, which cannot resolve under Vitest and emits
 * hashed class names instead of the variable names.
 */
const FONT_VARIABLES = {
  '--font-fraunces': "'Fraunces', ui-serif, Georgia, 'Times New Roman', serif",
  '--font-instrument':
    "'Instrument Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  '--font-plex-mono':
    "'IBM Plex Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
} as CSSProperties;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={FONT_VARIABLES}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=IBM+Plex+Mono:wght@400;600&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-forest-bark font-sans text-forest-moonlight antialiased">
        {children}
      </body>
    </html>
  );
}
