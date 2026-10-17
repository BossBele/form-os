# form-os Documentation Site — "Enchanted Forest" Rebuild

Date: 2026-10-17
Status: Approved for planning
Supersedes: the entire `apps/docs` UI built on branch `feat/docs-website`

## Intent

The first build of the form-os documentation site read as a technical dashboard:
cold slate surfaces, cyan-on-black neon, an operating-system metaphor (kernel
boot, cockpit, terminal shell), and game-shaped interactivity. The product owner
rejected it wholesale — it gave "AI dev-tool" vibes and felt machine-made.

This rebuild replaces **all of it** with a spacious, human, storybook
documentation site set in an enchanted forest at dusk. The forest is atmosphere,
not metaphor: it is the room the site sits in, never a diagram of the library.

## Goals

- The site reads like a well-made book, not a dashboard.
- A visitor understands what form-os is inside 60 seconds, from one live example.
- Documentation is accurate to the real v1.0.0 API surface of `@form-os/core`,
  `@form-os/react`, and `@form-os/schema`.
- Pricing communicates the offer architecture honestly and warmly.
- The visual result is memorable and distinctive — not reachable by default
  component-library choices.

## Non-goals

- No dependency-wiring puzzle game.
- No fake kernel-crash easter egg.
- No terminal / command shell.
- No OS boot sequence, no 3D "cockpit", no hardware-rack visualisation.
- No operating-system or kernel metaphor anywhere in copy or visuals.
- No dashboard-style config playground with a component dock.

## Anti-goals (what would make this a failure even if it works)

- Resembles a generic AI-generated dev-tool landing page.
- Cyan/teal neon on black, or any cold slate palette.
- Dense, dashboard-like information layout.
- Decorative 3D that implies meaning about the product.
- Playful atmosphere that undercuts the accuracy of the documentation.

## Constraints

- Next.js App Router inside the existing workspace package `apps/docs`
  (`@form-os/docs`), TypeScript, Tailwind CSS.
- The live example must run on the real `@form-os/react` runtime against the real
  `@form-os/core` dependency engine, validated by `@form-os/schema`.
- Third-party visual components come from Lightswind UI, retrieved through its
  MCP server. This requires the `lightswind` package, its Tailwind plugin, and
  its stylesheet.
- WCAG AA contrast, keyboard navigability, `prefers-reduced-motion` support,
  and an excellent phone layout are all required.
- The previous test suite tested the old surface and is replaced, not preserved.

## Design system

### Palette — dusk forest

| Token | Value | Role |
| --- | --- | --- |
| `--bark` | `#0C1512` | page base |
| `--moss` | `#16302A` | raised surfaces |
| `--fern` | `#2F6B4F` | mid-depth foliage |
| `--ember` | `#E07A3F` | primary action |
| `--marigold` | `#F2B03D` | accent, highlights |
| `--amethyst` | `#7B4B8A` | dusk shadow, depth |
| `--moonlight` | `#E9F2E6` | primary text |
| `--mist` | `#8FA99B` | secondary text |

Light mode, "daybreak": parchment `#F7F3E8` base, moss ink `#16241D` text, same
ember and marigold accents. Dusk-dark is the default.

### Typography

- **Display** — Fraunces. A soft, wonky variable serif with optical sizing that
  reads hand-lettered and gains real character at large sizes.
- **Body / UI** — Instrument Sans. Humanist, calm, distinct from Inter.
- **Code** — IBM Plex Mono. Warm, humanist mono.

No geometric sans, no Inter, no Roboto, no Space Grotesk.

### Space and composition

Section rhythm of 160–240px. A wide container with generous gutters. Asymmetric
compositions that overlap and drift diagonally rather than stacking in a grid.
Display type up to `clamp(3rem, 8vw, 7rem)`. Generous negative space.

### Texture and atmosphere

- Fine grain overlay at low opacity across the page.
- Volumetric light shafts falling through canopy.
- Layered foliage silhouettes at three or more parallax depths.
- Soft vignette.
- Fireflies: slow-drifting points that respond to the cursor.

### Motion

- One orchestrated hero entrance with staggered reveals.
- Sections revealed on scroll.
- Canopy parallax driven by scroll position.
- Cursor-reactive fireflies.
- `prefers-reduced-motion` collapses all of it to a static page.

## Page structure

1. **Canopy** — the hero. The forest opens. A large Fraunces statement of what
   form-os is in plain words, one decorative 3D scene as atmosphere, and two
   quiet actions: see the live example, read the docs.
2. **The live example** — the heart of the page. One real form running on the
   real runtime, presented with room to breathe. Its configuration shown beside
   it, plain-language explanation first and the JSON second. A small number of
   toggles let the visitor watch conditional fields appear and disappear.
3. **What it is** — the mental model in plain words, short. A form is a
   configuration. Config to core to adapter to rendered form.
4. **Documentation** — quickstart, core concepts, the React bindings, the schema
   package, and a full API reference. Long-form reading layout with copyable
   code.
5. **Use cases** — a small number of industry examples, each with a live form.
6. **Comparisons** — against raw react-hook-form, JSON Forms, and hosted
   builders, stated fairly.
7. **Pricing** — the offer architecture: the MIT open-source core, the hosted
   scale tier, and the sovereign enterprise tier, framed by the value equation,
   with the guarantees stated concretely.
8. **Community** — the GitHub callout and the `llms.txt` pointer.

## Lightswind components

Decorative only, chosen per section at build time from the MCP catalogue. The
shortlist:

- Atmosphere: `aurora-background`, `nebula-flow`, `smokey-background`,
  `animated-particles`, `sparkle-particles`, `plasma-globe`
- Depth and motion: `3d-scroll-trigger`, `3d-perspective-card`, `3d-image-ring`,
  `cinematic-scroll`, `scroll-reveal`, `aurora-text-effect`, `lens`
- Surfaces: `interactive-card-gallery`, `orbit-card`, `magic-card`,
  `glowing-cards`
- Cursor and chrome: `grain-cursor`, `sparkle-cursor`, `cool-theme-toggle`

None of these encodes product meaning.

## What gets deleted

Every component under `apps/docs/src/components/` from the previous build:
`CockpitCanvas`, `CommandShellModal`, `DependencyWiringBoard`, `WireItGame`,
`KernelPanicModal`, `ComponentDock`, `FormOSAppShell`, `FormRenderer`,
`HeroPlayground`, `DocsHub`, `UseCaseArchipelago`, `ComparisonSection`,
`PricingEngine`.

From `apps/docs/src/lib/`: delete `os-shell.ts` and `wire-it-engine.ts`. Keep
`schema-validator.ts` and `llms-txt.ts`. Rewrite `docs-data.ts` (trim to the real
surface), `roi-calculator.ts` (trim to the three tiers), and
`prompt-to-config.ts` (reduce to a small set of example configs).

The entire previous test suite is deleted and rewritten against the new surface.

## Left to the builder

Exact Lightswind component selection per section. All copy. The illustration of
the foliage layers. The specific example form and which toggles it exposes.

## Process

Written design (this document) → implementation plan → inline execution with
per-task tests → whole-branch review → integration decision.
