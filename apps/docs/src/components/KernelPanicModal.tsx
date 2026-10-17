'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertOctagon, Play, RotateCcw, Trophy, X } from 'lucide-react';

export interface KernelPanicModalProps {
  open: boolean;
  onClose: () => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

interface FallingPacket {
  x: number;
  y: number;
  speed: number;
  label: string;
  isCorrupt: boolean;
}

export function KernelPanicModal({
  open,
  onClose,
  onEarnXp,
}: KernelPanicModalProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [paddleX, setPaddleX] = useState(220);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!open || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;
    let currentPaddleX = paddleX;
    const packets: FallingPacket[] = [];

    const goodLabels = [
      'FieldConfig{text}',
      'getFieldState()',
      'normalizeConfig()',
      'useFormConfig()',
      'Schema:VALID',
    ];
    const badLabels = [
      'NaN_ Leak',
      'UncontrolledRef!',
      'TypeError:null',
      'FormikSpaghetti',
    ];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        currentPaddleX = Math.max(10, currentPaddleX - 32);
        setPaddleX(currentPaddleX);
      } else if (e.key === 'ArrowRight') {
        currentPaddleX = Math.min(420, currentPaddleX + 32);
        setPaddleX(currentPaddleX);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const loop = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;

      if (tick % 42 === 0) {
        const isCorrupt = Math.random() < 0.35;
        packets.push({
          x: 24 + Math.random() * (w - 120),
          y: -16,
          speed: 2.1 + Math.random() * 1.6,
          label: isCorrupt
            ? badLabels[Math.floor(Math.random() * badLabels.length)]
            : goodLabels[Math.floor(Math.random() * goodLabels.length)],
          isCorrupt,
        });
      }

      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, w, h);

      // Draw scanlines
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.07)';
      for (let y = 0; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Kernel Paddle
      ctx.fillStyle = '#00F5D4';
      ctx.fillRect(currentPaddleX, h - 26, 110, 12);
      ctx.fillStyle = '#020617';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('@form-os/core', currentPaddleX + 14, h - 17);

      // Update & draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.y += p.speed;

        ctx.fillStyle = p.isCorrupt ? '#F43F5E' : '#00F5D4';
        ctx.fillRect(p.x, p.y, 102, 20);
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 9.5px monospace';
        ctx.fillText(p.label, p.x + 5, p.y + 13);

        // Collision with paddle
        if (
          p.y + 20 >= h - 26 &&
          p.y <= h - 10 &&
          p.x + 102 >= currentPaddleX &&
          p.x <= currentPaddleX + 110
        ) {
          packets.splice(i, 1);
          if (p.isCorrupt) {
            setLives((l) => {
              const next = l - 1;
              if (next <= 0) setGameOver(true);
              return next;
            });
          } else {
            setScore((s) => {
              const next = s + 50;
              setHighScore((hs) => Math.max(hs, next));
              if (next === 150) {
                onEarnXp?.(250, 'Recovered Kernel Panic in Ring-0 Packet Catcher');
              }
              return next;
            });
          }
        } else if (p.y > h) {
          packets.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, gameOver, paddleX, onEarnXp]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kernel Panic Recovery Game"
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/95 p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-2xl rounded-2xl border-2 border-teal-400 bg-slate-950 p-6 font-mono text-slate-100 shadow-[0_0_90px_rgba(0,245,212,0.4)]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertOctagon className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-black tracking-widest">
              KERNEL PANIC — EXCEPTION 0xF04M_OS (EASTER EGG UNLOCKED)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-300">
          Uncontrolled legacy form state attempted to bypass <code className="text-teal-300">normalizeConfig()</code>! Move your cursor or press <kbd className="rounded bg-slate-800 px-1.5 py-0.5">←</kbd> <kbd className="rounded bg-slate-800 px-1.5 py-0.5">→</kbd> to catch cyan <span className="text-teal-300">FieldConfig</span> packets and dodge crimson <span className="text-rose-400">ValidationError</span> bombs.
        </p>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs">
          <span>
            SCORE: <strong className="text-teal-300">{score}</strong>
          </span>
          <span>
            HIGH SCORE: <strong className="text-amber-300">{highScore}</strong>
          </span>
          <span>
            INTEGRITY LIVES: <strong className="text-rose-400">{'♥'.repeat(Math.max(0, lives))}</strong>
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-teal-500/40 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={540}
            height={260}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.clientX - rect.left) / rect.width) * 540 - 55;
              setPaddleX(Math.max(10, Math.min(420, relX)));
            }}
            className="w-full cursor-ew-resize"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Trophy className="h-4 w-4" />
            <span>Achievement: Ring-0 Debugger (+200 XP)</span>
          </div>

          <div className="flex items-center gap-2">
            {gameOver && (
              <button
                type="button"
                onClick={() => {
                  setLives(3);
                  setScore(0);
                  setGameOver(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-400 px-3 py-1.5 text-xs font-bold text-slate-950"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reboot Mini-Game
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:border-teal-400"
            >
              <Play className="h-3.5 w-3.5" />
              Restore Normal OS Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
