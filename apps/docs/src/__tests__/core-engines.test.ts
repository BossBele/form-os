import { describe, expect, it } from 'vitest';
import { normalizeConfig, getFieldState } from '@form-os/core';
import { validateFormConfigSchema } from '../lib/schema-validator';
import {
  generateConfigFromPrompt,
  PLAYGROUND_PRESETS,
  generateTypeScriptSnippet,
} from '../lib/prompt-to-config';
import { executeShellCommand } from '../lib/os-shell';
import {
  calculateHormoziROI,
  PRICING_TIERS,
  BONUS_STACK,
} from '../lib/roi-calculator';

describe('Task 1: Core Docs & OS Engines', () => {
  describe('schema-validator (@form-os/schema ABI)', () => {
    it('validates a canonical FormConfig against @form-os/schema', () => {
      const result = validateFormConfigSchema({
        validationMode: 'onTouched',
        reValidateMode: 'onChange',
        fields: [
          { name: 'country', type: 'select', options: [{ label: 'Germany', value: 'DE' }] },
          {
            name: 'vatNumber',
            type: 'text',
            dependencies: [{ name: 'country', value: 'DE', type: 'show' }],
            rules: { required: 'VAT is required' },
          },
        ],
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.fieldCount).toBe(2);
      expect(result.dependencyCount).toBe(1);
    });

    it('rejects invalid FormConfig shapes and invalid dependency types', () => {
      const missingFields = validateFormConfigSchema({});
      expect(missingFields.valid).toBe(false);
      expect(missingFields.errors.length).toBeGreaterThan(0);

      const badDep = validateFormConfigSchema({
        fields: [
          {
            name: 'secret',
            type: 'text',
            dependencies: [{ name: 'role', value: 'admin', type: 'invalid-type' }],
          },
        ],
      });
      expect(badDep.valid).toBe(false);
      expect(badDep.errors.some((e) => e.includes('dependencies[0].type'))).toBe(true);
    });
  });

  describe('prompt-to-config (Natural Language -> FormConfig)', () => {
    it('generates a multi-step KYC onboarding config with real working dependencies', () => {
      const generated = generateConfigFromPrompt(
        'Describe a complex multi-step KYC onboarding form with EU VAT and PEP screening'
      );
      const schemaResult = validateFormConfigSchema(generated.config);
      expect(schemaResult.valid).toBe(true);

      const normalized = normalizeConfig(generated.config);
      expect(normalized.fields.length).toBeGreaterThanOrEqual(5);

      const vatField = normalized.fields.find((f) => f.name === 'vatNumber');
      expect(vatField).toBeDefined();
      expect(getFieldState(vatField!, { jurisdiction: 'US' }).visible).toBe(false);
      expect(getFieldState(vatField!, { jurisdiction: 'EU' }).visible).toBe(true);

      const tsCode = generateTypeScriptSnippet(generated.config);
      expect(tsCode).toContain('useFormConfig');
      expect(tsCode).toContain('FormFieldsProvider');
      expect(tsCode).toContain('<Field');
    });

    it('synthesizes custom fields from arbitrary natural-language prompts', () => {
      const generated = generateConfigFromPrompt(
        'Build a customer feedback form with email, rating number, and comments textarea'
      );
      const schemaResult = validateFormConfigSchema(generated.config);
      expect(schemaResult.valid).toBe(true);
      expect(generated.config.fields.some((f) => f.type === 'email')).toBe(true);
      expect(generated.config.fields.some((f) => f.type === 'number')).toBe(true);
      expect(generated.config.fields.some((f) => f.type === 'textarea')).toBe(true);
    });

    it('ensures all PLAYGROUND_PRESETS validate cleanly against @form-os/schema', () => {
      expect(PLAYGROUND_PRESETS.length).toBeGreaterThanOrEqual(5);
      for (const preset of PLAYGROUND_PRESETS) {
        const check = validateFormConfigSchema(preset.config);
        expect(check.valid).toBe(true);
      }
    });
  });

  describe('os-shell (⌘K form-os Kernel Shell)', () => {
    const sampleConfig = PLAYGROUND_PRESETS[0].config;

    it('lists fields and inspects live field state via getFieldState', () => {
      const lsRes = executeShellCommand('ls fields', {
        config: sampleConfig,
        values: { jurisdiction: 'EU' },
        xp: 250,
      });
      expect(lsRes.lines.some((l) => l.includes('vatNumber'))).toBe(true);

      const inspectRes = executeShellCommand('inspect vatNumber', {
        config: sampleConfig,
        values: { jurisdiction: 'EU' },
        xp: 250,
      });
      expect(inspectRes.lines.some((l) => l.includes('visible: true'))).toBe(true);
    });

    it('triggers boot, mount, wire, theme, and panic kernel actions', () => {
      const panicRes = executeShellCommand('panic', {
        config: sampleConfig,
        values: {},
        xp: 100,
      });
      expect(panicRes.action?.type).toBe('KERNEL_PANIC');

      const mountRes = executeShellCommand('mount hipaa', {
        config: sampleConfig,
        values: {},
        xp: 100,
      });
      expect(mountRes.action?.type).toBe('MOUNT_PRESET');
    });
  });

  describe('roi-calculator ($100M Offers Value Equation & Enterprise Tiers)', () => {
    it('defines Open Source, Form-OS Scale, and Form-OS Sovereign tiers with Hormozi Value Equation', () => {
      expect(PRICING_TIERS.map((t) => t.id)).toEqual(['open-source', 'scale', 'sovereign']);
      const scale = PRICING_TIERS.find((t) => t.id === 'scale')!;
      const sovereign = PRICING_TIERS.find((t) => t.id === 'sovereign')!;

      expect(scale.name).toBe('Form-OS Scale');
      expect(scale.perceivedLikelihood).toContain('SOC2 Type II');
      expect(scale.perceivedLikelihood).toContain('99.99%');

      expect(sovereign.name).toBe('Form-OS Sovereign');
      expect(sovereign.dreamOutcome).toContain('air-gapped');
      expect(sovereign.perceivedLikelihood).toContain('2 hours');
      expect(sovereign.perceivedLikelihood).toContain('48 hours');
      expect(sovereign.effortAndSacrifice).toContain('Done-For-You');
      expect(sovereign.effortAndSacrifice).toContain('Typeform/Jotform');
      expect(BONUS_STACK.length).toBeGreaterThanOrEqual(5);
    });

    it('calculates monthly engineering hours saved and Hormozi value index', () => {
      const roi = calculateHormoziROI({
        engineersCount: 12,
        formsPerMonth: 8,
        avgConditionalFieldsPerForm: 15,
        hourlyEngineeringRate: 140,
        tierId: 'sovereign',
      });
      expect(roi.monthlyHoursSaved).toBeGreaterThan(100);
      expect(roi.annualDollarsSaved).toBeGreaterThan(100000);
      expect(roi.valueEquation.dreamOutcome).toBeGreaterThanOrEqual(95);
      expect(roi.valueEquation.timeDelayDays).toBeLessThanOrEqual(2);
    });
  });
});
