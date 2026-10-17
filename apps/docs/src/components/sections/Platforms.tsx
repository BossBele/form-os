import React from 'react';
import type { IconType } from 'react-icons';
import {
  SiNodedotjs,
  SiReact,
  SiSolid,
  SiSvelte,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';

interface PlatformTile {
  icon: IconType;
  color: string;
  name: string;
  pkg: string;
  note: string;
}

const SHIPS_TODAY: PlatformTile[] = [
  {
    icon: SiReact,
    color: '#61DAFB',
    name: 'React',
    pkg: '@form-os/react',
    note: 'The reference adapter',
  },
  {
    icon: SiTypescript,
    color: '#3178C6',
    name: 'Any JS / TS runtime',
    pkg: '@form-os/core',
    note: 'No framework inside',
  },
  {
    icon: SiNodedotjs,
    color: '#5FA04E',
    name: 'Node & build tools',
    pkg: '@form-os/schema',
    note: 'Validate configs anywhere',
  },
];

const ON_ROADMAP: PlatformTile[] = [
  {
    icon: SiVuedotjs,
    color: '#4FC08D',
    name: 'Vue',
    pkg: '@form-os/vue',
    note: 'Planned adapter',
  },
  {
    icon: SiSvelte,
    color: '#FF3E00',
    name: 'Svelte',
    pkg: '@form-os/svelte',
    note: 'Placeholder package exists',
  },
  {
    icon: SiSolid,
    color: '#2C4F7C',
    name: 'Solid',
    pkg: '@form-os/solid',
    note: 'Planned adapter',
  },
  {
    icon: SiReact,
    color: '#61DAFB',
    name: 'React Native',
    pkg: '@form-os/native',
    note: 'iOS & Android, same config',
  },
];

function Tile({ tile, dim }: { tile: PlatformTile; dim?: boolean }) {
  const Icon = tile.icon;
  return (
    <div
      className={`flex min-w-0 items-center gap-4 rounded-2xl border border-forest-fern/25 bg-forest-moss/30 p-5${
        dim ? ' opacity-80' : ''
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-forest-fern/20 bg-forest-bark/60">
        <Icon className="h-6 w-6" style={{ color: tile.color }} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-base font-semibold text-forest-moonlight">
          {tile.name}
        </p>
        <p className="truncate font-mono text-[0.68rem] text-forest-mist">
          {tile.pkg} · {tile.note}
        </p>
      </div>
    </div>
  );
}

export function Platforms() {
  return (
    <section
      id="platforms"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            portable by design
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-forest-moonlight">
            One configuration. Every platform.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-forest-mist">
            The engine is plain JavaScript — there is no framework inside it.
            Describe the form once; only the renderer changes when you move
            between web, mobile, and whatever ships next.
          </p>
        </header>

        <div className="mt-14">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-forest-sprout">
            ships today
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHIPS_TODAY.map((tile) => (
              <Tile key={tile.pkg} tile={tile} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-forest-mist">
            on the roadmap — same file, new renderer
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ON_ROADMAP.map((tile) => (
              <Tile key={tile.pkg} tile={tile} dim />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
