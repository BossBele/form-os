# Gemini 4 Prompt — form-os Documentation Website

Copy everything inside the fenced block below and paste it into Gemini 4. It is fully self-contained — no repo access required — but you may also attach a link to https://github.com/BossBele/formsjs for reference.

````markdown
You are a world-class product designer, engineer, and technical writer. You are building the official documentation and marketing website for **form-os** — an open-source, config-driven form library for JavaScript/TypeScript (https://github.com/BossBele/formsjs, npm: `@form-os/core`, `@form-os/react`, `@form-os/schema`).

form-os is to forms what better-auth is to auth: a declarative, ownable layer that turns a messy, solved-nowhere problem into a solved-everywhere one. Your job is to produce a documentation website so clear, interactive, and visually engaging that it could plausibly drive a 10x increase in adoption — by developers AND by the non-developers (product managers, founders, ops teams) who decide which tools get adopted.

Choose the stack yourself (Next.js, Astro, or similar — justify briefly). Deliver the site page by page, complete and buildable, with all code included. If the full site exceeds one response, deliver it in a structured sequence: (1) information architecture + design system, (2) landing page + playground, (3) docs core pages, (4) use cases + comparisons, (5) pricing + enterprise, then remaining pages — never summarize or skip sections silently.

=================================================================

1. # PRODUCT FACTS — DOCUMENT THESE EXACTLY

Only document APIs that exist. Anything aspirational must be clearly labeled "Roadmap". Do not invent APIs, props, or packages.

**Monorepo packages (v0.6.0, MIT license):**

- `@form-os/core` — dependency-free config parser, dependency engine, and validation helpers. Runs anywhere JavaScript runs.
- `@form-os/react` — react-hook-form adapter with tree-shakeable field components. Peer deps: `react`, `react-hook-form`.
- `@form-os/schema` — JSON Schema + TypeScript types for form configs.
- `@form-os/svelte` — placeholder package. Label all non-React adapters as **Roadmap**.

**Install:** `pnpm add @form-os/core @form-os/react react-hook-form` (plus optional `@form-os/schema`).

**`@form-os/core` exports:**

- `normalizeConfig(config)` — normalizes `FieldConfig[]` or `FormConfig` into a canonical form.
- `createDefaultValues(fields)`, `getDefaultValue(field)` — default-value resolution.
- `getFieldState(field, values)` — the dependency engine. Returns `{ visible, required, disabled, readonly, defaultValue }` evaluated against live form values.
- `createFieldRegistry` — maps field types to components.
- `getValidationRules(field)`, `coercePattern(pattern)` — validation helpers.

**Core types:** `FormConfig`, `FieldConfig`, `FieldTypeMap`, `FieldType`, `Choice`, `Dependency`, `DependencyType`, `ValidationRules`, `ValidationRule`, `ValidationValue`, `ValidationValueMessage`, `ValidationMode`, `ReValidationMode`, `FieldState`, `FieldRegistry`.

**FieldConfig shape:** `{ name, type, label?, description?, placeholder?, defaultValue?, dependencies?, rules?, options?, props? }`.
**FormConfig shape:** `{ validationMode?, reValidateMode?, fields: FieldConfig[] }`.

**Dependency engine** — each field may declare `dependencies: Dependency[]` where `Dependency = { name, value, type }` and `type` is one of:

- `hidden` — hide this field when the dependency value matches
- `show` — show this field only when the dependency value matches
- `required` — make required conditionally
- `disabled` — disable conditionally
- `readonly` — make read-only conditionally

Multiple dependencies of the same type AND together. This is a flagship feature — give it first-class treatment.

**Validation rules** (`rules: ValidationRules`): `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `disabled`, `readonly` — each accepts a raw value or `{ value, message }` for custom error messages. `pattern` accepts a `RegExp` or a string coerced via `coercePattern`. `validationMode`/`reValidateMode` map to react-hook-form modes (`onChange`, `onBlur`, `onSubmit`, `onTouched`, `all`).

**`@form-os/react` exports:** `useFormConfig`, `Field` (+ `FieldProps`), `useField`, `FormFieldsProvider`, `useFieldComponents`, `ComponentsMap`, `FormFieldsProviderProps` — plus react-hook-form re-exports: `FormProvider`, `useFormContext`, `useForm`, `Control`, `RegisterOptions`, `UseFormProps`.

- `useFormConfig(config)` returns a react-hook-form `UseFormReturn` plus `{ fields }` — normalized fields ready to render.
- `<Field field={field} control={control} component={?Component} />` renders one configured field; `component` overrides the registered component for that field.
- `FormFieldsProvider components={map}` registers field-type → component mappings globally.
- `useField(field, control)` returns `{ field, fieldState, state }` for building fully custom field UIs.

**Built-in field components** (importable from `@form-os/react/fields`, tree-shakeable): `TextField`, `NumberField`, `EmailField`, `PasswordField`, `TextAreaField`, `DateField`, `SelectField`, `CheckboxField`, `RadioField`, `SwitchField`, `DefaultField`, and `defaultComponents` (a ready-made registry covering the standard types).

**Custom field types** — TypeScript enforces custom types via module augmentation:

```ts
declare module "@form-os/core" {
  interface FieldTypeMap {
    "date-picker": {};
    "rich-text": { toolbar?: string[] };
  }
}
```
````

Then register matching components in `FormFieldsProvider`.

**`@form-os/schema`:** exports `schema` (a JSON Schema for any `FormConfig`) — validate configs with Ajv or any JSON Schema validator. This is what makes configs portable and machine-generatable: forms can be authored by non-devs, stored in a CMS, served by an API, or generated by an LLM — and validated everywhere.

# ================================================================= 2. POSITIONING — "THE FORM OS"

Build the narrative around a single idea: **a form is not markup — it's a configuration.**

- The `FormConfig` is the source of truth — the "form image."
- `@form-os/core` is the kernel: dependency-free, framework-agnostic, runs anywhere.
- Framework adapters (`@form-os/react` today) are runtimes that boot the config into a real form.
- `@form-os/schema` is the ABI — the contract that lets configs travel between tools, teams, and machines.

One-liner to anchor the site: **"Describe your form once. Run it anywhere."** Developer frame: forms become data — versionable, testable, generated, portable. Non-developer frame: the shape of a form is finally a thing a business can own, move between tools, and change without a rewrite. Use the better-auth parallel explicitly where it helps: "better-auth made auth a layer you own instead of rent. form-os does that for forms."

# ================================================================= 3. AUDIENCE — TWO TRACKS, ONE SITE

- **Developer track:** quickstart, API reference, recipes, adapter authoring, TypeScript deep-dives. Assume competence; respect time.
- **Non-developer track:** plain-English explanations of every concept, a visual playground where they can build a real form without writing code, and use-case pages framed around business outcomes (lead capture, onboarding, compliance intake — not `FieldConfig`).

Every page should be legible to both: concept first in plain language, then the code that implements it.

# ================================================================= 4. REQUIRED SITE MAP

**Landing page** — hero with an embedded LIVE playground: an editable form config (JSON/TS) on one side, the rendered form updating in real time on the other, including dependency rules reacting live (e.g., toggling a select reveals a conditional field). This playground is the single most important element on the site — a visitor should understand form-os in under 60 seconds without reading a word. Below: the Form OS mental-model diagram (config → core → adapter → rendered form), feature highlights, framework matrix, testimonials/social proof placeholders, and CTAs (Get Started / Playground / GitHub).

**Docs:**

- Quickstart: install → first config → rendered form, under 5 minutes, with copy-pasteable commands in pnpm/npm/yarn tabs.
- Core concepts: FormConfig anatomy, the dependency engine (with an interactive graph — fields as nodes, dependency rules as edges, live-highlighting as values change), validation rules, default values, modes.
- React adapter: useFormConfig, Field, useField, FormFieldsProvider, building custom field components, the built-in field component gallery (each of the 11 components shown rendered with its config).
- Schema package: validating configs with Ajv, why a schema matters (machine-readable forms).
- Full API reference: every export listed in section 1, with signature, description, params, return type, and a runnable example.

**Use-case library** — each a dedicated page with a working demo + config:

- Contact/lead-capture forms · onboarding flows · dynamic surveys and quizzes · admin/CRUD panels · multi-step wizards (conditional steps via dependencies) · compliance/regulated intake (conditional required fields, disclosures) · server-driven forms (config from an API) · CMS-driven forms · AI-generated forms (LLM outputs a config, schema validates it) · white-label form-builder products (build your own Typeform on top of form-os).

**Framework coverage:** React today; the dependency-free core anywhere JS runs (vanilla JS, Node, edge workers, SSR); a "build your own adapter" guide (what an adapter must implement); Svelte/Vue/Angular/Solid/React Native as labeled roadmap entries.

**Comparison page:** vs. raw react-hook-form/Formik (form-os removes per-form boilerplate — it's a superset, not a competitor, since the React adapter is built on RHF), vs. JSON Forms (lighter, adapter-based, you own the components), vs. hosted builders like Typeform/Formspree (own your forms, no lock-in, no per-response pricing).

**Pricing page + Enterprise page** — built per section 6.

**Supporting pages:** ecosystem/roadmap, FAQ, changelog-style version notes, community/GitHub links. Include SEO meta, Open Graph cards, a sitemap-ready structure, and an `llms.txt`-friendly content organization so AI tools can ingest the docs.

# ================================================================= 5. DESIGN & INTERACTIVITY BAR

- Commit to a bold, distinctive aesthetic — the polish tier of better-auth, Linear, and Vercel docs. Dark-first theme with a refined light option. Choose characterful typography (a distinctive display font paired with a readable body/code family — NOT Inter, Roboto, or generic system stacks). Dominant color palette with sharp accents; no purple-gradient-on-white cliché, no cookie-cutter layouts.
- Orchestrated motion: a choreographed page-load reveal, scroll-triggered section entrances, micro-interactions on code blocks (copy feedback), the playground, and the dependency graph. Motion must serve comprehension, not decoration.
- Every code sample: syntax-highlighted, copyable, runnable as shown, with package-manager/framework tabs where applicable.
- Interactive elements required: the homepage playground; the dependency-graph visualizer; a field-component gallery with live config toggles; the value-equation visual on the pricing page.
- Accessibility: WCAG AA minimum — keyboard-navigable playground, labeled controls, sufficient contrast, reduced-motion support. Fully responsive; the docs must be excellent on a phone.
- Performance: fast first paint, no layout shift, playground that works client-side without a backend.

# ================================================================= 6. COMMERCIAL OFFERINGS — $100M OFFERS FRAMEWORK

The core library is free, open-source, MIT forever — say so loudly. On top of it, design a paid offerings system (a pricing page + enterprise page) that enterprises can genuinely buy, modeled on how better-auth monetizes (free core + paid hosted infrastructure + enterprise tier). You have freedom to invent the product catalog — invent plausibly, grounded in what the config-driven architecture makes possible.

Construct every offer with Alex Hormozi's $100M Offers framework:

**Value equation** — for each offer, explicitly maximize the numerator and minimize the denominator:

- Dream outcome ↑: "every form your business will ever need — designed once, owned forever, rendered anywhere."
- Perceived likelihood ↑: guarantees, live proof-in-product (the playground IS the demo), migration tools, named customer outcomes.
- Time delay ↓: minutes to first form; same-day pilot; "your existing forms become configs in a day."
- Effort & sacrifice ↓: one config instead of per-form code; hosted infrastructure instead of self-managed plumbing.

**Problem decomposition → bonus stack:** enumerate every post-adoption task and obstacle (visual design, hosting submissions, spam/abuse, analytics, compliance, audit trails, team onboarding, migrations, custom components) and convert each into a NAMED bonus item with an anchored dollar value, stacked into the tiers.

**Tier architecture** (invent names using the MAGIC naming pattern — reason for the name, announce the differentiator, give it a nickname-worthy shape):

- **Open Source / Free** — the full library, MIT, community support. Anchor generosity: everything needed to build is free forever.
- **Pro / Cloud infrastructure** — a hosted layer in the spirit of better-auth Infrastructure: e.g., a config dashboard, hosted form endpoints & submission handling, form analytics (completion rates, drop-off per field), audit logs, abuse/spam protection, team seats — usage-based pricing with a generous free tier.
- **Enterprise / Custom** — SSO/SCIM, private field-component registry, data residency & compliance (GDPR/HIPAA posture), custom MSA/DPA, SLAs, dedicated Slack, implementation assistance, custom adapter development.
- Consider additional offers the framework surfaces: done-with-you form migration, a visual builder product, a component/theme marketplace, priority support plans, certification/training.

**Guarantees:** at least one strong, concrete guarantee — conditional or performance-based (e.g., "ship your first production form in 7 days or our engineers build it with you free"). No vague promises.

**Scarcity & urgency, tastefully:** founding-member pricing, limited onboarding cohorts — mechanisms a skeptical developer respects, never dark patterns.

**Pricing presentation:** itemized value stack per tier (each named bonus with its dollar anchor) so the price reads irrational to refuse; a comparison table; and an interactive value-equation visual showing where each tier moves the four variables.

# ================================================================= 7. QUALITY GATES — VERIFY BEFORE DELIVERING

- Accuracy: every API name, signature, and behavior matches section 1 exactly. Anything beyond it is labeled "Roadmap." Zero invented APIs presented as real.
- Completeness: every section of the site map delivered — no dead links, no TODO placeholders, no lorem ipsum.
- The playground, dependency visualizer, field gallery, and pricing value visual actually work — not static images.
- Builds and runs cleanly; passes a11y (WCAG AA) and mobile checks.
- Tone: confident, precise, developer-respecting. Marketing pages may be bold; docs pages are always accurate.

Deliver the information architecture and design system first, then build the site in the sequence above.

```

```
