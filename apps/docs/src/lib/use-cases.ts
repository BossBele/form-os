import type { FormConfig } from '@form-os/core';

export interface UseCase {
  id: string;
  title: string;
  outcome: string;
  config: FormConfig;
}

export const USE_CASES: ReadonlyArray<UseCase> = [
  {
    id: 'regulated-onboarding',
    title: 'Regulated onboarding',
    outcome:
      'Applicants see only the questions their own jurisdiction actually asks, so nobody abandons a form because it demanded a document they do not have.',
    config: {
      validationMode: 'onTouched',
      fields: [
        {
          name: 'jurisdiction',
          type: 'select',
          label: 'Where will you operate?',
          defaultValue: 'EU',
          options: [
            { label: 'European Union', value: 'EU' },
            { label: 'United States', value: 'US' },
          ],
          rules: { required: true },
        },
        {
          name: 'vatNumber',
          type: 'text',
          label: 'VAT number',
          defaultValue: 'DE819204112',
          dependencies: [
            { name: 'jurisdiction', value: 'EU', type: 'show' },
            { name: 'jurisdiction', value: 'EU', type: 'required' },
          ],
        },
        {
          name: 'usTaxNumber',
          type: 'text',
          label: 'US tax number',
          placeholder: '12-3456789',
          defaultValue: '',
          dependencies: [
            { name: 'jurisdiction', value: 'US', type: 'show' },
            { name: 'jurisdiction', value: 'US', type: 'required' },
          ],
        },
        {
          name: 'acceptsOperatingTerms',
          type: 'checkbox',
          label: 'I accept the operating terms',
          defaultValue: true,
        },
      ],
    },
  },
  {
    id: 'clinical-intake',
    title: 'Clinical intake',
    outcome:
      'Guardian consent appears the moment a patient is under eighteen, and the isolation checklist only shows itself when it is genuinely relevant.',
    config: {
      validationMode: 'onBlur',
      fields: [
        {
          name: 'patientName',
          type: 'text',
          label: 'Patient name',
          defaultValue: 'Jordan Vance',
          rules: { required: 'A patient name is required' },
        },
        {
          name: 'ageBracket',
          type: 'radio',
          label: 'Patient age bracket',
          defaultValue: 'minor',
          options: [
            { label: 'Adult', value: 'adult' },
            { label: 'Under eighteen', value: 'minor' },
          ],
        },
        {
          name: 'guardianName',
          type: 'text',
          label: 'Guardian name',
          defaultValue: 'Elena Vance',
          dependencies: [
            { name: 'ageBracket', value: 'minor', type: 'show' },
            { name: 'ageBracket', value: 'minor', type: 'required' },
          ],
        },
        {
          name: 'suspectedContagion',
          type: 'switch',
          label: 'Suspected contagion',
          defaultValue: true,
        },
        {
          name: 'isolationNotes',
          type: 'textarea',
          label: 'Isolation notes',
          defaultValue: 'Negative-pressure room booked for 14:20.',
          dependencies: [
            { name: 'suspectedContagion', value: true, type: 'show' },
            { name: 'suspectedContagion', value: true, type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'internal-admin',
    title: 'Internal admin panels',
    outcome:
      'Fifty back-office screens built from one shape of description, with production rows locked read-only so nobody edits live data by accident.',
    config: {
      validationMode: 'onChange',
      fields: [
        {
          name: 'resource',
          type: 'select',
          label: 'Resource',
          defaultValue: 'orders',
          options: [
            { label: 'Orders', value: 'orders' },
            { label: 'Customers', value: 'customers' },
            { label: 'Invoices', value: 'invoices' },
          ],
        },
        {
          name: 'productionLock',
          type: 'switch',
          label: 'Production rows are locked',
          defaultValue: true,
        },
        {
          name: 'primaryKey',
          type: 'text',
          label: 'Primary key',
          defaultValue: 'ord_9182736',
          dependencies: [
            { name: 'productionLock', value: true, type: 'readonly' },
          ],
        },
        {
          name: 'cascadeDelete',
          type: 'checkbox',
          label: 'Cascade delete to child rows',
          defaultValue: false,
          dependencies: [
            { name: 'productionLock', value: true, type: 'disabled' },
          ],
        },
      ],
    },
  },
  {
    id: 'ai-generated',
    title: 'Forms an AI writes',
    outcome:
      'A model returns a form as data, it is checked before anything is drawn, and a malformed one never reaches a customer.',
    config: {
      validationMode: 'onTouched',
      fields: [
        {
          name: 'intent',
          type: 'text',
          label: 'What should this form collect?',
          defaultValue: 'enterprise onboarding details',
          rules: { required: true },
        },
        {
          name: 'model',
          type: 'select',
          label: 'Model',
          defaultValue: 'gemini',
          options: [
            { label: 'Gemini', value: 'gemini' },
            { label: 'A local model', value: 'local' },
          ],
        },
        {
          name: 'checkBeforeRender',
          type: 'switch',
          label: 'Check the result before rendering it',
          defaultValue: true,
        },
        {
          name: 'fallbackMessage',
          type: 'textarea',
          label: 'What to show if it fails the check',
          defaultValue: 'We could not build that form. Try rephrasing the request.',
          dependencies: [
            { name: 'checkBeforeRender', value: true, type: 'show' },
          ],
        },
      ],
    },
  },
];
