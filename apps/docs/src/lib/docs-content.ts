export interface DocSnippet {
  title: string;
  language: 'ts' | 'tsx' | 'bash' | 'json';
  code: string;
}

export interface DocChapter {
  id: 'quickstart' | 'core' | 'react' | 'schema';
  title: string;
  lede: string;
  prose: string[];
  snippets: DocSnippet[];
}

export interface ApiEntry {
  pkg: string;
  name: string;
  kind: 'function' | 'hook' | 'component' | 'constant' | 'type';
  signature: string;
  description: string;
  example: string;
}

export interface RoadmapEntry {
  pkg: string;
  status: 'Roadmap';
  note: string;
}

export const DOC_CHAPTERS: ReadonlyArray<DocChapter> = [
  {
    id: 'quickstart',
    title: 'Quickstart',
    lede: 'A working, conditional form in about five minutes — and none of it is wiring.',
    prose: [
      'Install the core, the React bindings, and react-hook-form. If you want to check configurations outside a browser — in a CMS, an API, or a build step — add the schema package too.',
      'Then describe your form as an object. Each entry in fields is one input: what it is called, what type it is, and optionally how it should behave. There is no separate markup file, and no second place to keep in step.',
      'Hand that object to useFormConfig and render the fields it gives you back. Everything that makes the form interesting — the conditions, the validation, the defaults — is already in the description you just wrote.',
    ],
    snippets: [
      {
        title: 'Install',
        language: 'bash',
        code: `pnpm add @form-os/core @form-os/react react-hook-form
# optional, for validating configs outside the browser
pnpm add @form-os/schema`,
      },
      {
        title: 'Describe the form',
        language: 'ts',
        code: `import type { FormConfig } from '@form-os/core';

export const config: FormConfig = {
  validationMode: 'onTouched',
  fields: [
    {
      name: 'accountType',
      type: 'select',
      label: 'Account type',
      defaultValue: 'business',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'taxId',
      type: 'text',
      label: 'Company tax ID',
      // Appears, and becomes mandatory, only for business accounts.
      dependencies: [
        { name: 'accountType', value: 'business', type: 'show' },
        { name: 'accountType', value: 'business', type: 'required' },
      ],
      rules: { required: 'A tax ID is required for business accounts' },
    },
  ],
};`,
      },
      {
        title: 'Render it',
        language: 'tsx',
        code: `import {
  useFormConfig,
  Field,
  FormFieldsProvider,
  FormProvider,
} from '@form-os/react';
import { defaultComponents } from '@form-os/react/fields';
import { config } from './config';

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
    ],
  },
  {
    id: 'core',
    title: 'Core concepts',
    lede:
      'The dependency engine is the interesting part. Everything else is convenience.',
    prose: [
      'A field can watch other fields. You declare that as a list of dependencies, each naming the field it watches, the value it is waiting for, and what should happen when that value turns up. There are five things that can happen: show, hidden, required, disabled, and readonly.',
      'When a field carries several dependencies of the same kind, they all have to match at once. Two show rules means both values must line up before the field appears. That single rule covers most of what people reach for a visual logic builder to express.',
      'getFieldState is the function that answers it. Given a field and the current values, it returns whether the field is visible, required, disabled or read-only, plus the default value it should start from. It is a plain function with no React in it, so the same answer comes out in a test, on a server, or in a worker.',
      'Validation rules sit alongside: required, min, max, minLength, maxLength, and pattern. Each accepts either a bare value or an object with a message, so a form can be precise without becoming unreadable.',
    ],
    snippets: [
      {
        title: 'All five kinds of condition',
        language: 'ts',
        code: `import type { FieldConfig } from '@form-os/core';

const field: FieldConfig = {
  name: 'rootKey',
  type: 'password',
  label: 'Cluster root key',
  dependencies: [
    // Both must match — rules of the same kind are combined with AND.
    { name: 'tier', value: 'sovereign', type: 'show' },
    { name: 'approved', value: true, type: 'show' },
    // hidden wins over show when it matches.
    { name: 'lockdown', value: true, type: 'hidden' },
    // Required only in this one situation.
    { name: 'tier', value: 'sovereign', type: 'required' },
    // And not editable while it is being reviewed.
    { name: 'underReview', value: true, type: 'readonly' },
  ],
};`,
      },
      {
        title: 'Ask what a field should be doing',
        language: 'ts',
        code: `import { getFieldState, normalizeConfig, createDefaultValues } from '@form-os/core';

const form = normalizeConfig(fieldList);
const values = createDefaultValues(form.fields);
// -> { tier: '', approved: false, lockdown: false, ... }

const state = getFieldState(form.fields[0], { tier: 'sovereign', approved: true });
// -> { visible: true, required: true, disabled: false, readonly: false, defaultValue: '' }`,
      },
      {
        title: 'Rules with their own wording',
        language: 'ts',
        code: `rules: {
  required: 'We need this before we can continue',
  minLength: { value: 8, message: 'At least eight characters, please' },
  pattern: { value: '^[A-Z]{2}[0-9A-Z]{8,12}$', message: 'That is not a VAT number' },
}`,
      },
    ],
  },
  {
    id: 'react',
    title: 'The React bindings',
    lede:
      'Thin by design. They wire your description into react-hook-form and then get out of the way.',
    prose: [
      'useFormConfig takes your description, works out the starting values, sets up react-hook-form, and hands back everything react-hook-form gives you plus the normalised fields. If you already know react-hook-form, you already know how to submit, reset, and read this form.',
      'Field renders one entry. It looks up the right component for that field type, evaluates the field state, and returns nothing at all when the field is hidden. You never write an if around a hidden field again.',
      'FormFieldsProvider is where your design system goes in. Register a map of field type to component once, near the top of your app, and every form below it uses your components. There are eleven built-in ones to start from, and they are individually importable so unused ones cost nothing.',
      'When you need total control over a single field, useField gives you the same pieces Field uses internally — the controller, the field state, and the evaluated conditions — so you can build something entirely your own without leaving the system.',
    ],
    snippets: [
      {
        title: 'Bring your own components',
        language: 'tsx',
        code: `import { FormFieldsProvider } from '@form-os/react';
import { defaultComponents, type FieldComponentProps } from '@form-os/react/fields';

function IbanField({ formField, fieldConfig, fieldState, error }: FieldComponentProps) {
  return (
    <label>
      {fieldConfig.label}
      <input {...formField} readOnly={fieldState.readonly} placeholder="DE89 3704 ..." />
      {error ? <span role="alert">{error.message}</span> : null}
    </label>
  );
}

export const components = { ...defaultComponents, 'iban': IbanField };

// Once, near the root of your app:
<FormFieldsProvider components={components}>{children}</FormFieldsProvider>;`,
      },
      {
        title: 'Teach TypeScript your own field types',
        language: 'ts',
        code: `declare module '@form-os/core' {
  interface FieldTypeMap {
    'iban': {};
    'rich-text': { toolbar?: string[] };
  }
}

// Now { type: 'iban' } type-checks, and 'rich-text' gets its props checked too.`,
      },
      {
        title: 'When Field is not enough',
        language: 'tsx',
        code: `import { useField } from '@form-os/react';

function BespokeField({ field, control }) {
  const { field: controller, fieldState, state } = useField(field, control);

  if (!state.visible) return null;

  return (
    <div>
      <input {...controller} disabled={state.disabled} readOnly={state.readonly} />
      {fieldState.error ? <p>{fieldState.error.message}</p> : null}
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 'schema',
    title: 'The schema package',
    lede:
      'The reason a form can be written by something other than a person.',
    prose: [
      '@form-os/schema exports one thing: a JSON Schema describing what a valid configuration looks like. It is the contract that lets a configuration travel — between services, between teams, and between a person and a machine.',
      'That matters more than it sounds. Once a form is data with a published shape, it can live in a content management system and be edited by someone who does not write code. It can be served by an API and updated without a deploy. It can be produced by a language model and checked before a single input is drawn.',
      'Validate with any JSON Schema validator you already have. Ajv is the common choice. A configuration that fails validation never reaches the browser, which turns a whole class of production incident into a build failure.',
    ],
    snippets: [
      {
        title: 'Validate before you render',
        language: 'ts',
        code: `import Ajv from 'ajv';
import { schema } from '@form-os/schema';
import type { FormConfig } from '@form-os/core';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile<FormConfig>(schema);

export function acceptConfig(payload: unknown): FormConfig {
  if (!validate(payload)) {
    throw new Error('Not a valid form configuration: ' + ajv.errorsText(validate.errors));
  }
  return payload;
}`,
      },
      {
        title: 'Check it in CI, too',
        language: 'bash',
        code: `# Any validator will do — the schema is plain Draft-07.
npx ajv-cli validate -s node_modules/@form-os/schema/dist/form-config.schema.json -d "forms/*.json"`,
      },
    ],
  },
];

export const API_ENTRIES: ReadonlyArray<ApiEntry> = [
  {
    pkg: '@form-os/core',
    name: 'normalizeConfig',
    kind: 'function',
    signature:
      'normalizeConfig(config: FieldConfig[] | Partial<FormConfig> | unknown): FormConfig',
    description:
      'Turns either a bare array of fields or a partial config object into a canonical FormConfig. When given an object it fills in validationMode with "onTouched" and reValidateMode with "onChange". Throws if there is no fields array to be found.',
    example: `const form = normalizeConfig([{ name: 'email', type: 'email' }]);
// -> { validationMode: 'onTouched', reValidateMode: 'onChange', fields: [...] }`,
  },
  {
    pkg: '@form-os/core',
    name: 'createDefaultValues',
    kind: 'function',
    signature: 'createDefaultValues(fields: FieldConfig[]): Record<string, any>',
    description:
      'Builds the starting values for a whole form by resolving each field through getDefaultValue. This is what the React binding seeds react-hook-form with.',
    example: `const values = createDefaultValues(form.fields);`,
  },
  {
    pkg: '@form-os/core',
    name: 'getDefaultValue',
    kind: 'function',
    signature: 'getDefaultValue(field: FieldConfig): any',
    description:
      'Returns the field\'s own defaultValue when it has one. Otherwise it falls back by type: false for checkbox and switch, an empty array for a multiple select, and an empty string for everything else.',
    example: `getDefaultValue({ name: 'agree', type: 'checkbox' }); // false
getDefaultValue({ name: 'tags', type: 'select', props: { multiple: true } }); // []`,
  },
  {
    pkg: '@form-os/core',
    name: 'getFieldState',
    kind: 'function',
    signature:
      'getFieldState(field: FieldConfig, values: Record<string, any>): FieldState',
    description:
      'The dependency engine. Evaluates every show, hidden, required, disabled and readonly condition against the current values — combining conditions of the same kind with AND — and returns { visible, required, disabled, readonly, defaultValue }. It is a pure function with no React dependency.',
    example: `const state = getFieldState(vatField, { jurisdiction: 'EU' });
// -> { visible: true, required: true, disabled: false, readonly: false, defaultValue: '' }`,
  },
  {
    pkg: '@form-os/core',
    name: 'createFieldRegistry',
    kind: 'function',
    signature:
      'createFieldRegistry<T>(defaults: FieldRegistry<T>, overrides?: FieldRegistry<T>): FieldRegistry<T>',
    description:
      'Merges a set of default components with your overrides, keyed by field type. Useful when you want to replace two components out of eleven without listing the rest.',
    example: `const components = createFieldRegistry(defaultComponents, { text: MyTextField });`,
  },
  {
    pkg: '@form-os/core',
    name: 'getValidationRules',
    kind: 'function',
    signature: 'getValidationRules(field: FieldConfig): ValidationRules',
    description:
      'Returns the field\'s rules, or an empty object when it has none, so callers never have to guard for undefined.',
    example: `const rules = getValidationRules(field);`,
  },
  {
    pkg: '@form-os/core',
    name: 'coercePattern',
    kind: 'function',
    signature: 'coercePattern(pattern?: string | RegExp): RegExp | undefined',
    description:
      'Turns a string pattern into a RegExp and passes an existing RegExp through untouched. Returns undefined for an empty or malformed pattern rather than throwing, so one bad rule cannot take a form down.',
    example: `coercePattern('^[A-Z]{2}[0-9A-Z]{8,12}$'); // /^[A-Z]{2}[0-9A-Z]{8,12}$/
coercePattern('['); // undefined`,
  },
  {
    pkg: '@form-os/react',
    name: 'useFormConfig',
    kind: 'hook',
    signature:
      'useFormConfig<TFieldValues extends FieldValues>(config: FieldConfig[] | FormConfig): UseFormReturn<TFieldValues> & { fields: FieldConfig[] }',
    description:
      'Normalises the config, derives the starting values, initialises react-hook-form, and returns the complete UseFormReturn alongside the normalised fields ready to render.',
    example: `const form = useFormConfig(config);
// form.handleSubmit, form.reset, form.control ... plus form.fields`,
  },
  {
    pkg: '@form-os/react',
    name: 'Field',
    kind: 'component',
    signature:
      '<Field field={FieldConfig} control={Control<TFieldValues>} component={?ComponentType} />',
    description:
      'Renders one configured field, choosing the component registered for its type and honouring a per-field override. Returns null when the field is currently hidden, so conditions need no markup of their own.',
    example: `<Field field={form.fields[0]} control={form.control} />`,
  },
  {
    pkg: '@form-os/react',
    name: 'useField',
    kind: 'hook',
    signature:
      'useField<TFieldValues extends FieldValues>(field: FieldConfig, control: Control<TFieldValues>): { field, fieldState, state }',
    description:
      'The same internals Field uses: a react-hook-form controller, its field state, and the evaluated dependency conditions. Reach for it when you want a completely custom input without leaving the system.',
    example: `const { field: controller, fieldState, state } = useField(fieldConfig, control);`,
  },
  {
    pkg: '@form-os/react',
    name: 'FormFieldsProvider',
    kind: 'component',
    signature:
      '<FormFieldsProvider components={ComponentsMap}>{children}</FormFieldsProvider>',
    description:
      'Registers a field-type to component map for everything beneath it. This is how a design system reaches every form in an application without being passed down by hand.',
    example: `<FormFieldsProvider components={components}>{children}</FormFieldsProvider>`,
  },
  {
    pkg: '@form-os/react',
    name: 'useFieldComponents',
    kind: 'hook',
    signature: 'useFieldComponents(): ComponentsMap',
    description:
      'Reads the component map currently registered by the nearest FormFieldsProvider.',
    example: `const components = useFieldComponents();`,
  },
  {
    pkg: '@form-os/react/fields',
    name: 'defaultComponents',
    kind: 'constant',
    signature:
      "Record<'text' | 'number' | 'email' | 'password' | 'textarea' | 'date' | 'select' | 'checkbox' | 'radio' | 'switch', ComponentType<FieldComponentProps>>",
    description:
      'A ready-made map covering the ten standard field types, built from the individually importable components in the same module. Spread it to add your own, or import single components and skip the rest.',
    example: `import { defaultComponents, TextField } from '@form-os/react/fields';`,
  },
  {
    pkg: '@form-os/schema',
    name: 'schema',
    kind: 'constant',
    signature:
      'JSONSchema7  // $id: "https://form-os.dev/form-config.schema.json"',
    description:
      'A Draft-07 JSON Schema describing FormConfig, FieldConfig, Dependency, ValidationRules and Choice. Import it and hand it to any validator to check a configuration before it is used.',
    example: `import { schema } from '@form-os/schema';
const validate = new Ajv().compile(schema);`,
  },
];

export const ROADMAP_ENTRIES: ReadonlyArray<RoadmapEntry> = [
  {
    pkg: '@form-os/svelte',
    status: 'Roadmap',
    note: 'A placeholder package exists in the repository today. A full Svelte 5 adapter is on the roadmap.',
  },
  {
    pkg: '@form-os/vue',
    status: 'Roadmap',
    note: 'Planned official adapter over the same dependency-free core.',
  },
  {
    pkg: '@form-os/solid',
    status: 'Roadmap',
    note: 'Planned. The core has no framework dependency, so the work is the bindings alone.',
  },
  {
    pkg: '@form-os/native',
    status: 'Roadmap',
    note: 'Planned. The same configuration would drive a native mobile form unchanged.',
  },
];
