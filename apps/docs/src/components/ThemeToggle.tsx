'use client';

import React from 'react';
import { CoolThemeToggle } from './lightswind/cool-theme-toggle';

/**
 * Lightswind's theme toggle, re-themed to the forest palette. It writes the
 * choice to localStorage and flips the `dark` class, which the inline script
 * in the layout reads back before the first paint.
 */
export function ThemeToggle() {
  return <CoolThemeToggle size="md" />;
}
