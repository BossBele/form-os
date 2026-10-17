import type { FormConfig } from '@form-os/core';

/**
 * One realistic form, chosen because the conditional logic genuinely matters:
 * a company onboarding flow where the tax identifier depends on the
 * jurisdiction, the ownership section depends on the entity type, and a risk
 * review hides internal references while demanding a disclosure.
 *
 * Between them these fields exercise all five dependency gate types.
 */
export const EXAMPLE_CONFIG: FormConfig = {
  validationMode: 'onTouched',
  reValidateMode: 'onChange',
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Registered company name',
      placeholder: 'Northwind Trading Ltd',
      defaultValue: 'Northwind Trading Ltd',
      rules: { required: 'We need the name exactly as it appears on the certificate.' },
    },
    {
      name: 'entityType',
      type: 'select',
      label: 'How is the business structured?',
      defaultValue: 'company',
      options: [
        { label: 'Limited company', value: 'company' },
        { label: 'Sole trader', value: 'sole-trader' },
        { label: 'Partnership', value: 'partnership' },
      ],
      rules: { required: true },
    },
    {
      name: 'taxJurisdiction',
      type: 'select',
      label: 'Where does the business pay tax?',
      defaultValue: 'EU',
      options: [
        { label: 'European Union', value: 'EU' },
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
      ],
      rules: { required: true },
    },
    {
      name: 'vatNumber',
      type: 'text',
      label: 'EU VAT number',
      description: 'Appears because the business pays tax in the European Union.',
      defaultValue: 'DE819204112',
      dependencies: [
        { name: 'taxJurisdiction', value: 'EU', type: 'show' },
        { name: 'taxJurisdiction', value: 'EU', type: 'required' },
      ],
      rules: { pattern: '^[A-Z]{2}[0-9A-Z]{8,12}$' },
    },
    {
      name: 'ein',
      type: 'text',
      label: 'US Employer Identification Number',
      placeholder: '12-3456789',
      description: 'Appears because the business pays tax in the United States.',
      defaultValue: '',
      dependencies: [
        { name: 'taxJurisdiction', value: 'US', type: 'show' },
        { name: 'taxJurisdiction', value: 'US', type: 'required' },
      ],
    },
    {
      name: 'beneficialOwners',
      type: 'textarea',
      label: 'Who owns the company?',
      description: 'Limited companies must name anyone holding 25 per cent or more.',
      defaultValue: 'Ada Lovelace — 60%\nGrace Hopper — 40%',
      dependencies: [
        { name: 'entityType', value: 'company', type: 'show' },
        { name: 'entityType', value: 'company', type: 'required' },
      ],
      rules: { minLength: 10 },
    },
    {
      name: 'soleTraderUtr',
      type: 'text',
      label: 'Unique Taxpayer Reference',
      description: 'Read-only — a sole trader cannot amend this once it is filed.',
      defaultValue: '1234567890',
      dependencies: [
        { name: 'entityType', value: 'sole-trader', type: 'show' },
        { name: 'entityType', value: 'sole-trader', type: 'readonly' },
      ],
    },
    {
      name: 'internalReference',
      type: 'text',
      label: 'Internal reference',
      description:
        'Locked for partnerships, and hidden entirely while a risk review is open.',
      defaultValue: 'NW-2026-0417',
      dependencies: [
        { name: 'entityType', value: 'partnership', type: 'disabled' },
        { name: 'riskFlag', value: true, type: 'hidden' },
      ],
    },
    {
      name: 'riskFlag',
      type: 'switch',
      label: 'Has a risk review been opened?',
      defaultValue: false,
    },
    {
      name: 'riskDisclosure',
      type: 'textarea',
      label: 'Risk review disclosure',
      placeholder: 'What triggered the review, and what have you done about it?',
      description: 'Appears and becomes mandatory while a risk review is open.',
      defaultValue: '',
      dependencies: [
        { name: 'riskFlag', value: true, type: 'show' },
        { name: 'riskFlag', value: true, type: 'required' },
      ],
    },
  ],
};

export interface ExampleToggle {
  name: string;
  label: string;
  hint: string;
  value: unknown;
}

/** The three source values a visitor can flip to watch the form obey. */
export const EXAMPLE_TOGGLES: ReadonlyArray<ExampleToggle> = [
  {
    name: 'taxJurisdiction',
    label: 'Tax jurisdiction',
    hint: 'Switch to the United States and the VAT field leaves, the EIN field arrives.',
    value: 'EU',
  },
  {
    name: 'entityType',
    label: 'Business structure',
    hint: 'Partnerships lock the internal reference; sole traders get a read-only reference.',
    value: 'company',
  },
  {
    name: 'riskFlag',
    label: 'Risk review open',
    hint: 'Opens a mandatory disclosure and hides the internal reference.',
    value: true,
  },
];
