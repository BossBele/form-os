'use client';

import React, { useState } from 'react';
import type { FormConfig } from '@form-os/core';
import {
  executeShellCommand,
  type ShellAction,
} from '../lib/os-shell';
import { Terminal, X, CornerDownLeft, Sparkles } from 'lucide-react';

export interface CommandShellModalProps {
  open: boolean;
  onClose: () => void;
  config: FormConfig;
  values: Record<string, any>;
  xp: number;
  onAction: (action: ShellAction) => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

const QUICK_COMMANDS = [
  'help',
  'ls fields',
  'inspect vatNumber',
  'schema',
  'mount hipaa',
  'mount treasury',
  'wire',
  'boot',
  'panic',
];

export function CommandShellModal({
  open,
  onClose,
  config,
  values,
  xp,
  onAction,
  onEarnXp,
}: CommandShellModalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'form-os kernel v1.0.0 — interactive system shell ready.',
    'Type "help" or click a quick syscall below (try "ls fields", "inspect vatNumber", or "panic").',
  ]);

  if (!open) return null;

  const runCmd = (raw: string) => {
    const res = executeShellCommand(raw, { config, values, xp });
    if (res.action?.type === 'CLEAR_TERMINAL') {
      setHistory([]);
      return;
    }
    setHistory((prev) => [...prev, `$ ${raw}`, ...res.lines]);
    if (res.xpDelta) {
      onEarnXp?.(res.xpDelta, `Executed kernel syscall: ${raw}`);
    }
    if (res.action) {
      onAction(res.action);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="form-os Command Shell"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 pt-16 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-teal-400/50 bg-slate-950 font-mono text-xs text-slate-100 shadow-[0_0_80px_-10px_rgba(0,245,212,0.4)]">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
          <div className="flex items-center gap-2 text-teal-300">
            <Terminal className="h-4 w-4" />
            <span className="font-bold">form-os kernel v1.0.0 — ⌘K System Shell</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-2 py-1 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Syscall Buttons */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 bg-slate-900/40 px-4 py-2.5">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => runCmd(cmd)}
              className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-teal-300 hover:border-teal-400"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Ring Buffer Output */}
        <div className="max-h-72 min-h-[220px] space-y-1 overflow-y-auto p-4 text-xs leading-relaxed">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={
                line.startsWith('$')
                  ? 'font-bold text-amber-300 mt-2'
                  : 'text-slate-300 whitespace-pre-wrap'
              }
            >
              {line}
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            runCmd(input);
            setInput('');
          }}
          className="flex items-center border-t border-slate-800 bg-slate-900/80 px-4 py-2.5"
        >
          <span className="mr-2 font-bold text-teal-400">root@form-os:~#</span>
          <input
            type="text"
            aria-label="Kernel shell command input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type help, ls fields, inspect vatNumber, mount hipaa, panic..."
            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded bg-teal-400 px-2.5 py-1 text-[11px] font-bold text-slate-950"
          >
            Run <CornerDownLeft className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
