import { API_ENTRIES, DOC_CHAPTERS, ROADMAP_ENTRIES } from './docs-content';

/**
 * Machine-readable summary of this documentation, served at /llms.txt.
 * Sourced from the same objects the hub renders, so the two cannot drift.
 */
export function generateLlmsTxt(): string {
  const chapters = DOC_CHAPTERS.map(
    (chapter) => `### ${chapter.title}\n\n${chapter.lede}\n\n${chapter.prose.join('\n\n')}`
  ).join('\n\n');

  const api = API_ENTRIES.map(
    (entry) =>
      `- \`${entry.pkg}\` — \`${entry.signature}\`\n  ${entry.description}\n  Example: \`${entry.example.split('\n')[0]}\``
  ).join('\n');

  const roadmap = ROADMAP_ENTRIES.map(
    (entry) => `- ${entry.pkg}: ${entry.status}. ${entry.note}`
  ).join('\n');

  return `# form-os

> Describe your form once. Run it anywhere.

form-os is an open-source, configuration-driven form library for JavaScript and
TypeScript. A form is a data file rather than markup, which makes it
versionable, testable, portable, and safe to generate.

- Repository: https://github.com/BossBele/formsjs
- License: MIT
- Packages: @form-os/core, @form-os/react, @form-os/schema

## Install

    pnpm add @form-os/core @form-os/react react-hook-form

Add @form-os/schema when configurations need checking outside a browser.

## How the dependency engine works

Each field may carry a \`dependencies\` array of \`{ name, value, type }\` entries,
where \`type\` is one of \`show\`, \`hidden\`, \`required\`, \`disabled\` or
\`readonly\`. \`getFieldState(field, values)\` evaluates them against the current
values and returns \`{ visible, required, disabled, readonly, defaultValue }\`.

Conditions of the same \`type\` on one field are combined with AND: every one of
them must match before the condition takes effect.

## Documentation

${chapters}

## API surface (v1.0.0)

${api}

## Adapters not yet built

${roadmap}
`;
}
