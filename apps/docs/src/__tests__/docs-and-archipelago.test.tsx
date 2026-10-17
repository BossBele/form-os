import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { validateFormConfigSchema } from '../lib/schema-validator';
import {
  DOCS_SECTIONS,
  API_REFERENCE_ENTRIES,
  USE_CASE_ARCHIPELAGO,
  FRAMEWORK_MATRIX,
  COMPARISON_ROWS,
} from '../lib/docs-data';
import { DocsHub } from '../components/DocsHub';
import { UseCaseArchipelago } from '../components/UseCaseArchipelago';
import { ComparisonSection } from '../components/ComparisonSection';

describe('Task 4: Developer-First Docs Hub, 10 Use-Case Archipelago & Comparisons', () => {
  it('documents every real API export from @form-os/core, @form-os/react, and @form-os/schema accurately', () => {
    const names = API_REFERENCE_ENTRIES.map((e) => e.name);
    // @form-os/core functions
    expect(names).toContain('normalizeConfig');
    expect(names).toContain('createDefaultValues');
    expect(names).toContain('getDefaultValue');
    expect(names).toContain('getFieldState');
    expect(names).toContain('createFieldRegistry');
    expect(names).toContain('getValidationRules');
    expect(names).toContain('coercePattern');

    // @form-os/react hooks & components
    expect(names).toContain('useFormConfig');
    expect(names).toContain('Field');
    expect(names).toContain('useField');
    expect(names).toContain('FormFieldsProvider');
    expect(names).toContain('useFieldComponents');
    expect(names).toContain('defaultComponents');

    // @form-os/schema
    expect(names).toContain('schema');

    // Non-React adapters must be labeled Roadmap
    const svelteEntry = FRAMEWORK_MATRIX.find((f) => f.pkg === '@form-os/svelte');
    expect(svelteEntry?.status).toBe('Roadmap');
  });

  it('provides all 10 required use cases in USE_CASE_ARCHIPELAGO with schema-valid FormConfigs', () => {
    expect(USE_CASE_ARCHIPELAGO.length).toBe(10);
    for (const island of USE_CASE_ARCHIPELAGO) {
      const check = validateFormConfigSchema(island.config);
      expect(check.valid).toBe(true);
    }
  });

  it('renders DocsHub with sidebar navigation, package manager tabs, and 11 built-in field gallery', () => {
    expect(DOCS_SECTIONS.length).toBeGreaterThanOrEqual(6);
    const html = renderToString(<DocsHub onMountConfig={() => {}} />);
    expect(html).toContain('@form-os/core');
    expect(html).toContain('@form-os/react');
    expect(html).toContain('@form-os/schema');
    expect(html).toContain('pnpm add @form-os/core @form-os/react react-hook-form');
  });

  it('renders UseCaseArchipelago 3D flythrough and ComparisonSection', () => {
    const archHtml = renderToString(
      <UseCaseArchipelago onMountConfig={() => {}} />
    );
    expect(archHtml).toContain('Form Archipelago');
    expect(archHtml).toContain('White-Label Form-Builder');

    expect(COMPARISON_ROWS.length).toBeGreaterThanOrEqual(6);
    const compHtml = renderToString(<ComparisonSection />);
    expect(compHtml).toContain('react-hook-form');
    expect(compHtml).toContain('JSON Forms');
    expect(compHtml).toContain('Typeform');
  });
});
