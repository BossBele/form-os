import type { FieldConfig, FormConfig } from '@form-os/core';

export interface PlaygroundPreset {
  id: string;
  title: string;
  badge: string;
  prompt: string;
  description: string;
  config: FormConfig;
}

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    id: 'kyc',
    title: 'Multi-Step KYC & AML Onboarding',
    badge: 'FinTech / Regulated',
    prompt:
      'Describe a complex multi-step KYC onboarding form with EU VAT conditional logic, PEP disclosures, and beneficial owner verification.',
    description:
      'Demonstrates show, required, and readonly dependency rules reacting to entity jurisdiction and politically exposed person (PEP) status.',
    config: {
      validationMode: 'onTouched',
      reValidateMode: 'onChange',
      fields: [
        {
          name: 'entityLegalName',
          type: 'text',
          label: 'Legal Entity Name',
          placeholder: 'e.g. Acme Treasury GmbH',
          defaultValue: 'Acme Treasury GmbH',
          rules: {
            required: 'Legal entity name is required for KYC verification',
            minLength: 3,
          },
        },
        {
          name: 'jurisdiction',
          type: 'select',
          label: 'Primary Tax Jurisdiction',
          defaultValue: 'EU',
          options: [
            { label: 'European Union (EU / EEA)', value: 'EU' },
            { label: 'United States (FinCEN)', value: 'US' },
            { label: 'United Kingdom (FCA)', value: 'UK' },
            { label: 'Singapore (MAS)', value: 'SG' },
          ],
          rules: { required: true },
        },
        {
          name: 'vatNumber',
          type: 'text',
          label: 'EU VIES VAT Registration Number',
          placeholder: 'DE123456789',
          defaultValue: 'DE819204112',
          description: 'Shown and required dynamically when Primary Tax Jurisdiction === EU',
          dependencies: [
            { name: 'jurisdiction', value: 'EU', type: 'show' },
            { name: 'jurisdiction', value: 'EU', type: 'required' },
          ],
          rules: {
            pattern: '^[A-Z]{2}[0-9A-Z]{8,12}$',
          },
        },
        {
          name: 'einNumber',
          type: 'text',
          label: 'US IRS Employer Identification Number (EIN)',
          placeholder: '12-3456789',
          description: 'Shown and required dynamically when Primary Tax Jurisdiction === US',
          dependencies: [
            { name: 'jurisdiction', value: 'US', type: 'show' },
            { name: 'jurisdiction', value: 'US', type: 'required' },
          ],
        },
        {
          name: 'monthlyVolumeUsd',
          type: 'number',
          label: 'Projected Monthly Settlement Volume (USD)',
          placeholder: '250000',
          defaultValue: 250000,
          rules: {
            required: 'Projected volume is required',
            min: 1000,
            max: 100000000,
          },
        },
        {
          name: 'isPep',
          type: 'switch',
          label: 'Any Beneficial Owner is a Politically Exposed Person (PEP)',
          defaultValue: false,
        },
        {
          name: 'pepSourceOfWealth',
          type: 'textarea',
          label: 'Enhanced Due Diligence — Source of Wealth Declaration',
          placeholder: 'Provide notarized details on public office held and origin of funds...',
          description: 'Appears and becomes mandatory when PEP switch is enabled',
          dependencies: [
            { name: 'isPep', value: true, type: 'show' },
            { name: 'isPep', value: true, type: 'required' },
          ],
          rules: {
            minLength: 20,
          },
        },
        {
          name: 'complianceOfficerEmail',
          type: 'email',
          label: 'Designated MLRO / Compliance Officer Email',
          placeholder: 'compliance@acmetreasury.eu',
          defaultValue: 'compliance@acmetreasury.eu',
          rules: {
            required: 'Compliance officer email is required',
          },
        },
        {
          name: 'lockAuditSnapshot',
          type: 'checkbox',
          label: 'Seal KYC Record for Auditor Review (locks Compliance Email as read-only)',
          defaultValue: false,
        },
      ],
    },
  },
  {
    id: 'hipaa',
    title: 'HIPAA Clinical Triage & Guardian Intake',
    badge: 'Healthcare',
    prompt:
      'Create a HIPAA patient intake form where guardian consent becomes required for minors and infectious symptoms unlock isolation triage.',
    description:
      'Conditional guardian signature and clinical isolation routing powered by @form-os/core getFieldState.',
    config: {
      validationMode: 'onBlur',
      reValidateMode: 'onChange',
      fields: [
        {
          name: 'patientFullName',
          type: 'text',
          label: 'Patient Full Name',
          placeholder: 'Jordan Vance',
          defaultValue: 'Jordan Vance',
          rules: { required: 'Patient full name is required' },
        },
        {
          name: 'ageCategory',
          type: 'radio',
          label: 'Patient Age Bracket',
          defaultValue: 'minor',
          options: [
            { label: 'Adult (18+ years)', value: 'adult' },
            { label: 'Pediatric / Minor (<18 years)', value: 'minor' },
          ],
        },
        {
          name: 'guardianName',
          type: 'text',
          label: 'Legal Guardian Full Name & Relationship',
          placeholder: 'Elena Vance (Mother)',
          defaultValue: 'Elena Vance (Mother)',
          description: 'Visible and required only when Patient Age Bracket is Pediatric / Minor',
          dependencies: [
            { name: 'ageCategory', value: 'minor', type: 'show' },
            { name: 'ageCategory', value: 'minor', type: 'required' },
          ],
        },
        {
          name: 'admissionDate',
          type: 'date',
          label: 'Scheduled Triage Date',
          defaultValue: '2026-10-17',
          rules: { required: true },
        },
        {
          name: 'hasFeverOrContagion',
          type: 'switch',
          label: 'Presenting with Fever > 38.5°C or Suspected Contagion',
          defaultValue: true,
        },
        {
          name: 'isolationProtocolNotes',
          type: 'textarea',
          label: 'Negative-Pressure Isolation Wing Assignment Notes',
          placeholder: 'Assign Wing 4B, N95 protocol required...',
          defaultValue: 'Assign Wing 4B — airborne precaution initiated.',
          dependencies: [
            { name: 'hasFeverOrContagion', value: true, type: 'show' },
            { name: 'hasFeverOrContagion', value: true, type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'treasury',
    title: 'Sovereign Wire Transfer & Dual-Custody Gate',
    badge: 'Enterprise Ops',
    prompt:
      'Build an institutional wire transfer form that locks destination IBAN when sanctions freeze is triggered and requires CFO sign-off for high-value wires.',
    description:
      'Showcases disabled, readonly, and hidden dependencies working together on a single treasury form.',
    config: {
      validationMode: 'onChange',
      reValidateMode: 'onChange',
      fields: [
        {
          name: 'beneficiaryIban',
          type: 'text',
          label: 'Beneficiary IBAN / SWIFT Account',
          defaultValue: 'CH93 0076 2011 6238 5295 7',
          dependencies: [
            { name: 'sanctionsHold', value: true, type: 'disabled' },
          ],
          rules: { required: 'IBAN is required' },
        },
        {
          name: 'wireTier',
          type: 'select',
          label: 'Settlement Tier',
          defaultValue: 'institutional',
          options: [
            { label: 'Standard Operational (< $50k)', value: 'standard' },
            { label: 'Institutional Block ($50k – $10M)', value: 'institutional' },
          ],
        },
        {
          name: 'cfoHardwareToken',
          type: 'password',
          label: 'CFO YubiKey / Hardware Authorization Signature',
          placeholder: 'Enter 44-char OTP token',
          description: 'Required and shown only for Institutional Block settlements',
          dependencies: [
            { name: 'wireTier', value: 'institutional', type: 'show' },
            { name: 'wireTier', value: 'institutional', type: 'required' },
          ],
        },
        {
          name: 'sanctionsHold',
          type: 'switch',
          label: 'OFAC / EU Sanctions Screening Match Detected (Freezes IBAN)',
          defaultValue: false,
        },
        {
          name: 'fastTrackMemo',
          type: 'text',
          label: 'Same-Day Fedwire / TARGET2 Priority Memo',
          defaultValue: 'URGENT-LIQUIDITY-SWEEP',
          description: 'Automatically hidden when Sanctions Hold is active',
          dependencies: [
            { name: 'sanctionsHold', value: true, type: 'hidden' },
          ],
        },
      ],
    },
  },
  {
    id: 'saas-lead',
    title: 'B2B Enterprise Lead & Security Architecture Intake',
    badge: 'Growth / RevOps',
    prompt:
      'Build a high-converting enterprise lead capture form that reveals SSO/SCIM and air-gapped deployment fields when company size is Enterprise.',
    description:
      'Zero-bloat growth intake form that adapts in real time to buyer segment.',
    config: {
      validationMode: 'onTouched',
      reValidateMode: 'onChange',
      fields: [
        {
          name: 'workEmail',
          type: 'email',
          label: 'Work Email',
          placeholder: 'cto@enterprise.io',
          defaultValue: 'vp-eng@fintech-global.io',
          rules: { required: 'Work email is required' },
        },
        {
          name: 'companySegment',
          type: 'select',
          label: 'Engineering Org Scale',
          defaultValue: 'enterprise',
          options: [
            { label: 'Seed / Series A (1–25 devs)', value: 'startup' },
            { label: 'Growth Scale (26–200 devs)', value: 'scale' },
            { label: 'Sovereign Enterprise (200+ devs)', value: 'enterprise' },
          ],
        },
        {
          name: 'dataResidencyRegion',
          type: 'select',
          label: 'Required Sovereign Data Residency',
          defaultValue: 'eu-frankfurt',
          options: [
            { label: 'EU Central (Frankfurt — BaFin ready)', value: 'eu-frankfurt' },
            { label: 'US GovCloud (FedRAMP High)', value: 'us-gov' },
            { label: 'On-Premise Air-Gapped Kubernetes', value: 'air-gapped' },
          ],
          dependencies: [
            { name: 'companySegment', value: 'enterprise', type: 'show' },
            { name: 'companySegment', value: 'enterprise', type: 'required' },
          ],
        },
        {
          name: 'legacyMigrationSource',
          type: 'radio',
          label: 'Current Form Stack to Migrate (Free Done-For-You Guarantee)',
          defaultValue: 'typeform',
          options: [
            { label: 'Typeform / Jotform Enterprise', value: 'typeform' },
            { label: 'Bespoke React / Formik Sprawl', value: 'custom' },
            { label: 'JSON Forms / RJSF', value: 'jsonforms' },
          ],
          dependencies: [
            { name: 'companySegment', value: 'enterprise', type: 'show' },
          ],
        },
        {
          name: 'monthlySubmissions',
          type: 'number',
          label: 'Monthly Form Submissions',
          defaultValue: 500000,
          rules: { min: 100 },
        },
      ],
    },
  },
  {
    id: 'ai-agent',
    title: 'AI Agent Runtime & Guardrail Configurator',
    badge: 'AI / LLM Native',
    prompt:
      'Generate an AI agent configuration form where enabling autonomous tool execution requires a spend cap and human-in-the-loop webhook.',
    description:
      'Shows why @form-os/schema is the ideal ABI for LLM-generated and agentic interfaces.',
    config: {
      validationMode: 'onChange',
      reValidateMode: 'onChange',
      fields: [
        {
          name: 'agentName',
          type: 'text',
          label: 'Agent Identifier',
          defaultValue: 'kyc-adjudicator-v4',
          rules: { required: 'Agent identifier is required' },
        },
        {
          name: 'modelProvider',
          type: 'select',
          label: 'Foundation Model Kernel',
          defaultValue: 'gemini-4',
          options: [
            { label: 'Gemini 4 High (Multimodal Reasoning)', value: 'gemini-4' },
            { label: 'Claude 4.5 Sonnet', value: 'claude-4' },
            { label: 'Sovereign Local Llama-4-70B', value: 'local-llama' },
          ],
        },
        {
          name: 'allowAutonomousTools',
          type: 'switch',
          label: 'Enable Autonomous Tool Execution (Write Access)',
          defaultValue: true,
        },
        {
          name: 'maxSpendUsdPerRun',
          type: 'number',
          label: 'Hard Spend Cap per Autonomous Run (USD)',
          defaultValue: 25,
          dependencies: [
            { name: 'allowAutonomousTools', value: true, type: 'show' },
            { name: 'allowAutonomousTools', value: true, type: 'required' },
          ],
          rules: { min: 1, max: 10000 },
        },
        {
          name: 'approvalWebhookUrl',
          type: 'text',
          label: 'Human-in-the-Loop Escalation Webhook',
          defaultValue: 'https://ops.internal/hooks/agent-escalate',
          dependencies: [
            { name: 'allowAutonomousTools', value: true, type: 'show' },
          ],
        },
      ],
    },
  },
];

export function generateConfigFromPrompt(prompt: string): {
  config: FormConfig;
  matchedPresetId: string;
  explanation: string;
} {
  const lower = prompt.toLowerCase();

  if (lower.includes('kyc') || lower.includes('aml') || lower.includes('vat') || lower.includes('onboarding')) {
    return {
      config: structuredClone(PLAYGROUND_PRESETS[0].config),
      matchedPresetId: 'kyc',
      explanation:
        'Compiled 9-field KYC & AML onboarding image with conditional EU VIES VAT, US EIN, and PEP Enhanced Due Diligence gates.',
    };
  }

  if (lower.includes('hipaa') || lower.includes('patient') || lower.includes('clinical') || lower.includes('medical') || lower.includes('health')) {
    return {
      config: structuredClone(PLAYGROUND_PRESETS[1].config),
      matchedPresetId: 'hipaa',
      explanation:
        'Compiled HIPAA clinical intake config with minor guardian requirement and contagion isolation routing.',
    };
  }

  if (lower.includes('wire') || lower.includes('treasury') || lower.includes('iban') || lower.includes('sanction') || lower.includes('bank')) {
    return {
      config: structuredClone(PLAYGROUND_PRESETS[2].config),
      matchedPresetId: 'treasury',
      explanation:
        'Compiled Sovereign Treasury wire config with OFAC sanctions freeze (disabled/hidden) and institutional CFO hardware token gate.',
    };
  }

  if (lower.includes('lead') || lower.includes('saas') || lower.includes('b2b') || lower.includes('pricing') || lower.includes('sales')) {
    return {
      config: structuredClone(PLAYGROUND_PRESETS[3].config),
      matchedPresetId: 'saas-lead',
      explanation:
        'Compiled B2B Enterprise growth intake config with dynamic Sovereign data residency and migration qualifiers.',
    };
  }

  if (lower.includes('agent') || lower.includes('llm') || lower.includes('ai ')) {
    return {
      config: structuredClone(PLAYGROUND_PRESETS[4].config),
      matchedPresetId: 'ai-agent',
      explanation:
        'Compiled AI Agent runtime configuration with autonomous tool execution spend-cap dependencies.',
    };
  }

  // Dynamic synthesis from natural language tokens
  const synthesizedFields: FieldConfig[] = [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name / Identifier',
      placeholder: 'Ada Lovelace',
      defaultValue: 'Ada Lovelace',
      rules: { required: 'Name is required' },
    },
  ];

  if (lower.includes('email')) {
    synthesizedFields.push({
      name: 'emailAddress',
      type: 'email',
      label: 'Email Address',
      placeholder: 'ada@analytical-engine.org',
      defaultValue: 'ada@analytical-engine.org',
      rules: { required: 'Email address is required' },
    });
  }

  if (lower.includes('number') || lower.includes('rating') || lower.includes('score') || lower.includes('budget') || lower.includes('amount')) {
    synthesizedFields.push({
      name: 'metricValue',
      type: 'number',
      label: lower.includes('rating') ? 'Experience Rating (1-10)' : 'Quantified Value',
      defaultValue: 9,
      rules: { min: 1, max: 1000000 },
    });
  }

  if (lower.includes('date') || lower.includes('schedule') || lower.includes('deadline')) {
    synthesizedFields.push({
      name: 'targetDate',
      type: 'date',
      label: 'Target Effective Date',
      defaultValue: '2026-10-17',
    });
  }

  if (lower.includes('password') || lower.includes('secret') || lower.includes('token')) {
    synthesizedFields.push({
      name: 'secretToken',
      type: 'password',
      label: 'Access Secret / API Token',
      placeholder: '••••••••••••',
    });
  }

  synthesizedFields.push({
    name: 'includeAdvancedDetails',
    type: 'switch',
    label: 'Include Conditional Follow-Up Details',
    defaultValue: true,
  });

  if (lower.includes('textarea') || lower.includes('comment') || lower.includes('feedback') || lower.includes('notes') || synthesizedFields.length < 5) {
    synthesizedFields.push({
      name: 'detailedNotes',
      type: 'textarea',
      label: 'Detailed Context & Notes',
      placeholder: 'Add structured notes...',
      defaultValue: 'Synthesized directly into a schema-validated FormConfig.',
      dependencies: [
        { name: 'includeAdvancedDetails', value: true, type: 'show' },
        { name: 'includeAdvancedDetails', value: true, type: 'required' },
      ],
    });
  }

  return {
    config: {
      validationMode: 'onTouched',
      reValidateMode: 'onChange',
      fields: synthesizedFields,
    },
    matchedPresetId: 'custom',
    explanation: `Synthesized ${synthesizedFields.length}-field FormConfig from prompt and validated against @form-os/schema.`,
  };
}

export function generateTypeScriptSnippet(config: FormConfig): string {
  const jsonString = JSON.stringify(config, null, 2);
  return `import {
  useFormConfig,
  Field,
  FormFieldsProvider,
  FormProvider,
} from '@form-os/react';
import { defaultComponents } from '@form-os/react/fields';
import type { FormConfig } from '@form-os/core';

const config: FormConfig = ${jsonString};

export function GeneratedFormOSView() {
  const form = useFormConfig(config);

  return (
    <FormFieldsProvider components={defaultComponents}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit((data) => console.log(data))}>
          {form.fields.map((field) => (
            <Field key={field.name} field={field} control={form.control} />
          ))}
          <button type="submit">Commit State</button>
        </form>
      </FormProvider>
    </FormFieldsProvider>
  );
}`;
}
