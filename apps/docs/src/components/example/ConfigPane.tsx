'use client';

import React, { useState } from 'react';
import type { FormConfig } from '@form-os/core';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConfigPaneProps {
  config: FormConfig;
  className?: string;
}

export function ConfigPane({ config, className }: ConfigPaneProps) {
  const [copied, setCopied] = useState(false);
  const source = JSON.stringify(config, null, 2);

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(source);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      data-config-pane
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-2xl border border-forest-fern/25 bg-forest-bark/70',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-fern/20 px-4 py-3">
        <p className="min-w-0 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-forest-mist">
          the same form, as a file
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest-fern/40 px-3 py-1 font-mono text-[0.68rem] text-forest-mist transition hover:border-forest-marigold hover:text-forest-marigold"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" aria-hidden="true" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" aria-hidden="true" /> copy
            </>
          )}
        </button>
      </div>

      <pre className="min-h-0 flex-1 overflow-x-hidden p-4 font-mono text-[0.72rem] leading-relaxed text-forest-mist">
        {source}
      </pre>
    </div>
  );
}
