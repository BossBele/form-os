import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';
import type { FieldConfig } from '@form-os/core';
import { useFormConfig } from '../useFormConfig';
import { Field } from '../Field';
import { DefaultField, type FieldComponentProps } from '../fields';

type Form = UseFormReturn<FieldValues> & { fields: FieldConfig[] };

function renderForm(fields: FieldConfig[]) {
  let form: Form | undefined;
  function Harness() {
    const f = useFormConfig<FieldValues>(fields);
    form = f;
    return (
      <FormProvider {...f}>
        <form>
          {f.fields.map((fc) => (
            <DefaultField key={fc.name} field={fc} control={f.control} />
          ))}
        </form>
      </FormProvider>
    );
  }
  const html = renderToString(<Harness />);
  return { html, form: form as Form };
}

describe('Field', () => {
  it('renders a defined value for a text field without an explicit defaultValue', () => {
    const { html } = renderForm([{ name: 'title', type: 'text' }]);
    expect(html).toContain('value=""');
  });

  it('registers type-aware defaults in the form store', () => {
    const { form } = renderForm([
      { name: 'title', type: 'text' },
      { name: 'agree', type: 'checkbox' },
      { name: 'tags', type: 'select', props: { multiple: true } },
    ]);
    expect(form.getValues('title')).toBe('');
    expect(form.getValues('agree')).toBe(false);
    expect(form.getValues('tags')).toEqual([]);
  });

  it('respects an explicit defaultValue over the type default', () => {
    const { form, html } = renderForm([
      { name: 'title', type: 'text', defaultValue: 'hello' },
    ]);
    expect(form.getValues('title')).toBe('hello');
    expect(html).toContain('value="hello"');
  });

  it('does not leak non-DOM props as attributes', () => {
    const { html } = renderForm([{ name: 'title', type: 'text' }]);
    expect(html).not.toMatch(/fieldstate/i);
    expect(html).not.toMatch(/formfield/i);
  });

  it('applies readonly and disabled from field state to the input', () => {
    const { html } = renderForm([
      { name: 'ro', type: 'text', rules: { readonly: true } },
      { name: 'dis', type: 'text', rules: { disabled: true } },
    ]);
    expect(html).toContain('readonly');
    expect(html).toContain('disabled');
  });

  it('gives custom components a directly spreadable formField', () => {
    const Custom = ({ formField }: FieldComponentProps) => (
      <input type="text" {...formField} />
    );
    function Harness() {
      const form = useFormConfig([{ name: 'n', type: 'text' }]);
      return (
        <Field
          field={form.fields[0]}
          control={form.control}
          component={Custom}
        />
      );
    }
    const html = renderToString(<Harness />);
    expect(html).toContain('value=""');
  });
});
