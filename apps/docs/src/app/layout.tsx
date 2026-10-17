import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'form-os — Describe your form once. Run it anywhere.',
  description:
    'The open-source Form OS for JavaScript & TypeScript (@form-os/core, @form-os/react, @form-os/schema). The better-auth equivalent for declarative, config-driven forms.',
  openGraph: {
    title: 'form-os — The Open-Source Form Operating System',
    description:
      'Declarative FormConfig kernel, deterministic dependency engine, React Hook Form bindings, and portable JSON Schema ABI.',
    url: 'https://github.com/BossBele/formsjs',
    siteName: 'form-os',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
        />
      </head>
      <body className="bg-[#060913] font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
