import { API_REFERENCE_ENTRIES, FRAMEWORK_MATRIX } from './docs-data';

export function generateLlmsTxt(): string {
  const apiLines = API_REFERENCE_ENTRIES.map(
    (a) => `- \`${a.pkg}\` -> \`${a.signature}\`: ${a.description}`
  ).join('\n');

  const fwLines = FRAMEWORK_MATRIX.map(
    (f) => `- ${f.name} (\`${f.pkg}\`): [${f.status}] — ${f.notes}`
  ).join('\n');

  return `# form-os (@form-os/core, @form-os/react, @form-os/schema)

> "Describe your form once. Run it anywhere."
> Repository: https://github.com/BossBele/formsjs
> License: MIT (v1.0.0)

## Overview
form-os is an open-source, config-driven form operating system for TypeScript and JavaScript.
- \`@form-os/core\`: Dependency-free config normalizer, validation rule helper, and deterministic dependency engine (\`getFieldState(field, values)\`).
- \`@form-os/react\`: React Hook Form adapter with \`useFormConfig\`, \`<Field />\`, \`useField\`, \`FormFieldsProvider\`, and 11 tree-shakeable components in \`@form-os/react/fields\`.
- \`@form-os/schema\`: Portable Draft-07 JSON Schema (\`schema\`) for validating \`FormConfig\` documents across CMS, API, and LLM boundaries.

## Install
\`\`\`bash
pnpm add @form-os/core @form-os/react react-hook-form @form-os/schema
\`\`\`

## Dependency Engine Semantics
Each \`FieldConfig\` may declare \`dependencies: Dependency[]\` where \`Dependency = { name: string, value: any, type: 'hidden' | 'show' | 'required' | 'disabled' | 'readonly' }\`.
Multiple dependencies of the same \`type\` evaluate with strict **AND** semantics inside \`getFieldState(field, values)\`.

## Complete v1.0.0 API Surface
${apiLines}

## Framework & Adapter Status
${fwLines}
`;
}
