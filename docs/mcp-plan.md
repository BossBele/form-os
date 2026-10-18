---
agent: devin-local
session: equal-apogee
created: 2026-10-18T09:25:11Z
---

# form-os MCP Server (full toolkit) — @form-os/formjs bin

Ship a Model Context Protocol server inside the existing `@form-os/formjs` umbrella package so AI agents can validate FormConfig JSON, evaluate conditional field state, read the JSON schema and docs, and scaffold React form code — served over stdio today with a `node:http` Streamable HTTP mode ready for hosting.

# form-os MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give AI coding agents (Claude Code, Cursor, Devin, etc.) a first-class way to produce _correct_ form-os code: validate configs, preview the dependency engine, read authoritative docs/schema, and emit ready React scaffolds — all through one MCP server shipped as the `form-os-mcp` bin of the already-published `@form-os/formjs` package.

**Architecture:** A new `src/mcp/` tree in the root package built on `McpServer` from `@modelcontextprotocol/sdk`. A pure `createFormOsServer()` factory registers all tools/resources/prompts; `src/mcp/index.ts` is the CLI entry (shebang bin) that wires either `StdioServerTransport` (default) or a stateless `StreamableHTTPServerTransport` over `node:http` (`--http --port`). Two supporting moves make the server self-contained after publish: the hand-rolled `validateFormConfigSchema` moves from `apps/docs` into `@form-os/schema` where it belongs, and the docs data (`docs-content.ts`, `llms-txt.ts`, `example-config.ts`) moves from `apps/docs` into a new published `src/content/` module of the umbrella package — one source of truth consumed by both the docs site and the MCP.

**Tech Stack:** TypeScript (ESNext/Bundler resolution), `@modelcontextprotocol/sdk` ^1.32.1, `zod` ^3.25.x (SDK's documented input-schema pairing), tsup 8 (multi-entry ESM+CJS build), vitest 1.6, pnpm workspaces, `node:http` (zero-dep HTTP transport).

**Spec:** `docs/superpowers/specs/2026-10-18-form-os-mcp-design.md` (written in Task 1 from this plan).

## Global Constraints

- **Never write to stdout in MCP code.** stdio is the protocol channel; any `console.log` corrupts it. Logging goes to stderr (`console.error`) only. Every task's code implicitly follows this.
- **`src/mcp/` must never import `src/index.ts` or `@form-os/react`.** The bin would drag react/react-hook-form peer requirements into a Node CLI. MCP code imports only `@form-os/core`, `@form-os/schema`, `src/content/`, `@modelcontextprotocol/sdk`, `zod`, and node builtins.
- Tool names are snake*case, ≤64 chars, matching `^[a-z0-9*-]+$`: `validate_config`, `evaluate_form_state`, `get_config_schema`, `list_field_types`, `scaffold_react_form`.
- Content/resource URIs use the `form-os://` scheme; tool responses always include a `content: [{type:'text', ...}]` payload plus `structuredContent` where the handler returns data.
- `@form-os/schema` and `@form-os/formjs` bump to **1.1.0** (new public surface: `validateFormConfigSchema` export; `form-os-mcp` bin + `./content` export). `@form-os/core` and `@form-os/react` are unchanged.
- New deps must satisfy the repo's supply-chain policy: `@modelcontextprotocol/sdk@^1.32.1` (published 2026-10-05, >7 days old) and `zod@^3.25.76`. No other new dependencies — HTTP transport uses `node:http`, not express.
- Keep `console`/`process` access confined to `src/mcp/index.ts`; all other `src/mcp/` files are pure and importable in tests.
- Repo test command: `pnpm test` (vitest workspace). Typecheck: `pnpm typecheck` — note it only filters `packages/*`, so root typecheck happens implicitly via `pnpm build` (tsup) and vitest.

## Review Focus

Failure modes the spec implies but happy-path tests don't cover — each gets a pinned test in the owning task:

1. **stdout contamination** — a stray `console.log` inside any tool/resource handler silently corrupts the stdio stream. The protocol smoke test in Task 5 reads raw stdio bytes? No — simpler: the InMemoryTransport tests can't catch stdout writes, so add a test that monkey-patches `console.log` during a `callTool` and asserts it was never invoked. (Task 4)
2. **`evaluate_form_state` receiving a malformed config** — `normalizeConfig` throws on non-object input; the tool must return `isError: true` with a readable message, not crash the server. (Task 4)
3. **`scaffold_react_form` with a hostile/invalid `componentName`** — e.g. `"my-form"; process.exit()//`. Sanitize to a valid TS identifier (`/^[A-Z][A-Za-z0-9]*$/`, fallback `GeneratedForm`); the tool refuses or coerces, never emits injected code. (Task 4)
4. **HTTP mode: concurrent POSTs and GET/DELETE** — each POST gets its own server+transport pair (SDK stateless pattern); GET and DELETE return 405 JSON-RPC errors; malformed JSON body returns a JSON-RPC parse error, not a stack trace. (Task 6)
5. **Docs-site drift after the content move** — the moved `generateLlmsTxt`/`DOC_CHAPTERS` must still satisfy every existing `apps/docs` test unchanged except import paths; `pnpm --filter @form-os/docs build` must succeed. (Tasks 2–3)

---

### Task 1: Repo docs — write the design spec and this plan into `docs/superpowers/`

The repo's convention (see `2026-10-17-form-os-enchanted-forest`) is a spec + plan pair under `docs/superpowers/`.

**Files:**

- Create: `docs/superpowers/specs/2026-10-18-form-os-mcp-design.md`
- Create: `docs/superpowers/plans/2026-10-18-form-os-mcp.md`

- [ ] **Step 1: Write the design spec** — intent (agents generate correct form-os code), goals, non-goals (no remote registry, no submissions backend, no svelte adapter promises), anti-goals (drift between MCP content and docs site), the content-move rationale, and the tool/resource/prompt surface decided below.
- [ ] **Step 2: Write the repo plan doc** — copy this plan's task structure verbatim into the plans file so it travels with the repo.
- [ ] **Step 3: Commit**

```bash
git add docs/superpowers
git commit -m "docs: spec and plan for form-os MCP server"
```

---

### Task 2: Move `validateFormConfigSchema` into `@form-os/schema`

The validator checks the schema file that lives in this package; `apps/docs` was a temporary squatter. The MCP needs it as a dependency, and publishing it is a genuine improvement (README already tells users to "validate against the JSON schema" — now the package ships the validator too).

**Files:**

- Create: `packages/schema/src/validate.ts` (move of `apps/docs/src/lib/schema-validator.ts`, unchanged)
- Modify: `packages/schema/src/index.ts` — add exports
- Modify: `packages/schema/package.json` — version `1.1.0`
- Modify: `apps/docs/src/__tests__/use-cases.test.tsx:4`, `apps/docs/src/__tests__/live-example.test.tsx:6` — import from `@form-os/schema` instead of `../lib/schema-validator`
- Delete: `apps/docs/src/lib/schema-validator.ts`
- Test: `packages/schema/src/__tests__/validate.test.ts`

**Interfaces:**

- Produces: `validateFormConfigSchema(input: unknown): SchemaValidationResult`, `assertValidFormConfig(config: FormConfig): FormConfig`, and `interface SchemaValidationResult { valid: boolean; errors: string[]; fieldCount: number; dependencyCount: number; schemaId: string }` — all exported from `@form-os/schema`. Tasks 4's `validate_config` tool consumes `validateFormConfigSchema`.

- [ ] **Step 1: Write the failing test** — `packages/schema/src/__tests__/validate.test.ts`: import `validateFormConfigSchema` from `'../index'`; assert `valid: false` + error strings for `{}` (missing fields), a field missing `name`, a bad dependency `type`, an unknown rules key; assert `valid: true`, `fieldCount`, `dependencyCount` for a small valid config.
- [ ] **Step 2: Run `pnpm --filter @form-os/schema test` — expect FAIL** (`validateFormConfigSchema` not exported).
- [ ] **Step 3: Move the file** — `git mv` the validator to `packages/schema/src/validate.ts`; export the two functions + `SchemaValidationResult` type from `packages/schema/src/index.ts`; bump `version` to `1.1.0`.
- [ ] **Step 4: Rewire docs tests** — change the two `apps/docs` import lines to `import { validateFormConfigSchema } from '@form-os/schema';`; delete `apps/docs/src/lib/schema-validator.ts`.
- [ ] **Step 5: Verify** — `pnpm --filter @form-os/schema build && pnpm --filter @form-os/schema test && pnpm --filter @form-os/docs test` all pass.
- [ ] **Step 6: Commit** — `git commit -m "feat(schema): ship validateFormConfigSchema from @form-os/schema"`.

---

### Task 3: Move docs content into the umbrella package (`src/content/`, `./content` export)

`docs-content.ts`, `llms-txt.ts`, and `example-config.ts` are pure data + pure functions — the canonical "knowledge" of the library. They belong in the umbrella package so the MCP serves the same words the website renders. This is the single source-of-truth move that prevents docs drift.

**Files:**

- Create: `src/content/docs-content.ts`, `src/content/llms-txt.ts`, `src/content/example-config.ts` (moves, unchanged), `src/content/index.ts` (barrel re-exporting all three)
- Modify: `tsup.config.ts` — entry becomes `{ index: 'src/index.ts', content: 'src/content/index.ts' }` (object map → `dist/content.js`; keep existing `format`/`external`)
- Modify: `package.json` — add `exports["./content"]` → `{ "types": "./dist/content.d.ts", "import": "./dist/content.js", "require": "./dist/content.cjs" }`
- Modify: `apps/docs/package.json` — add `"@form-os/formjs": "workspace:*"` to `dependencies`
- Modify: `apps/docs/next.config.mjs` — `transpilePackages` gains `'@form-os/formjs'`
- Modify: `apps/docs` import sites → `@form-os/formjs/content`:
  - `src/app/llms.txt/route.ts` (generateLlmsTxt)
  - `src/components/example/FormOSExample.tsx` (EXAMPLE_CONFIG, EXAMPLE_TOGGLES)
  - `src/components/docs/ApiReference.tsx` (API_ENTRIES, ROADMAP_ENTRIES)
  - `src/components/docs/DocsHub.tsx` (DOC_CHAPTERS)
  - `src/components/docs/DocChapter.tsx` (type DocChapterData)
  - `src/__tests__/live-example.test.tsx`, `src/__tests__/docs-hub.test.tsx`
- Delete: `apps/docs/src/lib/{docs-content,llms-txt,example-config}.ts`
- Test: existing `apps/docs` tests are the regression suite — no new test file needed; assert they pass unmodified in behavior.

**Interfaces:**

- Produces: subpath `@form-os/formjs/content` exporting `DOC_CHAPTERS`, `API_ENTRIES`, `ROADMAP_ENTRIES`, `generateLlmsTxt`, `EXAMPLE_CONFIG`, `EXAMPLE_TOGGLES` and their types — consumed by `src/mcp/resources.ts` (Task 5) and `apps/docs`.

- [ ] **Step 1: Move the three files** (`git mv`) into `src/content/`; create `src/content/index.ts` re-exporting all public names from each.
- [ ] **Step 2: Update `tsup.config.ts` and `package.json`** as above; run `pnpm install` then `pnpm build:root` — expect `dist/content.js`, `dist/content.cjs`, `dist/content.d.ts`.
- [ ] **Step 3: Rewire `apps/docs`** — dep, transpilePackages, and all eight import sites; delete the three lib files.
- [ ] **Step 4: Verify** — `pnpm --filter @form-os/docs test` green; `pnpm --filter @form-os/docs build` succeeds.
- [ ] **Step 5: Commit** — `git commit -m "refactor: move docs content into @form-os/formjs ./content"`.

---

### Task 4: MCP server core — factory, stdio entry, and the five tools

**Files:**

- Create: `src/mcp/server.ts` — `createFormOsServer(): McpServer` registers tools (here), resources (Task 5), prompts (Task 5)
- Create: `src/mcp/tools.ts` — `registerTools(server: McpServer)`
- Create: `src/mcp/scaffold.ts` — `generateReactForm(config: unknown, opts?: { componentName?: string; submitLabel?: string }): { code: string; warnings: string[] }`
- Create: `src/mcp/index.ts` — `#!/usr/bin/env node`; arg parsing; stdio default
- Modify: `package.json` — `bin: { "form-os-mcp": "./dist/mcp.js" }`, `engines: { "node": ">=18" }`, deps `@modelcontextprotocol/sdk`, `zod`; bump `version` to `1.1.0`
- Modify: `tsup.config.ts` — entry map gains `mcp: 'src/mcp/index.ts'`
- Modify: `vitest.workspace.ts` — add inline root project `{ test: { name: 'root', include: ['src/**/*.test.ts'], environment: 'node' } }`
- Test: `src/mcp/__tests__/tools.test.ts`, `src/mcp/__tests__/scaffold.test.ts`

**Interfaces:**

- Consumes: `validateFormConfigSchema` (Task 2), `normalizeConfig`/`getFieldState`/`createDefaultValues`/`schema` (existing), `EXAMPLE_CONFIG`/`API_ENTRIES`/`generateLlmsTxt` (Task 3, used in Task 5).
- Produces: `createFormOsServer()` — used by `index.ts`, the HTTP transport (Task 6), and all protocol tests.

**Tool contracts (exact):**

| Tool                  | Input (zod shape)                                                               | Output (structuredContent)                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate_config`     | `{ config: z.unknown() }`                                                       | `{ valid: boolean; errors: string[]; warnings: string[]; fieldCount: number; dependencyCount: number }`                                                                                                 |
| `evaluate_form_state` | `{ config: z.unknown(), values: z.record(z.string(), z.any()) }`                | `{ fields: Array<{ name, type, visible, required, disabled, readonly, defaultValue }> }` — or `isError` if config won't normalize                                                                       |
| `get_config_schema`   | `{}`                                                                            | schema object verbatim                                                                                                                                                                                  |
| `list_field_types`    | `{}`                                                                            | `{ builtin: string[] /* the 10 keys of defaultComponents */, notes: string[] }` — notes cover select-multiple `[]` default, checkbox/switch `false` default, FieldTypeMap augmentation for custom types |
| `scaffold_react_form` | `{ config: z.unknown(), componentName?: z.string(), submitLabel?: z.string() }` | `{ code: string; warnings: string[] }`                                                                                                                                                                  |

`validate_config` = `validateFormConfigSchema` output **plus** semantic warnings: dependency `.name` referencing no declared field; dependency referencing the field itself; `options` present on a type other than `select`/`radio`; `select`/`radio` missing `options`; field carrying both `show` and `hidden` deps.

`evaluate_form_state`: `normalizeConfig(config)` inside try/catch (throw → `isError` + message), merge `createDefaultValues(fields)` under `values`, then `getFieldState(field, merged)` per field.

`scaffold.ts` emits a complete `.tsx` file (single template literal): `'use client'`, imports `{ useFormConfig, Field, FormFieldsProvider }` from `@form-os/react` and `{ defaultComponents }` from `@form-os/react/fields`, an exported `const config: FormConfig = <JSON>` (pretty-printed, 2-space), and a `function <ComponentName>()` returning the `FormFieldsProvider`+`form`+`fields.map(Field)`+submit-button tree from the README pattern — `submitLabel` (default `"Submit"`) and `componentName` (default `GeneratedForm`, sanitized to `/^[A-Z][A-Za-z0-9]*$/` else replaced).

- [ ] **Step 1: Write failing tests** — `tools.test.ts` uses the SDK pair: `InMemoryTransport.createLinkedPair()`, `new Client(...)`, `client.connect(clientTransport)`, `createFormOsServer().connect(serverTransport)`, then `client.callTool(...)`. Assert: valid EXAMPLE_CONFIG → `valid: true`; garbage → `valid:false` + errors; dangling dep name → warning; `evaluate_form_state` on EXAMPLE_CONFIG with `{ taxJurisdiction: 'US' }` → `vatNumber.visible === false`, `ein.visible === true`; bad config → `isError`. `scaffold.test.ts` calls `generateReactForm` directly: output contains `useFormConfig`, every field name, the submit label; `componentName: 'bad name'` → `GeneratedForm`. Include the **stdout-contamination test**: spy on `console.log` across a `callTool` and assert zero calls.
- [ ] **Step 2: Run `pnpm test` — expect FAIL** (module not found).
- [ ] **Step 3: Install deps** — `pnpm add @modelcontextprotocol/sdk@^1.32.1 zod@^3.25.76` (root workspace package).
- [ ] **Step 4: Implement** `scaffold.ts`, `tools.ts`, `server.ts`, `index.ts`; update `tsup.config.ts`, `package.json`, `vitest.workspace.ts`. `index.ts` for now: `#!/usr/bin/env node` + `createFormOsServer().connect(new StdioServerTransport())`.
- [ ] **Step 5: Verify** — `pnpm test` green; `pnpm build` produces `dist/mcp.js` starting with `#!/usr/bin/env node`; `echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' | node dist/mcp.js` returns an `initialize` result with `serverInfo.name`.
- [ ] **Step 6: Commit** — `git commit -m "feat: form-os MCP server — stdio transport and five tools"`.

---

### Task 5: Resources and prompts

**Files:**

- Create: `src/mcp/resources.ts` — `registerResources(server: McpServer)`
- Create: `src/mcp/prompts.ts` — `registerPrompts(server: McpServer)`
- Modify: `src/mcp/server.ts` — call both registrars
- Test: `src/mcp/__tests__/resources-prompts.test.ts`

**Resources (exact URIs):**

- `form-os://docs/llms.txt` → `text/plain`, `generateLlmsTxt()`
- `form-os://docs/schema` → `application/json`, the draft-07 schema
- `form-os://docs/api` → `application/json`, `API_ENTRIES`
- `form-os://examples/company-onboarding` → `application/json`, `EXAMPLE_CONFIG`

**Prompts:**

- `create_form` — arg `description` (required): returns a user message that walks the agent through: fetch `form-os://docs/schema` + `llms.txt`, draft a `FormConfig` for `description`, call `validate_config` until `valid`, then `scaffold_react_form`.
- `register_field_type` — arg `type_name` (required): returns instructions for `FieldTypeMap` module augmentation + writing a `FieldComponentProps` component + registering it in `FormFieldsProvider`.

- [ ] **Step 1: Write the failing test** — `client.readResource({ uri: 'form-os://docs/llms.txt' })` returns text containing `# form-os`; `form-os://examples/company-onboarding` parses to an object with `fields.length === 10`; `client.getPrompt({ name: 'create_form', arguments: { description: 'a signup form' } })` returns messages whose text mentions `validate_config`.
- [ ] **Step 2: Run to verify FAIL.**
- [ ] **Step 3: Implement** `resources.ts` + `prompts.ts`, wire into `server.ts`.
- [ ] **Step 4: Run to verify PASS; commit** — `git commit -m "feat(mcp): add docs/schema/example resources and authoring prompts"`.

---

### Task 6: HTTP transport (`--http`)

**Files:**

- Modify: `src/mcp/index.ts` — parse `--http`, `--port <n>` (default 3100), `--host <h>` (default `127.0.0.1`), `--help`; unknown args → stderr + exit 1
- Create: `src/mcp/http.ts` — `startHttpServer(port: number, host: string): http.Server`
- Test: `src/mcp/__tests__/http.test.ts` — start on port 0, real `fetch` POST

**Design:** stateless Streamable HTTP per the SDK pattern — for each `POST /mcp`: create `new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })`, `createFormOsServer().connect(transport)`, read the JSON body, `transport.handleRequest(req, res, body)`, close both on `res` finish. `GET`/`DELETE` → 405 with JSON-RPC error body; non-`/mcp` path → 404; body parse failure → JSON-RPC `-32700` response. All logging to stderr.

- [ ] **Step 1: Write the failing test** — start server on an ephemeral port; POST a JSON-RPC `initialize` → expect `result.serverInfo`; POST `tools/list` → contains `validate_config`; GET → 405; POST malformed JSON → error response.
- [ ] **Step 2: Run to verify FAIL.**
- [ ] **Step 3: Implement** `http.ts` + arg parsing in `index.ts`.
- [ ] **Step 4: Verify** — tests green; manual: `node dist/mcp.js --http --port 3100 &` then `curl -X POST localhost:3100/mcp -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'`.
- [ ] **Step 5: Commit** — `git commit -m "feat(mcp): add stateless Streamable HTTP transport (--http --port)"`.

---

### Task 7: Publishing surface, docs, and final verification

**Files:**

- Modify: `README.md` — new "MCP server" section
- Modify: `src/content/llms-txt.ts` — one line in the header block naming the MCP entry point
- Modify: `package.json` — confirm `bin`/`engines`/`files` final state
- Modify: `docs/gemini-docs-prompt.md`? No — leave alone.

**README content:** purpose sentence; `npx -y @form-os/formjs` invocation; `.mcp.json` / Claude Desktop / Cursor config snippets (`{ "command": "npx", "args": ["-y", "@form-os/formjs"] }`); the five-tool table; `--http --port` usage. While editing: the README's `FormConfig` example shows `title`/`submitLabel` keys that don't exist on the type — remove them (pre-existing doc bug worth fixing while we're here).

- [ ] **Step 1:** Write the README section + fix the stale example; add the llms.txt line.
- [ ] **Step 2:** Full green run: `pnpm install && pnpm build && pnpm test && pnpm typecheck && pnpm --filter @form-os/docs build`.
- [ ] **Step 3:** `npm pack --dry-run` on the root package — confirm `dist/mcp.js` is in the tarball and `bin` resolves.
- [ ] **Step 4:** Real-harness smoke test — register `{ "form-os": { "command": "node", "args": ["<abs path>/dist/mcp.js"] } }` in a local MCP config (e.g. `~/.config/devin/` or `.mcp.json`) and confirm `tools/list` + `validate_config` work end-to-end.
- [ ] **Step 5: Commit** — `git commit -m "docs+release: document the MCP server; bump @form-os/schema and @form-os/formjs to 1.1.0"`.

## Verification

- [ ] `pnpm test` — all vitest projects green including new root project
- [ ] `pnpm build` — `dist/{index,content,mcp}.{js,cjs,d.ts}` emitted; `head -1 dist/mcp.js` is the shebang
- [ ] `pnpm --filter @form-os/docs build` — docs site builds against moved imports
- [ ] stdio smoke: initialize + tools/list + a `validate_config` call via piped JSON-RPC
- [ ] HTTP smoke: initialize + tools/list via curl
- [ ] `npm pack --dry-run` — bin + dist in tarball
- [ ] End-to-end: configure a real MCP client against the local bin, list tools, run `validate_config` on a pasted config, run `scaffold_react_form`, confirm the emitted `.tsx` typechecks in a scratch file

## Risks / Considerations

- **New docs build-order coupling** — `apps/docs` now needs the root `dist/` built before `dev`/`build`. Same pattern already exists for the three leaf packages (their exports point at `dist`), so it's consistent — but mention in README/AGENTS. _Lighter alternative if rejected at review:_ root `src/mcp/` imports `apps/docs/src/lib/*` directly and tsup bundles them into `dist/mcp.js` — zero `apps/docs` churn, but it inverts the workspace dependency direction (published package's build depends on an app).
- **`./content` becomes public API** — once published at 1.1.0 it can't be un-exported without a major bump. Acceptable: it's documented, versioned data.
- **Node floor** — SDK requires Node ≥18; `engines` declares it. Users on older Node get a clear npx warning.
- **HTTP auth** — stateless HTTP mode has no auth; it's for local/hosted-behind-proxy use. The plan deliberately does not add authn — flag it in README so nobody exposes it naked on the internet.
- **zod version** — pinned to v3 line, the pairing the SDK documents; if the SDK's peer range favors v4 at install time, switching is a one-line change.

## Recommended execution

Native execution (this session implements every task): the seven tasks are small, sequential, and share the `src/mcp/` + moved-file context tightly; subagent isolation would cost more than the independent review it buys. One fresh-eyes review at the end is worthwhile because Task 3 touches every docs import site.
