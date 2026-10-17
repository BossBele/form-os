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
      expect(useCase.config.fields.some((f) => f.dependencies?.length)).toBe(
        true
      );
      expect(useCase.outcome.length).toBeGreaterThan(20);
      expect(useCase.title.length).toBeGreaterThan(3);
    }
  });

  it('describes each scenario in plain language, not in API names', () => {
    for (const useCase of USE_CASES) {
      expect(useCase.outcome.toLowerCase()).not.toMatch(
        /\bconfig\b|\bfieldconfig\b|\bgetfieldstate\b/
      );
    }
  });

  it('gives every scenario a distinct id and title', () => {
    expect(new Set(USE_CASES.map((u) => u.id)).size).toBe(4);
    expect(new Set(USE_CASES.map((u) => u.title)).size).toBe(4);
  });

  it('renders all four with their business outcome', () => {
    const html = renderToString(<UseCases />);
    expect(html).toContain('id="use-cases"');
    for (const useCase of USE_CASES) {
      expect(html).toContain(useCase.title);
      expect(html).toContain(useCase.outcome);
    }
  });

  it('renders every scenario form without a submit button competing for attention', () => {
    const html = renderToString(<UseCases />);
    const submits = html.match(/type="submit"/g) ?? [];
    expect(submits.length).toBe(0);
  });
});
