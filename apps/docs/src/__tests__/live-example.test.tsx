import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { getFieldState } from '@form-os/core';
import type { FieldComponentProps } from '@form-os/react/fields';
import { EXAMPLE_CONFIG, EXAMPLE_TOGGLES } from '../lib/example-config';
import { validateFormConfigSchema } from '../lib/schema-validator';
import { FormOSExample } from '../components/example/FormOSExample';
import { ExampleField } from '../components/example/ExampleField';

function fieldProps(
  overrides: Partial<FieldComponentProps> = {}
): FieldComponentProps {
  return {
    formField: {
      name: 'sample',
      value: '',
      onChange: () => {},
      onBlur: () => {},
      ref: () => {},
    },
    fieldConfig: { name: 'sample', type: 'text', label: 'Sample' },
    fieldState: {
      visible: true,
      required: false,
      disabled: false,
      readonly: false,
      defaultValue: '',
    },
    ...overrides,
  } as FieldComponentProps;
}

describe('Task 4: The live example', () => {
  it('is a schema-valid config that shows the dependency engine doing real work', () => {
    expect(validateFormConfigSchema(EXAMPLE_CONFIG).valid).toBe(true);
    const conditional = EXAMPLE_CONFIG.fields.filter(
      (f) => (f.dependencies?.length ?? 0) > 0
    );
    expect(conditional.length).toBeGreaterThanOrEqual(3);
  });

  it('uses every one of the five dependency gate types', () => {
    const types = new Set(
      EXAMPLE_CONFIG.fields.flatMap((f) =>
        (f.dependencies ?? []).map((d) => d.type)
      )
    );
    expect([...types].sort()).toEqual([
      'disabled',
      'hidden',
      'readonly',
      'required',
      'show',
    ]);
  });

  it('actually changes field state when a toggle value changes', () => {
    const dependent = EXAMPLE_CONFIG.fields.find((f) => f.dependencies?.length)!;
    const source = dependent.dependencies![0];
    const onState = getFieldState(dependent, { [source.name]: source.value });
    const offState = getFieldState(dependent, { [source.name]: '__other__' });
    expect(onState).not.toEqual(offState);
  });

  it('offers a small set of toggles, each naming a real field in the config', () => {
    expect(EXAMPLE_TOGGLES.length).toBeGreaterThanOrEqual(3);
    const names = EXAMPLE_CONFIG.fields.map((f) => f.name);
    for (const toggle of EXAMPLE_TOGGLES) {
      expect(names).toContain(toggle.name);
      expect(toggle.label.length).toBeGreaterThan(3);
    }
  });

  it('renders the real form on the server, hiding the fields whose gates are closed', () => {
    const html = renderToString(<FormOSExample />);
    expect(html).toContain('data-form-os-example');
    const alwaysVisible = EXAMPLE_CONFIG.fields.filter(
      (f) => !f.dependencies?.length
    );
    for (const field of alwaysVisible) {
      expect(html).toContain(field.label ?? field.name);
    }
  });

  it('exposes its config beside the form, wrapped so a long label cannot break the layout', () => {
    const html = renderToString(<FormOSExample />);
    expect(html).toContain('data-config-pane');
    expect(html).toContain('overflow-x-hidden');
  });

  it('wraps a field label far longer than the fixture instead of breaking the row', () => {
    const longLabel =
      'Authorised signatory full legal name and registered residential address exactly as it appears on the certificate of incorporation, including any former trading names';
    const html = renderToString(
      <ExampleField
        {...fieldProps({
          fieldConfig: { name: 'signatory', type: 'text', label: longLabel },
        })}
      />
    );
    expect(html).toContain(longLabel);
    expect(html).toContain('break-words');
    expect(html).toContain('min-w-0');
  });
});
