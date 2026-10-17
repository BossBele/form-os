import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export interface SiteNavItem {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  homeHref: string;
  items: SiteNavItem[];
}

export function SiteHeader({ homeHref, items }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-6 pb-6 pt-4 backdrop-blur-[2px] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="font-display text-base font-semibold tracking-[-0.01em] text-forest-moonlight"
        >
          form-os
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="Sections"
            className="hidden items-center gap-1 md:flex"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-forest-mist transition hover:text-forest-marigold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
