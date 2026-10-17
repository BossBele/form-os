'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language: 'ts' | 'tsx' | 'bash' | 'json';
  title?: string;
}

/**
 * A deliberately small highlighter. It splits on one combined pattern and
 * wraps matches in spans — no library, and nothing is ever injected as HTML,
 * so a code sample cannot escape its own block.
 */
const TOKEN_SOURCE = [
  '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
  '(`(?:[^`\\\\]|\\\\.)*`|\'(?:[^\'\\\\]|\\\\.)*\'|"(?:[^"\\\\]|\\\\.)*")',
  '\\b(const|let|function|return|import|from|export|type|interface|if|else|null|true|false|await|async|new|as|of|in|extends|default|throw|try|catch)\\b',
  '\\b(\\d+(?:\\.\\d+)?)\\b',
].join('|');

const CLASSES = [
  'text-forest-mist/45 italic',
  'text-forest-marigold',
  'text-forest-ember',
  'text-forest-sprout',
];

function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(TOKEN_SOURCE, 'g');
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > cursor) {
      nodes.push(code.slice(cursor, match.index));
    }
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    nodes.push(
      <span key={key++} className={CLASSES[groupIndex] ?? undefined}>
        {match[0]}
      </span>
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < code.length) nodes.push(code.slice(cursor));
  return nodes;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-forest-fern/25 bg-forest-bark/80">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-fern/20 px-4 py-2.5">
        <span className="min-w-0 break-words font-mono text-[0.68rem] uppercase tracking-[0.16em] text-forest-mist">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : `Copy ${title ?? language} snippet`}
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
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[0.75rem] leading-relaxed text-forest-moonlight">
        <code>{highlight(code)}</code>
      </pre>
    </figure>
  );
}
