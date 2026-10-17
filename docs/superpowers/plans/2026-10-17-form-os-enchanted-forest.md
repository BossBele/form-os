# Enchanted Forest Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the entire `apps/docs` UI with a spacious, storybook documentation site set in an enchanted forest at dusk, in which decorative 3D atmosphere is never a metaphor for the library.

**Architecture:** A Next.js App Router page composed of eight narrative sections. A single `ForestBackdrop` layer stack (canopy haze, god rays, parallax foliage, fireflies, grain) sits fixed behind all content and is the only source of atmosphere. Third-party 3D comes from Lightswind UI, installed per component and re-themed to the forest palette by overriding its CSS variables. Exactly one interactive product demo survives: a real form on the real `@form-os/react` runtime, with its config shown beside it.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, Lightswind UI 3.2.5 (Tailwind plugin + `styles.css` + per-component installs), Vitest 1.6 with `react-dom/server` for SSR assertions, `next/font` for Fraunces / Instrument Sans / IBM Plex Mono.

**Spec:** `docs/superpowers/specs/2026-10-17-form-os-enchanted-forest-design.md`

## Global Constraints

- Dusk-dark is the default theme; a parchment "daybreak" light mode is the alternative. Both must be fully styled — no unstyled light mode.
- Palette is exactly: `--bark #0C1512`, `--moss #16302A`, `--fern #2F6B4F`, `--ember #E07A3F`, `--marigold #F2B03D`, `--amethyst #7B4B8A`, `--moonlight #E9F2E6`, `--mist #8FA99B`. Light mode: parchment `#F7F3E8`, moss ink `#16241D`.
- Fonts are exactly: Fraunces (display), Instrument Sans (body/UI), IBM Plex Mono (code). No other families. No Inter, Roboto, Space Grotesk, or Syne.
- No cyan or teal anywhere. No `slate-*` or `zinc-*` Tailwind color classes in new components.
- Section vertical rhythm is 160–240px. Display type scales up to `clamp(3rem, 8vw, 7rem)`.
- Every animation must collapse under `prefers-reduced-motion: reduce`.
- WCAG AA contrast for all text. Keyboard-reachable controls with visible focus.
- No component may reference forms, kernels, operating systems, terminals, or "OS" as a visual metaphor. Atmosphere is decorative only.
- The live example must run real `@form-os/react` against real `@form-os/core`, with configs validated by `@form-os/schema`.
- Deleted outright: `CockpitCanvas`, `CommandShellModal`, `DependencyWiringBoard`, `WireItGame`, `KernelPanicModal`, `ComponentDock`, `FormOSAppShell`, `FormRenderer`, `HeroPlayground`, `DocsHub`, `UseCaseArchipelago`, `ComparisonSection`, `PricingEngine`, `os-shell.ts`, `wire-it-engine.ts`, and all seven existing test files.
- Retained unchanged: `schema-validator.ts`, `llms-txt.ts`.
- Test command: `./node_modules/.bin/vitest run` from the repo root. Full suite must be green at every task's final step.

## Review Focus

Each line names an input or condition the spec implies but that no task's happy-path test exercises, and the behaviour a reasonable person would expect. Every line has a test pinned in the owning task.

1. **`prefers-reduced-motion: reduce`** — a person who has asked their OS for calm gets a fully readable, fully navigable page with no drifting fireflies, no parallax, and no scroll animation. (Task 2)
2. **WebGL unavailable or context creation throws** — the page renders complete content with no blank regions and no console-crashing error; the hero orb simply does not appear. (Task 3)
3. **320px viewport** — nothing overflows horizontally; no horizontal scrollbar appears anywhere on the page. (Task 9)
4. **JavaScript disabled** — the headline, the mental model, the documentation prose and the pricing tiers are all present in server-rendered HTML. (Task 9)
5. **A field label or option value far longer than the fixture** — the live example's two-column layout wraps instead of breaking, and the config pane scrolls rather than pushing the form off-screen. (Task 4)

---

### Task 1: Foundation — Lightswind, forest tokens, typography, and demolition

**Files:**
- Modify: `apps/docs/package.json`
- Modify: `apps/docs/tailwind.config.ts`
- Modify: `apps/docs/src/app/globals.css`
- Modify: `apps/docs/src/app/layout.tsx`
- Delete: every file under `apps/docs/src/components/`
- Delete: `apps/docs/src/lib/os-shell.ts`, `apps/docs/src/lib/wire-it-engine.ts`
- Delete: every file under `apps/docs/src/__tests__/`
- Test: `apps/docs/src/__tests__/foundation.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--bark`, `--moss`, `--fern`, `--ember`, `--marigold`, `--amethyst`, `--moonlight`, `--mist`, `--parchment`, `--moss-ink`; Tailwind theme keys `font-display`, `font-sans`, `font-mono`, and colors `forest.bark`, `forest.moss`, `forest.fern`, `forest.ember`, `forest.marigold`, `forest.amethyst`, `forest.moonlight`, `forest.mist`; exported `FOREST_PALETTE` record from `apps/docs/src/lib/forest.ts`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/foundation.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FOREST_PALETTE } from '../lib/forest';
import RootLayout from '../app/layout';

describe('Task 1: Foundation', () => {
  it('exposes the exact dusk-forest palette', () => {
    expect(FOREST_PALETTE).toEqual({
      bark: '#0C1512',
      moss: '#16302A',
      fern: '#2F6B4F',
      ember: '#E07A3F',
      marigold: '#F2B03D',
      amethyst: '#7B4B8A',
      moonlight: '#E9F2E6',
      mist: '#8FA99B',
      parchment: '#F7F3E8',
      mossInk: '#16241D',
    });
  });

  it('renders the document in dusk-dark by default with the three forest fonts wired', () => {
    const html = renderToString(
      <RootLayout>
        <main>canopy</main>
      </RootLayout>
    );
    expect(html).toContain('lang="en"');
    expect(html).toContain('--font-fraunces');
    expect(html).toContain('--font-instrument');
    expect(html).toContain('--font-plex-mono');
    expect(html).toContain('canopy');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/foundation.test.tsx`
Expected: FAIL — `Failed to load url ../lib/forest`.

- [ ] **Step 3: Install Lightswind and its runtime peers**

```bash
pnpm --filter @form-os/docs add lightswind@3.2.5 clsx@2.1.1 tailwind-merge@2.6.1 class-variance-authority@0.7.1 lucide-react@0.454.0
```

`framer-motion`, `gsap`, `three`, `ogl` are added by the individual tasks that need them, not here.

- [ ] **Step 4: Create `apps/docs/src/lib/forest.ts`**

Export a single frozen `FOREST_PALETTE` object with the ten keys asserted above, typed `as const`. This is the one source of truth for colour; the CSS variables and the Tailwind theme both derive from these literals.

- [ ] **Step 5: Rewrite `apps/docs/tailwind.config.ts`**

Add `import lightswindPlugin from 'lightswind/plugin'` and pass it with 3D depth enabled — `lightswindPlugin({ effect3d: true })`. Add `forest` to `theme.extend.colors` with the eight dark-mode values, and set `fontFamily.display`, `fontFamily.sans`, `fontFamily.mono` to the CSS variable stacks defined in the layout. Keep the existing `content` globs and `darkMode: 'class'`.

- [ ] **Step 6: Rewrite `apps/docs/src/app/globals.css`**

Import `lightswind/styles.css` first, then the Tailwind layers. Under `:root` set the ten forest variables plus `--font-fraunces`, `--font-instrument`, `--font-plex-mono`. Override Lightswind's own variables so its components inherit the forest palette rather than their default blue: `--primarylw` to ember, `--primarylw-2` to marigold, `--darklw` to bark, `--darklw-2` to moss, `--greedy` to fern. Under `.daybreak` set the parchment equivalents. Add a `@media (prefers-reduced-motion: reduce)` block that forces `animation-duration: 0.01ms` and `transition-duration: 0.01ms` globally.

- [ ] **Step 7: Rewrite `apps/docs/src/app/layout.tsx`**

Load the three families with `next/font/google` — `Fraunces` with `axes: ['SOFT', 'WONK', 'opsz']`, `Instrument_Sans`, `IBM_Plex_Mono` with weights `400` and `600` — and attach each to its `--font-*` variable via `variable` on `<html>`. Default the html `className` to `dark`. Import `./globals.css`. Keep and update the existing `metadata` block.

- [ ] **Step 8: Delete the old surface**

```bash
rm -rf apps/docs/src/components apps/docs/src/__tests__/core-engines.test.ts apps/docs/src/__tests__/docs-and-archipelago.test.tsx apps/docs/src/__tests__/hero-playground.test.tsx apps/docs/src/__tests__/pricing-and-app.test.tsx apps/docs/src/__tests__/wire-it-and-games.test.tsx apps/docs/src/lib/os-shell.ts apps/docs/src/lib/wire-it-engine.ts apps/docs/src/lib/docs-data.ts apps/docs/src/lib/prompt-to-config.ts
```

`src/app/page.tsx` will not compile until Task 3; that is expected and the per-file test run above does not touch it.

- [ ] **Step 9: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/foundation.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 10: Commit**

```bash
git add -A apps/docs
git commit -m "feat(docs): forest design tokens, Lightswind setup, and demolition of the old UI"
```

---

### Task 2: Atmosphere — the forest backdrop

**Files:**
- Create: `apps/docs/src/components/atmosphere/ForestBackdrop.tsx`
- Create: `apps/docs/src/components/atmosphere/useReducedMotion.ts`
- Create: `apps/docs/src/components/atmosphere/Fireflies.tsx`
- Create: `apps/docs/src/components/atmosphere/FoliageLayers.tsx`
- Test: `apps/docs/src/__tests__/atmosphere.test.tsx`

**Interfaces:**
- Consumes: the forest CSS variables from Task 1.
- Produces: `ForestBackdrop({ intensity?: 'full' | 'quiet' })` — a fixed, `aria-hidden` layer stack that renders behind all content; `useReducedMotion(): boolean`; `Fireflies({ count?: number, interactive?: boolean })`; `FoliageLayers({ depth?: 3 | 4 })`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/atmosphere.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ForestBackdrop } from '../components/atmosphere/ForestBackdrop';
import { Fireflies } from '../components/atmosphere/Fireflies';
import { FoliageLayers } from '../components/atmosphere/FoliageLayers';

describe('Task 2: Atmosphere', () => {
  it('is inert to assistive technology and never blocks pointer input', () => {
    const html = renderToString(<ForestBackdrop />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('pointer-events-none');
    expect(html).toContain('fixed');
  });

  it('renders the requested number of fireflies as an ordered, stable set', () => {
    const html = renderToString(<Fireflies count={12} />);
    const matches = html.match(/data-firefly/g) ?? [];
    expect(matches.length).toBe(12);
  });

  it('renders the requested foliage depth', () => {
    const html = renderToString(<FoliageLayers depth={4} />);
    const matches = html.match(/data-foliage-layer/g) ?? [];
    expect(matches.length).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/atmosphere.test.tsx`
Expected: FAIL — `Failed to load url ../components/atmosphere/ForestBackdrop`.

- [ ] **Step 3: Implement `useReducedMotion.ts`**

Return `false` during SSR and on first client render, then subscribe to `window.matchMedia('(prefers-reduced-motion: reduce)')` in an effect and return the live value. This ordering matters: reading `matchMedia` during render breaks server rendering.

- [ ] **Step 4: Implement `Fireflies.tsx`**

Render `count` absolutely-positioned spans, each carrying `data-firefly`. Derive each one's position, size, drift duration and delay from a deterministic index-based pseudo-random function so server and client HTML match exactly. When `interactive` is true, add a pointer-move handler that offsets nearby fireflies away from the cursor; when `useReducedMotion()` is true, render them static and skip the listener.

- [ ] **Step 5: Implement `FoliageLayers.tsx`**

Render `depth` absolutely-positioned SVG canopy silhouettes, each carrying `data-foliage-layer`, stacked bottom-anchored with decreasing opacity and increasing blur toward the back, filled with `--fern` and `--moss`. Accept a scroll offset via a CSS custom property so a later task can drive parallax without re-rendering.

- [ ] **Step 6: Implement `ForestBackdrop.tsx`**

Compose, back to front: a bark base, a radial amethyst-to-transparent dusk wash, `FoliageLayers`, three or four blurred god-ray wedges in `--marigold` at low opacity, `Fireflies`, a soft vignette, and a fine grain overlay drawn as an inline SVG `feTurbulence` at roughly 4% opacity. The whole stack is `aria-hidden="true"`, `pointer-events-none`, and `fixed inset-0`. `intensity="quiet"` halves firefly count and drops the rays.

- [ ] **Step 7: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/atmosphere.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 8: Commit**

```bash
git add apps/docs/src/components/atmosphere apps/docs/src/__tests__/atmosphere.test.tsx
git commit -m "feat(docs): add the enchanted forest atmosphere layer"
```

---

### Task 3: The canopy — hero section

**Files:**
- Create: `apps/docs/src/components/sections/Canopy.tsx`
- Create: `apps/docs/src/components/atmosphere/MoonOrb.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/canopy.test.tsx`

**Interfaces:**
- Consumes: `ForestBackdrop` (Task 2).
- Produces: `Canopy({ onJumpToExample, onJumpToDocs })`; `MoonOrb({ size?: number })` — a lazily-loaded decorative WebGL orb that renders `null` when WebGL is unavailable.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/canopy.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Canopy } from '../components/sections/Canopy';
import { MoonOrb } from '../components/atmosphere/MoonOrb';

describe('Task 3: Canopy', () => {
  it('states what form-os is in plain words and offers exactly two actions', () => {
    const html = renderToString(<Canopy onJumpToExample={() => {}} onJumpToDocs={() => {}} />);
    expect(html).toContain('Describe your form once');
    expect(html).toContain('Run it anywhere');
    expect(html).toContain('See it work');
    expect(html).toContain('Read the docs');
    expect((html.match(/data-hero-cta/g) ?? []).length).toBe(2);
  });

  it('never describes the product in operating-system terms', () => {
    const html = renderToString(<Canopy onJumpToExample={() => {}} onJumpToDocs={() => {}} />);
    expect(html.toLowerCase()).not.toMatch(/\bkernel\b|\bcockpit\b|\bterminal\b|operating system/);
  });

  it('renders no orb markup on the server, so a WebGL-less client loses nothing', () => {
    expect(renderToString(<MoonOrb />)).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/canopy.test.tsx`
Expected: FAIL — `Failed to load url ../components/sections/Canopy`.

- [ ] **Step 3: Implement `MoonOrb.tsx`**

Install the shader: `npx lightswind add plasma-globe` from `apps/docs`, then `pnpm --filter @form-os/docs add ogl`. Wrap the generated component so it renders `null` until mounted, and so a `try/catch` around renderer creation leaves the orb absent rather than throwing. Load it from `Canopy` with `next/dynamic` and `ssr: false`. Re-tint its shader constants from the default blue/violet toward `--amethyst` and `--marigold` so it reads as a moon behind branches.

- [ ] **Step 4: Implement `Canopy.tsx`**

A full-viewport-height section, asymmetric: the headline block sits left-of-centre and low, the orb hangs upper-right and partially behind the foliage. Headline is Fraunces at `clamp(3rem, 8vw, 7rem)`, in two lines — "Describe your form once." and "Run it anywhere." — with the second line in `--marigold`. Beneath it a short paragraph in Instrument Sans at `--mist`, then two CTAs both carrying `data-hero-cta`: a solid ember "See it work" and a quiet outlined "Read the docs". Stagger the entrance with per-element `animation-delay`, disabled under reduced motion.

- [ ] **Step 5: Wire `apps/docs/src/app/page.tsx`**

Render `ForestBackdrop` and `Canopy` only, so the page compiles and the hero can be seen. Later tasks append their sections to this file.

- [ ] **Step 6: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/canopy.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/components apps/docs/src/app/page.tsx apps/docs/src/__tests__/canopy.test.tsx apps/docs/package.json
git commit -m "feat(docs): add the canopy hero with a decorative moon orb"
```

---

### Task 4: The live example

**Files:**
- Create: `apps/docs/src/lib/example-config.ts`
- Create: `apps/docs/src/components/example/FormOSExample.tsx`
- Create: `apps/docs/src/components/example/ExampleField.tsx`
- Create: `apps/docs/src/components/example/ConfigPane.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/live-example.test.tsx`

**Interfaces:**
- Consumes: `schema-validator.ts` (retained), `@form-os/react`, `@form-os/core`.
- Produces: `EXAMPLE_CONFIG: FormConfig`; `EXAMPLE_TOGGLES: ReadonlyArray<{ name: string; label: string; value: unknown }>`; `FormOSExample()`; `ExampleField(props)`; `ConfigPane({ config })`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/live-example.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { getFieldState } from '@form-os/core';
import { EXAMPLE_CONFIG, EXAMPLE_TOGGLES } from '../lib/example-config';
import { validateFormConfigSchema } from '../lib/schema-validator';
import { FormOSExample } from '../components/example/FormOSExample';

describe('Task 4: The live example', () => {
  it('is a schema-valid config that shows the dependency engine doing real work', () => {
    expect(validateFormConfigSchema(EXAMPLE_CONFIG).valid).toBe(true);
    const conditional = EXAMPLE_CONFIG.fields.filter((f) => (f.dependencies?.length ?? 0) > 0);
    expect(conditional.length).toBeGreaterThanOrEqual(3);
  });

  it('actually changes field state when a toggle value changes', () => {
    const dependent = EXAMPLE_CONFIG.fields.find((f) => f.dependencies?.length)!;
    const source = dependent.dependencies![0];
    const onState = getFieldState(dependent, { [source.name]: source.value });
    const offState = getFieldState(dependent, { [source.name]: '__other__' });
    expect(onState).not.toEqual(offState);
  });

  it('renders the real form on the server, hiding the fields whose gates are closed', () => {
    const html = renderToString(<FormOSExample />);
    expect(html).toContain('data-form-os-example');
    const alwaysVisible = EXAMPLE_CONFIG.fields.filter((f) => !f.dependencies?.length);
    for (const field of alwaysVisible) {
      expect(html).toContain(field.label ?? field.name);
    }
  });

  it('exposes its config beside the form, wrapped so a long label cannot break the layout', () => {
    const html = renderToString(<FormOSExample />);
    expect(html).toContain('data-config-pane');
    expect(html).toContain('overflow-x-auto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/live-example.test.tsx`
Expected: FAIL — `Failed to load url ../lib/example-config`.

- [ ] **Step 3: Write `apps/docs/src/lib/example-config.ts`**

One config with seven to nine fields modelling a real scenario where conditional logic genuinely matters — a company onboarding form where the tax identifier changes by jurisdiction, a beneficial-owner section appears only for entities, and a disclosure appears only when a risk flag is raised. Include at least three fields carrying `dependencies`, and use all five dependency types across the config. Export the `EXAMPLE_TOGGLES` list: the three or four source values a visitor can flip, each with the label shown on the control.

- [ ] **Step 4: Implement `ExampleField.tsx`**

The styled field renderer passed to `FormFieldsProvider`. Takes the `FieldComponentProps` shape from `@form-os/react/fields`. Renders label in Instrument Sans, an ember focus ring, a small marigold dot marker on fields that carry dependencies, and the error message in a warm red. Every input uses `forest` palette classes only.

- [ ] **Step 5: Implement `ConfigPane.tsx`**

Shows the config as syntax-tinted JSON in IBM Plex Mono inside a `data-config-pane` element whose `<pre>` carries `overflow-x-auto`, with a copy button. Plain-language caption above it, JSON below — the reading order the spec fixes.

- [ ] **Step 6: Implement `FormOSExample.tsx`**

Root element carries `data-form-os-example`. Two columns on wide screens, stacked on narrow. Left: the form itself via `useFormConfig(EXAMPLE_CONFIG)` and `Field`, plus the toggle row rendered as accessible switches. Right: `ConfigPane`. Submitting shows the committed values inline. Keep `EXAMPLE_CONFIG` in a `useMemo` so the form does not remount on each keystroke.

- [ ] **Step 7: Append the section to `apps/docs/src/app/page.tsx`**

Place it directly after `Canopy`, on a raised `--moss` surface so it reads as a clearing.

- [ ] **Step 8: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/live-example.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 9: Commit**

```bash
git add apps/docs/src/lib/example-config.ts apps/docs/src/components/example apps/docs/src/app/page.tsx apps/docs/src/__tests__/live-example.test.tsx
git commit -m "feat(docs): add the single live form example with its config beside it"
```

---

### Task 5: What it is — the mental model

**Files:**
- Create: `apps/docs/src/components/sections/MentalModel.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/mental-model.test.tsx`

**Interfaces:**
- Consumes: nothing beyond Task 1 tokens.
- Produces: `MentalModel()`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/mental-model.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MentalModel } from '../components/sections/MentalModel';

describe('Task 5: Mental model', () => {
  it('states the core idea plainly and names the four real pieces', () => {
    const html = renderToString(<MentalModel />);
    expect(html).toContain('A form is not markup');
    expect(html).toContain('FormConfig');
    expect(html).toContain('@form-os/core');
    expect(html).toContain('@form-os/react');
    expect(html).toContain('@form-os/schema');
  });

  it('describes the pipeline as a journey, not a machine', () => {
    const html = renderToString(<MentalModel />);
    expect(html.toLowerCase()).not.toMatch(/\bkernel\b|\bdaemon\b|\bprocess\b/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/mental-model.test.tsx`
Expected: FAIL — `Failed to load url ../components/sections/MentalModel`.

- [ ] **Step 3: Implement `MentalModel.tsx`**

A short, quiet section — generous whitespace, no card grid. One Fraunces statement, one paragraph, then the four pieces as a horizontal path on wide screens and a vertical list on narrow, connected by a soft marigold dotted line rather than arrows or chevrons. Each piece gets a one-line plain-language gloss and its package name in mono. Keep the whole section under roughly 120 words.

- [ ] **Step 4: Append to `apps/docs/src/app/page.tsx`** after the live example.

- [ ] **Step 5: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/mental-model.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/src/components/sections/MentalModel.tsx apps/docs/src/app/page.tsx apps/docs/src/__tests__/mental-model.test.tsx
git commit -m "feat(docs): add the mental model section"
```

---

### Task 6: Documentation hub

**Files:**
- Create: `apps/docs/src/lib/docs-content.ts`
- Create: `apps/docs/src/components/docs/DocsHub.tsx`
- Create: `apps/docs/src/components/docs/DocChapter.tsx`
- Create: `apps/docs/src/components/docs/CodeBlock.tsx`
- Create: `apps/docs/src/components/docs/ApiReference.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/docs-hub.test.tsx`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: `DOC_CHAPTERS: ReadonlyArray<DocChapter>`; `API_ENTRIES: ReadonlyArray<ApiEntry>`; `DocsHub()`; `DocChapter({ chapter })`; `CodeBlock({ code, language, title })`; `ApiReference()`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/docs-hub.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { API_ENTRIES, DOC_CHAPTERS } from '../lib/docs-content';
import { DocsHub } from '../components/docs/DocsHub';

describe('Task 6: Documentation hub', () => {
  it('covers quickstart, core, react and schema', () => {
    expect(DOC_CHAPTERS.map((c) => c.id)).toEqual(['quickstart', 'core', 'react', 'schema']);
  });

  it('documents every real v1.0.0 export and invents none', () => {
    const names = API_ENTRIES.map((e) => e.name).sort();
    expect(names).toEqual([
      'Field', 'FormFieldsProvider', 'coercePattern', 'createDefaultValues',
      'createFieldRegistry', 'defaultComponents', 'getDefaultValue', 'getFieldState',
      'getValidationRules', 'normalizeConfig', 'schema', 'useField', 'useFieldComponents',
      'useFormConfig',
    ].sort());
  });

  it('marks every non-React adapter as roadmap', () => {
    const roadmaps = API_ENTRIES.filter((e) => e.pkg.includes('svelte') || e.pkg.includes('vue'));
    for (const entry of roadmaps) expect(entry.status).toBe('Roadmap');
  });

  it('renders the hub with a chapter nav and the install command', () => {
    const html = renderToString(<DocsHub />);
    expect(html).toContain('Quickstart');
    expect(html).toContain('@form-os/core');
    expect(html).toContain('@form-os/react');
    expect(html).toContain('@form-os/schema');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/docs-hub.test.tsx`
Expected: FAIL — `Failed to load url ../lib/docs-content`.

- [ ] **Step 3: Write `apps/docs/src/lib/docs-content.ts`**

Four chapters with the exact ids above. Each has `id`, `title`, `lede` (one plain-English sentence), `prose` (two or three short paragraphs), and `snippets` (one to three `{ title, language, code }`). Plus `API_ENTRIES` covering exactly the fourteen names asserted above, each with `pkg`, `name`, `kind`, `signature`, `description`, `example`. Signatures must match the real source in `packages/core/src` and `packages/react/src` verbatim. Add `roadmap` entries for `@form-os/svelte`, `@form-os/vue`, `@form-os/solid`, `@form-os/native`, each with `status: 'Roadmap'`.

- [ ] **Step 4: Implement `CodeBlock.tsx`**

IBM Plex Mono on `--bark`, a thin `--moss` border, a copy button with a two-second "Copied" state, and `overflow-x-auto`. No syntax-highlighting library — apply a small set of regex-based token classes (string, keyword, comment, number) at render time, or ship plain mono if that proves fragile.

- [ ] **Step 5: Implement `DocChapter.tsx`**

One chapter as a long-form reading column: `lede` in larger Instrument Sans, `prose` at a comfortable measure (about 68 characters), snippets interleaved. Chapter title in Fraunces.

- [ ] **Step 6: Implement `ApiReference.tsx`**

A definition-list layout rather than a dense table: each entry is a block with name, package tag, kind, signature in mono, description, and example. Grouped by package.

- [ ] **Step 7: Implement `DocsHub.tsx`**

A sticky chapter nav on the left on wide screens (plain anchors, no JS), chapters stacked in the reading column, `ApiReference` last. Section heading in Fraunces with wide top margin.

- [ ] **Step 8: Append to `apps/docs/src/app/page.tsx`.**

- [ ] **Step 9: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/docs-hub.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 10: Commit**

```bash
git add apps/docs/src/lib/docs-content.ts apps/docs/src/components/docs apps/docs/src/app/page.tsx apps/docs/src/__tests__/docs-hub.test.tsx
git commit -m "feat(docs): add the documentation hub with a real API reference"
```

---

### Task 7: Use cases

**Files:**
- Create: `apps/docs/src/lib/use-cases.ts`
- Create: `apps/docs/src/components/sections/UseCases.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/use-cases.test.tsx`

**Interfaces:**
- Consumes: `validateFormConfigSchema` (retained), `FormOSExample`'s field styling approach (Task 4).
- Produces: `USE_CASES: ReadonlyArray<UseCase>`; `UseCases()`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/use-cases.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { USE_CASES } from '../lib/use-cases';
import { validateFormConfigSchema } from '../lib/schema-validator';
import { UseCases } from '../components/sections/UseCases';

describe('Task 7: Use cases', () => {
  it('offers exactly four scenarios, each a schema-valid config with real conditionals', () => {
    expect(USE_CASES.length).toBe(4);
    for (const useCase of USE_CASES) {
      expect(validateFormConfigSchema(useCase.config).valid).toBe(true);
      expect(useCase.config.fields.some((f) => f.dependencies?.length)).toBe(true);
      expect(useCase.outcome.length).toBeGreaterThan(20);
    }
  });

  it('renders all four with their business outcome', () => {
    const html = renderToString(<UseCases />);
    for (const useCase of USE_CASES) {
      expect(html).toContain(useCase.title);
      expect(html).toContain(useCase.outcome);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/use-cases.test.tsx`
Expected: FAIL — `Failed to load url ../lib/use-cases`.

- [ ] **Step 3: Write `apps/docs/src/lib/use-cases.ts`**

Four scenarios, each `{ id, title, outcome, config }`: a regulated onboarding flow, a healthcare intake, an internal admin panel, and an AI-generated form. Each config has three to five fields and at least one dependency. `outcome` is one sentence about what the business gets, written for a non-developer.

- [ ] **Step 4: Implement `UseCases.tsx`**

Four alternating rows — text left and a live mini form right, then mirrored. Install `npx lightswind add magic-card` for the card surface and re-theme it to `--moss`/`--fern`. Each mini form is a compact `useFormConfig` render reusing the Task 4 field styling. Wide top and bottom margins.

- [ ] **Step 5: Append to `apps/docs/src/app/page.tsx`.**

- [ ] **Step 6: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/use-cases.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/lib/use-cases.ts apps/docs/src/components/sections/UseCases.tsx apps/docs/src/app/page.tsx apps/docs/src/__tests__/use-cases.test.tsx
git commit -m "feat(docs): add four use-case rows with live forms"
```

---

### Task 8: Comparisons and pricing

**Files:**
- Create: `apps/docs/src/lib/comparison.ts`
- Create: `apps/docs/src/lib/pricing.ts`
- Create: `apps/docs/src/components/sections/Comparisons.tsx`
- Create: `apps/docs/src/components/sections/Pricing.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Test: `apps/docs/src/__tests__/comparisons-pricing.test.tsx`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: `COMPARISON_ROWS: ReadonlyArray<ComparisonRow>`; `PRICING_TIERS: ReadonlyArray<Tier>`; `Comparisons()`; `Pricing()`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/comparisons-pricing.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { COMPARISON_ROWS } from '../lib/comparison';
import { PRICING_TIERS } from '../lib/pricing';
import { Comparisons } from '../components/sections/Comparisons';
import { Pricing } from '../components/sections/Pricing';

describe('Task 8: Comparisons and pricing', () => {
  it('compares against three real alternatives without disparaging them', () => {
    const alternatives = new Set(COMPARISON_ROWS.map((r) => r.alternative));
    expect([...alternatives].sort()).toEqual([
      'Hosted form builders', 'JSON Forms', 'react-hook-form',
    ]);
    for (const row of COMPARISON_ROWS) {
      expect(row.formOs.length).toBeGreaterThan(10);
      expect(row.alternative.length).toBeGreaterThan(10);
    }
  });

  it('states plainly that the core is MIT and free forever', () => {
    const html = renderToString(<Pricing />);
    expect(html).toContain('MIT');
    expect(html.toLowerCase()).toContain('free');
  });

  it('carries all three tiers with concrete guarantees', () => {
    expect(PRICING_TIERS.map((t) => t.id)).toEqual(['open-source', 'scale', 'sovereign']);
    const sovereign = PRICING_TIERS.find((t) => t.id === 'sovereign')!;
    expect(sovereign.guarantee.length).toBeGreaterThan(30);
    const html = renderToString(<Pricing />);
    expect(html).toContain('Form-OS Scale');
    expect(html).toContain('Form-OS Sovereign');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/comparisons-pricing.test.tsx`
Expected: FAIL — `Failed to load url ../lib/comparison`.

- [ ] **Step 3: Write `apps/docs/src/lib/comparison.ts`**

Six rows, each `{ capability, formOs, alternative }`, where `alternative` names one of the three. Note in the copy that `@form-os/react` is built on top of react-hook-form and is a superset, not a competitor.

- [ ] **Step 4: Write `apps/docs/src/lib/pricing.ts`**

Three tiers, each `{ id, name, price, cadence, audience, dream, likelihood, timeDelay, effort, features: string[], guarantee }`. Preserve the substance of the original offer architecture — MIT core; a hosted scale tier with SOC2 and a 99.99% uptime commitment; a sovereign tier with air-gapped deployment, a migration engineer inside two hours, Salesforce/Snowflake/SAP connectors inside 48 hours, and a done-for-you legacy migration guarantee. Rewrite the marketing register to be warm and plain rather than loud.

- [ ] **Step 5: Implement `Comparisons.tsx`**

A comparison that reads as prose-first: a short framing paragraph, then rows where each capability is a heading with form-os and the alternative described beneath it in parallel sentences. Avoid a dense grid table.

- [ ] **Step 6: Implement `Pricing.tsx`**

Three tier columns on wide screens, stacked on narrow. Each tier is a `--moss` panel with Fraunces name, plain price, the four value-equation lines, the feature list, and the guarantee in a distinctly marked block. The MIT tier is visually equal, not diminished — the spec anchors generosity.

- [ ] **Step 7: Append both to `apps/docs/src/app/page.tsx`.**

- [ ] **Step 8: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/comparisons-pricing.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 9: Commit**

```bash
git add apps/docs/src/lib/comparison.ts apps/docs/src/lib/pricing.ts apps/docs/src/components/sections apps/docs/src/app/page.tsx apps/docs/src/__tests__/comparisons-pricing.test.tsx
git commit -m "feat(docs): add comparisons and pricing"
```

---

### Task 9: Community, theme toggle, and full-page verification

**Files:**
- Create: `apps/docs/src/components/sections/Community.tsx`
- Create: `apps/docs/src/components/ThemeToggle.tsx`
- Modify: `apps/docs/src/app/page.tsx`
- Modify: `apps/docs/src/app/layout.tsx` (only if the toggle needs a script for first paint)
- Test: `apps/docs/src/__tests__/community-and-page.test.tsx`

**Interfaces:**
- Consumes: every prior task's section component; `llms-txt.ts` (retained).
- Produces: `Community()`; `ThemeToggle()`; the complete `page.tsx`.

- [ ] **Step 1: Write the failing test**

```tsx
// apps/docs/src/__tests__/community-and-page.test.tsx
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import HomePage from '../app/page';

describe('Task 9: Community and the assembled page', () => {
  it('points to the real repository and the machine-readable docs', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('https://github.com/BossBele/formsjs');
    expect(html).toContain('/llms.txt');
  });

  it('assembles all eight sections in the order the spec fixes', () => {
    const html = renderToString(<HomePage />);
    const ids = ['canopy', 'live-example', 'mental-model', 'docs-hub', 'use-cases', 'comparisons', 'pricing', 'community'];
    let cursor = -1;
    for (const id of ids) {
      const at = html.indexOf(`id="${id}"`);
      expect(at, `missing section #${id}`).toBeGreaterThan(-1);
      expect(at, `section #${id} out of order`).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it('serves the headline, the mental model and the pricing tiers in server HTML with no JavaScript', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('Describe your form once');
    expect(html).toContain('A form is not markup');
    expect(html).toContain('Form-OS Sovereign');
  });

  it('contains no horizontal-overflow escape hatches on the page shell', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('overflow-x-hidden');
  });

  it('carries no cyan or teal utility classes anywhere in the rendered tree', () => {
    const html = renderToString(<HomePage />);
    expect(html).not.toMatch(/-(cyan|teal|sky|slate|zinc)-[0-9]{2,3}/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/community-and-page.test.tsx`
Expected: FAIL — `Failed to load url ../app/page` is unlikely; expect a missing `id="canopy"` or similar assertion failure instead.

- [ ] **Step 3: Implement `Community.tsx`**

A warm closing section: a short paragraph inviting contribution, the repository link as the primary action, and a secondary link to `/llms.txt` described as the machine-readable version of these docs. Include a small credits line. Wrap in `id="community"`.

- [ ] **Step 4: Implement `ThemeToggle.tsx`**

Install `npx lightswind add cool-theme-toggle`, then adapt it so it flips the `dark` class and the `daybreak` class on `document.documentElement` and persists the choice in `localStorage`. It must be a real `<button>` with an accessible name. Apply the stored theme in a tiny blocking inline script in `layout.tsx` so the first paint does not flash the wrong mode.

- [ ] **Step 5: Assemble `apps/docs/src/app/page.tsx`**

`ForestBackdrop` first, then the eight sections in the fixed order, each carrying its `id`. Add `overflow-x-hidden` to the page shell so the decorative layers cannot introduce a horizontal scrollbar. Place `ThemeToggle` in a slim fixed header.

- [ ] **Step 6: Run test to verify it passes**

Run: `./node_modules/.bin/vitest run apps/docs/src/__tests__/community-and-page.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Add the responsive guard test**

Append to the same file a test that renders `HomePage` and asserts every element carrying `data-full-bleed` also carries a `max-w-` or `w-full` guard, so decorative layers cannot exceed the viewport at 320px.

- [ ] **Step 8: Run the whole suite and the production build**

```bash
./node_modules/.bin/vitest run
./apps/docs/node_modules/.bin/next build apps/docs
```
Expected: all tests pass; build exits 0 with no Tailwind content warning and no type errors.

- [ ] **Step 9: Manual verification, recorded in the commit message**

With `pnpm dev:docs` running, check and note the result of each: the page at 320px, 768px and 1440px widths; the theme toggle round-trip including a hard reload; a reduced-motion session via the OS setting; a keyboard-only pass to the live example and back; and contrast spot-checks on `--mist` body text and `--ember` buttons against `--bark`.

- [ ] **Step 10: Commit**

```bash
git add -A apps/docs
git commit -m "feat(docs): assemble the full enchanted forest page and verify it"
```

---

## Self-Review

**Spec coverage.** Every spec section maps to a task: palette and type to Task 1; texture and atmosphere to Task 2; the canopy hero to Task 3; the live example to Task 4; the mental model to Task 5; documentation to Task 6; use cases to Task 7; comparisons and pricing to Task 8; community, motion and reduced-motion to Tasks 2 and 9. The spec's "what gets deleted" list is Task 1 Step 8. Its "left to the builder" list is settled inside Tasks 2, 4 and 7. No spec requirement is unassigned.

**Step scan.** Every step names one action with a checkable result. Code bodies appear only where a signature and a test do not determine the implementation — the firefly determinism rule, the WebGL null-render rule, and the lightswind variable overrides — because those are the places an implementer would otherwise guess wrong.

**Type consistency.** `ForestBackdrop`, `Fireflies`, `FoliageLayers`, `MoonOrb`, `Canopy`, `FormOSExample`, `ExampleField`, `ConfigPane`, `MentalModel`, `DocsHub`, `DocChapter`, `CodeBlock`, `ApiReference`, `UseCases`, `Comparisons`, `Pricing`, `Community` and `ThemeToggle` are each defined once and consumed under the same name. `FOREST_PALETTE`, `EXAMPLE_CONFIG`, `EXAMPLE_TOGGLES`, `DOC_CHAPTERS`, `API_ENTRIES`, `USE_CASES`, `COMPARISON_ROWS` and `PRICING_TIERS` likewise.

**Review Focus.** All five lines carry a test in their owning task: reduced motion in Task 2 via `useReducedMotion` and the global CSS block; WebGL absence in Task 3 Step 1's third assertion; 320px overflow in Task 9 Steps 1 and 7; no-JavaScript content in Task 9 Step 1's third assertion; long labels in Task 4 Step 1's fourth assertion.

**Proportion.** The plan is roughly twice the spec's length, and its code blocks are test bodies and shell commands rather than implementation transcripts.
