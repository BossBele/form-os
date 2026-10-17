import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  API_ENTRIES,
  DOC_CHAPTERS,
  ROADMAP_ENTRIES,
} from '../lib/docs-content';
import { generateLlmsTxt } from '../lib/llms-txt';
import { DocsHub } from '../components/docs/DocsHub';

describe('Task 6: Documentation hub', () => {
  it('covers quickstart, core, react and schema', () => {
    expect(DOC_CHAPTERS.map((chapter) => chapter.id)).toEqual([
      'quickstart',
      'core',
      'react',
      'schema',
    ]);
  });

  it('documents every real v1.0.0 export and invents none', () => {
    const names = API_ENTRIES.map((entry) => entry.name).sort();
    expect(names).toEqual(
      [
        'Field',
        'FormFieldsProvider',
        'coercePattern',
        'createDefaultValues',
        'createFieldRegistry',
        'defaultComponents',
        'getDefaultValue',
        'getFieldState',
        'getValidationRules',
        'normalizeConfig',
        'schema',
        'useField',
        'useFieldComponents',
        'useFormConfig',
      ].sort()
    );
  });

  it('signs every entry with a real signature, never an empty string', () => {
    for (const entry of API_ENTRIES) {
      expect(entry.signature.length).toBeGreaterThan(15);
      expect(entry.description.length).toBeGreaterThan(30);
      expect(entry.example.length).toBeGreaterThan(10);
    }
  });

  it('marks every non-React adapter as roadmap', () => {
    expect(ROADMAP_ENTRIES.length).toBeGreaterThanOrEqual(4);
    expect(ROADMAP_ENTRIES.every((entry) => entry.status === 'Roadmap')).toBe(
      true
    );
    const adapters = ROADMAP_ENTRIES.filter(
      (entry) =>
        entry.pkg.includes('svelte') ||
        entry.pkg.includes('vue') ||
        entry.pkg.includes('solid') ||
        entry.pkg.includes('native')
    );
    expect(adapters.length).toBe(4);
  });

  it('renders the hub with a chapter nav and the install command', () => {
    const html = renderToString(<DocsHub />);
    expect(html).toContain('Quickstart');
    expect(html).toContain('@form-os/core');
    expect(html).toContain('@form-os/react');
    expect(html).toContain('@form-os/schema');
    expect(html).toContain('pnpm add @form-os/core @form-os/react react-hook-form');
  });

  it('generates llms.txt from the same content the hub renders', () => {
    const text = generateLlmsTxt();
    expect(text).toContain('https://github.com/BossBele/formsjs');
    expect(text).toContain('getFieldState');
    for (const entry of API_ENTRIES) {
      expect(text).toContain(entry.name);
    }
    for (const entry of ROADMAP_ENTRIES) {
      expect(text).toContain(entry.pkg);
    }
  });
});
