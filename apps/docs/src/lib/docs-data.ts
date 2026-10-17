import type { FormConfig } from '@form-os/core';

export interface DocSection {
  id: string;
  category: 'Getting Started' | 'Core Kernel' | 'React Runtime' | 'Schema ABI' | 'Architecture';
  title: string;
  plainEnglishSummary: string;
  developerSummary: string;
  codeTitle: string;
  codeSnippet: string;
  sampleConfig?: FormConfig;
}

export interface ApiReferenceEntry {
  pkg: '@form-os/core' | '@form-os/react' | '@form-os/react/fields' | '@form-os/schema';
  name: string;
  kind: 'function' | 'hook' | 'component' | 'constant' | 'type';
  signature: string;
  description: string;
  example: string;
}

export interface UseCaseIsland {
  id: string;
  index: number;
  title: string;
  category: string;
  coordinates: { x: number; y: number; z: number };
  businessOutcome: string;
  technicalMechanism: string;
  config: FormConfig;
}

export interface FrameworkMatrixItem {
  name: string;
  pkg: string;
  status: 'Production v1.0.0' | 'Roadmap';
  runtimeEnv: string;
  notes: string;
}

export interface ComparisonRow {
  capability: string;
  formOs: string;
  rawRhfFormik: string;
  jsonForms: string;
  typeformJotform: string;
}

export const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'quickstart',
    category: 'Getting Started',
    title: 'Quickstart — First Form in 90 Seconds',
    plainEnglishSummary:
      'Instead of coding forms from scratch every sprint, you describe the fields and rules in one clean list. form-os turns that list into a working, validated form immediately.',
    developerSummary:
      'Install @form-os/core, @form-os/react, and react-hook-form. Pass a FormConfig or FieldConfig[] to useFormConfig(config), wrap with FormFieldsProvider, and map fields to <Field />.',
    codeTitle: 'QuickstartForm.tsx',
    codeSnippet: `import {
  useFormConfig,
  Field,
  FormFieldsProvider,
  FormProvider,
} from '@form-os/react';
import { defaultComponents } from '@form-os/react/fields';
import type { FormConfig } from '@form-os/core';

const config: FormConfig = {
  validationMode: 'onTouched',
  reValidateMode: 'onChange',
  fields: [
    {
      name: 'accountType',
      type: 'select',
      label: 'Account Type',
      defaultValue: 'business',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business Entity', value: 'business' },
      ],
    },
    {
      name: 'taxId',
      type: 'text',
      label: 'Corporate Tax ID',
      placeholder: 'DE-99887766',
      dependencies: [
        { name: 'accountType', value: 'business', type: 'show' },
        { name: 'accountType', value: 'business', type: 'required' },
      ],
      rules: { required: 'Corporate Tax ID is required for business accounts' },
    },
  ],
};

export function OnboardingForm() {
  const form = useFormConfig(config);

  return (
    <FormFieldsProvider components={defaultComponents}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit((values) => console.log(values))}>
          {form.fields.map((field) => (
            <Field key={field.name} field={field} control={form.control} />
          ))}
          <button type="submit">Continue</button>
        </form>
      </FormProvider>
    </FormFieldsProvider>
  );
}`,
  },
  {
    id: 'core',
    category: 'Core Kernel',
    title: '@form-os/core — Dependency-Free Kernel',
    plainEnglishSummary:
      'The core brain of form-os has zero external dependencies. It can run in a browser, on a server, inside an edge worker, or in an automated test suite.',
    developerSummary:
      '@form-os/core exports normalizeConfig, createDefaultValues, getDefaultValue, getFieldState, createFieldRegistry, getValidationRules, and coercePattern alongside 15 strict TypeScript interfaces.',
    codeTitle: 'kernel-evaluation.ts',
    codeSnippet: `import {
  normalizeConfig,
  createDefaultValues,
  getFieldState,
  getValidationRules,
  coercePattern,
} from '@form-os/core';

const normalized = normalizeConfig([
  { name: 'country', type: 'select', defaultValue: 'EU' },
  {
    name: 'vatNumber',
    type: 'text',
    dependencies: [
      { name: 'country', value: 'EU', type: 'show' },
      { name: 'country', value: 'EU', type: 'required' },
    ],
    rules: { pattern: '^[A-Z]{2}[0-9A-Z]+$' },
  },
]);

const defaults = createDefaultValues(normalized.fields);
// -> { country: 'EU', vatNumber: '' }

const vatState = getFieldState(normalized.fields[1], { country: 'EU' });
// -> { visible: true, required: true, disabled: false, readonly: false, defaultValue: '' }

const regex = coercePattern( getValidationRules(normalized.fields[1]).pattern as string );
// -> /^[A-Z]{2}[0-9A-Z]+$/`,
  },
  {
    id: 'dependency-engine',
    category: 'Core Kernel',
    title: 'The Dependency Engine — 5 Declarative Gates + AND Semantics',
    plainEnglishSummary:
      'Any field can watch any other field and automatically appear, hide, become required, lock as read-only, or disable itself. When multiple rules of the same type are attached, they all must match together.',
    developerSummary:
      'Each FieldConfig accepts dependencies: Dependency[] where Dependency = { name, value, type } and type is "hidden" | "show" | "required" | "disabled" | "readonly". Multiple dependencies of the same type AND together in getFieldState(field, values).',
    codeTitle: 'dependencies-and-gate.ts',
    codeSnippet: `import { getFieldState, type FieldConfig } from '@form-os/core';

const clusterKeyField: FieldConfig = {
  name: 'sovereignRootKey',
  type: 'password',
  label: 'Air-Gapped Root HSM Key',
  dependencies: [
    // Both 'show' rules must match (AND semantics) for visible === true
    { name: 'deploymentTier', value: 'sovereign', type: 'show' },
    { name: 'secOpsApproved', value: true, type: 'show' },
    // 'hidden' overrides 'show' when all 'hidden' rules match
    { name: 'emergencyLockdown', value: true, type: 'hidden' },
  ],
};

getFieldState(clusterKeyField, {
  deploymentTier: 'sovereign',
  secOpsApproved: true,
  emergencyLockdown: false,
});
// -> { visible: true, required: false, disabled: false, readonly: false, defaultValue: '' }`,
  },
  {
    id: 'react',
    category: 'React Runtime',
    title: '@form-os/react & Custom FieldTypeMap Augmentation',
    plainEnglishSummary:
      'Bring your own design system (Shadcn, Radix, Tailwind, Material) and register custom components once. Every form across your company automatically uses your brand components.',
    developerSummary:
      'Extend FieldTypeMap via TypeScript module augmentation for compile-time safety on custom field types and props, then pass your component map to FormFieldsProvider or build bespoke hooks with useField(field, control).',
    codeTitle: 'custom-field-augmentation.tsx',
    codeSnippet: `import { FormFieldsProvider, useField } from '@form-os/react';
import { defaultComponents, type FieldComponentProps } from '@form-os/react/fields';

// 1. Augment FieldTypeMap in @form-os/core for strict TypeScript checking
declare module '@form-os/core' {
  interface FieldTypeMap {
    'iban-scanner': {};
    'rich-text': { toolbar?: string[] };
  }
}

// 2. Build a custom component using FieldComponentProps or useField(field, control)
export function IbanScannerField({ formField, fieldConfig, fieldState, error }: FieldComponentProps) {
  return (
    <div>
      <label>{fieldConfig.label}</label>
      <input {...formField} readOnly={fieldState.readonly} placeholder="DE89 3704..." />
      {error && <span>{error.message}</span>}
    </div>
  );
}

// 3. Register globally in FormFieldsProvider
export const appFieldRegistry = {
  ...defaultComponents,
  'iban-scanner': IbanScannerField,
};`,
  },
  {
    id: 'schema',
    category: 'Schema ABI',
    title: '@form-os/schema — Portable JSON Schema for CMS, APIs & LLMs',
    plainEnglishSummary:
      'Because every form is a standard JSON document backed by an official schema, forms can be stored in a database, edited by operations teams, or generated by AI — with zero risk of breaking your app.',
    developerSummary:
      'Import { schema } from "@form-os/schema" (Draft-07 JSON Schema, $id: "https://form-os.dev/form-config.schema.json") and validate untrusted configs from APIs, CMS webhooks, or LLM structured outputs using Ajv.',
    codeTitle: 'validate-with-ajv.ts',
    codeSnippet: `import Ajv from 'ajv';
import { schema } from '@form-os/schema';
import type { FormConfig } from '@form-os/core';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile<FormConfig>(schema);

export function bootUntrustedConfig(payload: unknown): FormConfig {
  if (!validate(payload)) {
    throw new Error('Schema ABI violation: ' + ajv.errorsText(validate.errors));
  }
  return payload;
}`,
  },
  {
    id: 'adapter-guide',
    category: 'Architecture',
    title: 'Build Your Own Framework Adapter in 30 Lines',
    plainEnglishSummary:
      'Migrating between frontend frameworks never requires rewriting your forms. Your FormConfig stays untouched while a tiny adapter connects @form-os/core to any UI framework.',
    developerSummary:
      'An adapter only needs to call normalizeConfig(config), initialize reactive values from createDefaultValues(fields), evaluate getFieldState(field, values) on change, and dispatch to a createFieldRegistry() map.',
    codeTitle: 'custom-vanilla-adapter.ts',
    codeSnippet: `import {
  normalizeConfig,
  createDefaultValues,
  getFieldState,
  createFieldRegistry,
  type FormConfig,
} from '@form-os/core';

export function bootFormOSRuntime<TComponent>(
  rawConfig: FormConfig,
  components: Record<string, TComponent>
) {
  const config = normalizeConfig(rawConfig);
  const registry = createFieldRegistry<TComponent>(components);
  const values = createDefaultValues(config.fields);

  return {
    getSnapshot() {
      return config.fields.map((field) => ({
        field,
        state: getFieldState(field, values),
        component: registry.get(field.type),
      }));
    },
    setValue(name: string, nextValue: unknown) {
      values[name] = nextValue;
    },
  };
}`,
  },
];

export const API_REFERENCE_ENTRIES: ApiReferenceEntry[] = [
  {
    pkg: '@form-os/core',
    name: 'normalizeConfig',
    kind: 'function',
    signature: 'normalizeConfig(config: FieldConfig[] | Partial<FormConfig> | unknown): FormConfig',
    description:
      'Normalizes a FieldConfig[] array or partial FormConfig object into a canonical FormConfig (defaults validationMode to "onTouched" and reValidateMode to "onChange" when passed an object). Throws if fields is missing.',
    example: `const config = normalizeConfig([{ name: 'email', type: 'email' }]);`,
  },
  {
    pkg: '@form-os/core',
    name: 'createDefaultValues',
    kind: 'function',
    signature: 'createDefaultValues(fields: FieldConfig[]): Record<string, any>',
    description:
      'Builds an initial key-value map for all fields by resolving getDefaultValue(field) for each entry.',
    example: `const defaults = createDefaultValues(config.fields);`,
  },
  {
    pkg: '@form-os/core',
    name: 'getDefaultValue',
    kind: 'function',
    signature: 'getDefaultValue(field: FieldConfig): any',
    description:
      'Returns field.defaultValue if defined; otherwise returns false for checkbox/switch, [] for multiple select, and "" for all other field types.',
    example: `getDefaultValue({ name: 'agree', type: 'checkbox' }); // false`,
  },
  {
    pkg: '@form-os/core',
    name: 'getFieldState',
    kind: 'function',
    signature: 'getFieldState(field: FieldConfig, values: Record<string, any>): FieldState',
    description:
      'The dependency engine kernel. Evaluates show, hidden, required, disabled, and readonly dependencies against live form values (AND-ing rules of the same type) and returns { visible, required, disabled, readonly, defaultValue }.',
    example: `const state = getFieldState(vatField, { jurisdiction: 'EU' });`,
  },
  {
    pkg: '@form-os/core',
    name: 'createFieldRegistry',
    kind: 'function',
    signature: 'createFieldRegistry<TComponent = unknown>(initial?: FieldRegistry<TComponent>)',
    description:
      'Creates a mutable component registry with register(type, component), get(type), has(type), and list() helpers.',
    example: `const registry = createFieldRegistry({ text: TextField });`,
  },
  {
    pkg: '@form-os/core',
    name: 'getValidationRules',
    kind: 'function',
    signature: 'getValidationRules(field: FieldConfig): ValidationRules',
    description: 'Returns field.rules ?? {} for passing into a form controller or validator.',
    example: `const rules = getValidationRules(field);`,
  },
  {
    pkg: '@form-os/core',
    name: 'coercePattern',
    kind: 'function',
    signature: 'coercePattern(pattern?: string | RegExp): RegExp | undefined',
    description:
      'Safely converts a string pattern or RegExp instance into a RegExp, returning undefined for invalid regular expressions.',
    example: `const regex = coercePattern('^[A-Z]{2}[0-9]+$');`,
  },
  {
    pkg: '@form-os/react',
    name: 'useFormConfig',
    kind: 'hook',
    signature: 'useFormConfig<TFieldValues>(config: FieldConfig[] | FormConfig): UseFormReturn<TFieldValues> & { fields: FieldConfig[] }',
    description:
      'Normalizes config, computes type-safe defaultValues, initializes react-hook-form useForm(), and returns the full UseFormReturn plus normalized fields.',
    example: `const form = useFormConfig(config);`,
  },
  {
    pkg: '@form-os/react',
    name: 'Field',
    kind: 'component',
    signature: '<Field field={FieldConfig} control={Control} component={?ComponentType} />',
    description:
      'Renders a single configured field using the component registered in FormFieldsProvider (or the per-field component override). Automatically returns null when state.visible is false.',
    example: `<Field field={field} control={form.control} />`,
  },
  {
    pkg: '@form-os/react',
    name: 'useField',
    kind: 'hook',
    signature: 'useField<TFieldValues>(field: FieldConfig, control: Control<TFieldValues>): { field, fieldState, state }',
    description:
      'Low-level hook combining useWatch, getFieldState, and useController for building completely bespoke field components.',
    example: `const { field: controllerField, fieldState, state } = useField(fieldConfig, control);`,
  },
  {
    pkg: '@form-os/react',
    name: 'FormFieldsProvider',
    kind: 'component',
    signature: '<FormFieldsProvider components={ComponentsMap}>{children}</FormFieldsProvider>',
    description:
      'React context provider that registers field-type -> React component mappings across the component tree.',
    example: `<FormFieldsProvider components={defaultComponents}><App /></FormFieldsProvider>`,
  },
  {
    pkg: '@form-os/react',
    name: 'useFieldComponents',
    kind: 'hook',
    signature: 'useFieldComponents(): ComponentsMap',
    description: 'Reads the active ComponentsMap from FormFieldsProvider.',
    example: `const components = useFieldComponents();`,
  },
  {
    pkg: '@form-os/react/fields',
    name: 'defaultComponents',
    kind: 'constant',
    signature: 'Record<"text" | "number" | "email" | "password" | "textarea" | "date" | "select" | "checkbox" | "radio" | "switch", ComponentType<FieldComponentProps>>',
    description:
      'Ready-made registry mapping the 10 standard field types to their tree-shakeable built-in field components (plus DefaultField wrapper).',
    example: `import { defaultComponents, DefaultField } from '@form-os/react/fields';`,
  },
  {
    pkg: '@form-os/schema',
    name: 'schema',
    kind: 'constant',
    signature: 'JSONSchema7 ($id: "https://form-os.dev/form-config.schema.json")',
    description:
      'Draft-07 JSON Schema definition for FormConfig, FieldConfig, Dependency, ValidationRules, and Choice.',
    example: `import { schema } from '@form-os/schema';`,
  },
];

export const USE_CASE_ARCHIPELAGO: UseCaseIsland[] = [
  {
    id: 'uc-lead-capture',
    index: 1,
    title: 'Contact & B2B Lead-Capture',
    category: 'Growth Marketing',
    coordinates: { x: -32, y: 12, z: 20 },
    businessOutcome:
      'Qualify enterprise buyers dynamically without scaring off self-serve signups.',
    technicalMechanism:
      'Uses show and required dependencies on companySegment === "enterprise" to reveal SSO/residency fields.',
    config: {
      validationMode: 'onTouched',
      fields: [
        { name: 'workEmail', type: 'email', label: 'Work Email', defaultValue: 'founder@acme.dev', rules: { required: 'Work email required' } },
        {
          name: 'planInterest',
          type: 'select',
          label: 'Target Deployment Tier',
          defaultValue: 'sovereign',
          options: [
            { label: 'Form-OS Scale (Growth)', value: 'scale' },
            { label: 'Form-OS Sovereign (Air-Gapped)', value: 'sovereign' },
          ],
        },
        {
          name: 'securityContact',
          type: 'text',
          label: 'CISO / Security Architect Contact',
          defaultValue: 'secops@acme.dev',
          dependencies: [
            { name: 'planInterest', value: 'sovereign', type: 'show' },
            { name: 'planInterest', value: 'sovereign', type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'uc-onboarding',
    index: 2,
    title: 'KYC / AML Onboarding Flows',
    category: 'FinTech & Banking',
    coordinates: { x: -16, y: 24, z: 40 },
    businessOutcome:
      'Cut onboarding drop-off by 42% by showing only jurisdiction-relevant regulatory fields.',
    technicalMechanism:
      'Multi-branch show/required rules keyed off tax jurisdiction and PEP status.',
    config: {
      validationMode: 'onTouched',
      fields: [
        {
          name: 'region',
          type: 'select',
          label: 'Entity Region',
          defaultValue: 'EU',
          options: [
            { label: 'European Union', value: 'EU' },
            { label: 'United States', value: 'US' },
          ],
        },
        {
          name: 'viesVat',
          type: 'text',
          label: 'EU VIES VAT ID',
          defaultValue: 'DE81293812',
          dependencies: [
            { name: 'region', value: 'EU', type: 'show' },
            { name: 'region', value: 'EU', type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'uc-surveys',
    index: 3,
    title: 'Dynamic Surveys & Diagnostic Quizzes',
    category: 'Product Research',
    coordinates: { x: 4, y: 18, z: 10 },
    businessOutcome:
      'Branching NPS and churn-diagnostics that adapt to user sentiment in sub-millisecond time.',
    technicalMechanism:
      'Radio/select score triggers conditional follow-up textarea when sentiment is detractor.',
    config: {
      validationMode: 'onChange',
      fields: [
        {
          name: 'npsCategory',
          type: 'radio',
          label: 'How likely are you to recommend form-os?',
          defaultValue: 'detractor',
          options: [
            { label: 'Promoter (9–10)', value: 'promoter' },
            { label: 'Detractor (0–6)', value: 'detractor' },
          ],
        },
        {
          name: 'blockerFeedback',
          type: 'textarea',
          label: 'What was the #1 friction point we can fix today?',
          defaultValue: 'Needed a visual schema editor for our PMs.',
          dependencies: [
            { name: 'npsCategory', value: 'detractor', type: 'show' },
            { name: 'npsCategory', value: 'detractor', type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'uc-admin-crud',
    index: 4,
    title: 'Internal Admin & CRUD Control Planes',
    category: 'Platform Engineering',
    coordinates: { x: 22, y: -8, z: 30 },
    businessOutcome:
      'Generate 50+ internal back-office resource editors from JSON configs without writing JSX.',
    technicalMechanism:
      'Uses readonly and disabled dependencies to enforce RBAC lockouts on production rows.',
    config: {
      validationMode: 'onBlur',
      fields: [
        { name: 'LockProductionRow', type: 'switch', label: 'Production Freeze Lock', defaultValue: true },
        {
          name: 'clusterEndpoint',
          type: 'text',
          label: 'Primary Database URI',
          defaultValue: 'postgres://prod-01.internal:5432',
          dependencies: [{ name: 'LockProductionRow', value: true, type: 'readonly' }],
        },
      ],
    },
  },
  {
    id: 'uc-wizards',
    index: 5,
    title: 'Multi-Step Conditional Wizards',
    category: 'Complex Workflows',
    coordinates: { x: -28, y: -18, z: 50 },
    businessOutcome:
      'Express multi-stage wizard progressions purely as declarative field dependencies.',
    technicalMechanism:
      'Step 2 and Step 3 fields declare show dependencies on prior step completion toggles.',
    config: {
      validationMode: 'onTouched',
      fields: [
        { name: 'step1Verified', type: 'checkbox', label: 'Step 1: Confirm Identity & Domain Ownership', defaultValue: true },
        {
          name: 'dnsTxtRecord',
          type: 'text',
          label: 'Step 2: DNS Verification Token',
          defaultValue: 'form-os-verify=99812a',
          dependencies: [{ name: 'step1Verified', value: true, type: 'show' }],
        },
      ],
    },
  },
  {
    id: 'uc-compliance',
    index: 6,
    title: 'Regulated HIPAA / BaFin Compliance Intake',
    category: 'Healthcare & Gov',
    coordinates: { x: 14, y: 28, z: 60 },
    businessOutcome:
      'Deterministic audit-ready rules that prove why a disclosure field was shown or required.',
    technicalMechanism:
      'Pure function getFieldState(field, values) can be re-evaluated identically on the server for compliance audits.',
    config: {
      validationMode: 'onChange',
      fields: [
        { name: 'isMinorPatient', type: 'switch', label: 'Patient is Under 18 Years Old', defaultValue: true },
        {
          name: 'guardianConsentCode',
          type: 'text',
          label: 'Notarized Guardian Consent ID',
          defaultValue: 'GUARD-2026-991',
          dependencies: [
            { name: 'isMinorPatient', value: true, type: 'show' },
            { name: 'isMinorPatient', value: true, type: 'required' },
          ],
        },
      ],
    },
  },
  {
    id: 'uc-server-driven',
    index: 7,
    title: 'Server-Driven UI Forms',
    category: 'Backend / Edge',
    coordinates: { x: -8, y: -24, z: 25 },
    businessOutcome:
      'Ship form updates to web and mobile clients instantly from your API without an app redeploy.',
    technicalMechanism:
      'Backend serves JSON validated by @form-os/schema; client boots it directly via useFormConfig.',
    config: {
      validationMode: 'onSubmit',
      fields: [
        { name: 'apiVersion', type: 'text', label: 'Remote Config Revision', defaultValue: 'v2026.10.17-edge', rules: { readonly: true } },
        { name: 'webhookUrl', type: 'text', label: 'Event Sink Webhook URL', defaultValue: 'https://api.acme.io/v1/ingest' },
      ],
    },
  },
  {
    id: 'uc-cms-driven',
    index: 8,
    title: 'Headless CMS-Driven Marketing Forms',
    category: 'Content & Ops',
    coordinates: { x: 32, y: 14, z: 45 },
    businessOutcome:
      'Marketing teams author campaign forms in Sanity, Contentful, or Strapi; engineering owns the React components.',
    technicalMechanism:
      'FormFieldsProvider maps CMS field types to your brand design-system components.',
    config: {
      validationMode: 'onTouched',
      fields: [
        { name: 'campaignSlug', type: 'text', label: 'CMS Campaign Identifier', defaultValue: 'q4-enterprise-summit' },
        { name: 'vipDinnerRsvp', type: 'switch', label: 'Request Executive Dinner Seat', defaultValue: true },
        {
          name: 'dietaryNotes',
          type: 'text',
          label: 'Dietary Preferences',
          defaultValue: 'Vegetarian',
          dependencies: [{ name: 'vipDinnerRsvp', value: true, type: 'show' }],
        },
      ],
    },
  },
  {
    id: 'uc-ai-generated',
    index: 9,
    title: 'AI / LLM-Generated Dynamic UIs',
    category: 'AI Native',
    coordinates: { x: -20, y: 6, z: 70 },
    businessOutcome:
      'Let LLMs generate structured interactive forms on the fly instead of brittle markdown text.',
    technicalMechanism:
      'Pass @form-os/schema as response_schema to Gemini/OpenAI; render the JSON output immediately with @form-os/react.',
    config: {
      validationMode: 'onChange',
      fields: [
        { name: 'llmModel', type: 'select', label: 'Generator Model', defaultValue: 'gemini-4', options: [{ label: 'Gemini 4 High', value: 'gemini-4' }, { label: 'Claude 4.5', value: 'claude-4' }] },
        { name: 'strictSchemaMode', type: 'switch', label: 'Enforce @form-os/schema Structured Output', defaultValue: true },
      ],
    },
  },
  {
    id: 'uc-white-label',
    index: 10,
    title: 'White-Label Form-Builder Products',
    category: 'SaaS Platforms',
    coordinates: { x: 18, y: -22, z: 65 },
    businessOutcome:
      'Embed a full Typeform-class form builder inside your own B2B SaaS in an afternoon.',
    technicalMechanism:
      'Your visual builder mutates a FormConfig JSON object; @form-os/core and @form-os/react power the live canvas and end-user runtime.',
    config: {
      validationMode: 'onTouched',
      fields: [
        { name: 'tenantBrandColor', type: 'text', label: 'Tenant Primary Accent Hex', defaultValue: '#00F5D4' },
        { name: 'enableCustomDomain', type: 'switch', label: 'Enable White-Label Custom Domain', defaultValue: true },
        {
          name: 'customHostname',
          type: 'text',
          label: 'Custom CNAME Hostname',
          defaultValue: 'forms.customer-portal.com',
          dependencies: [
            { name: 'enableCustomDomain', value: true, type: 'show' },
            { name: 'enableCustomDomain', value: true, type: 'required' },
          ],
        },
      ],
    },
  },
];

export const FRAMEWORK_MATRIX: FrameworkMatrixItem[] = [
  {
    name: 'Universal JS / TS Kernel',
    pkg: '@form-os/core',
    status: 'Production v1.0.0',
    runtimeEnv: 'Node, Bun, Deno, Cloudflare Workers, Browser, SSR',
    notes: 'Zero dependencies. Pure config normalization, dependency engine, and validation rules.',
  },
  {
    name: 'React 18+ Adapter',
    pkg: '@form-os/react',
    status: 'Production v1.0.0',
    runtimeEnv: 'Next.js App Router, Vite, Remix, SPA',
    notes: 'Built on react-hook-form with 11 tree-shakeable field components in @form-os/react/fields.',
  },
  {
    name: 'JSON Schema ABI',
    pkg: '@form-os/schema',
    status: 'Production v1.0.0',
    runtimeEnv: 'Ajv, OpenAPI, LLM Structured Outputs, CMS',
    notes: 'Canonical Draft-07 JSON Schema + TypeScript types for portable form configs.',
  },
  {
    name: 'Svelte 5 Runes Adapter',
    pkg: '@form-os/svelte',
    status: 'Roadmap',
    runtimeEnv: 'SvelteKit / Svelte 5',
    notes: 'Placeholder package in monorepo today — full Svelte 5 runes adapter on the public Roadmap.',
  },
  {
    name: 'Vue 3 / Nuxt Adapter',
    pkg: '@form-os/vue (Roadmap)',
    status: 'Roadmap',
    runtimeEnv: 'Vue 3 Composition API / Nuxt',
    notes: 'Planned official adapter powered by @form-os/core.',
  },
  {
    name: 'SolidJS & React Native',
    pkg: '@form-os/solid · @form-os/native (Roadmap)',
    status: 'Roadmap',
    runtimeEnv: 'SolidStart, Expo / React Native',
    notes: 'Share the exact same FormConfig JSON across web and native mobile apps.',
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    capability: 'Source of Truth',
    formOs: 'Serializable FormConfig JSON/TS (portable across DB, API, CMS, LLM)',
    rawRhfFormik: 'Imperative JSX markup + scattered per-form hooks (not serializable)',
    jsonForms: 'Heavyweight JSON Schema + separate UI Schema dual-file ceremony',
    typeformJotform: 'Proprietary cloud lock-in (cannot version in Git)',
  },
  {
    capability: 'Conditional Logic (show / hidden / required / disabled / readonly)',
    formOs: 'Built-in deterministic getFieldState() with multi-rule AND composition',
    rawRhfFormik: 'Manual watch() + brittle nested ternaries rewritten per form',
    jsonForms: 'Verbose rule objects limited to basic SHOW/HIDE/ENABLE/DISABLE',
    typeformJotform: 'GUI logic jumps locked behind expensive enterprise plans',
  },
  {
    capability: 'React Hook Form Relationship',
    formOs: 'Superset built ON TOP of react-hook-form (full UseFormReturn access)',
    rawRhfFormik: 'Base primitive — you write all wiring and field dispatch yourself',
    jsonForms: 'Custom internal state store disconnected from react-hook-form',
    typeformJotform: 'Iframe embed — zero React state integration',
  },
  {
    capability: 'UI Component Ownership',
    formOs: '100% yours via FormFieldsProvider + 11 tree-shakeable defaults',
    rawRhfFormik: '100% manual per form',
    jsonForms: 'Tightly coupled to Material/Vanilla renderers; painful to customize',
    typeformJotform: 'Locked to vendor theme templates',
  },
  {
    capability: 'Core Bundle Overhead',
    formOs: '< 2.4 kB gzipped (@form-os/core has 0 dependencies)',
    rawRhfFormik: '~9–14 kB + repeated per-form glue code',
    jsonForms: '> 85 kB gzipped with renderer suites',
    typeformJotform: '> 250 kB external script + third-party cookies',
  },
  {
    capability: 'Per-Submission Pricing',
    formOs: '$0 Forever (MIT Open Source) + optional flat-rate Scale/Sovereign cloud',
    rawRhfFormik: '$0 (self-built)',
    jsonForms: '$0 (self-built)',
    typeformJotform: 'Punitive per-response overage fees at scale',
  },
];
