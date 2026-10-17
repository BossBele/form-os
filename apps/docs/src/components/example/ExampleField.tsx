'use client';

import React from 'react';
import type { ComponentType } from 'react';
import type { ComponentsMap } from '@form-os/react';
import {
  CheckboxField,
  DateField,
  EmailField,
  NumberField,
  PasswordField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  defaultComponents,
  type FieldComponentProps,
} from '@form-os/react/fields';
import { cn } from '../../lib/utils';

type FieldKind = 'input' | 'choice' | 'toggle';

const INPUT_CLASS = cn(
  'w-full min-w-0 rounded-lg border bg-forest-bark/70 px-3.5 py-2.5 text-sm',
  'text-forest-moonlight placeholder:text-forest-mist/45',
  'border-forest-fern/35 transition-colors',
  'focus:border-forest-marigold focus:outline-none focus:ring-2 focus:ring-forest-marigold/25',
  'read-only:border-forest-fern/20 read-only:bg-forest-moss/30 read-only:text-forest-mist',
  'disabled:cursor-not-allowed disabled:opacity-45'
);

const TOGGLE_CLASS = cn(
  'h-4 w-4 shrink-0 cursor-pointer rounded border-forest-fern/50',
  'bg-forest-bark accent-forest-marigold'
);

const CHOICE_CLASS = cn(
  'min-w-0 space-y-2 text-sm text-forest-moonlight',
  '[&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2.5',
  '[&_input]:h-4 [&_input]:w-4 [&_input]:accent-forest-marigold'
);

/**
 * Wraps one of the library's built-in field components in the forest shell:
 * a wrapping label, the live gate badges, and the error line.
 */
function wrapField(
  Inner: ComponentType<FieldComponentProps>,
  kind: FieldKind
): ComponentType<FieldComponentProps> {
  function ForestField(props: FieldComponentProps) {
    const { fieldConfig, fieldState, error } = props;
    const gated = (fieldConfig.dependencies?.length ?? 0) > 0;
    const controlId = `example-${fieldConfig.name}`;

    const className =
      kind === 'toggle'
        ? TOGGLE_CLASS
        : kind === 'choice'
          ? CHOICE_CLASS
          : INPUT_CLASS;

    return (
      <div
        data-example-field={fieldConfig.name}
        className={cn(
          'min-w-0 rounded-xl border p-4 transition-colors',
          gated
            ? 'border-forest-fern/40 bg-forest-moss/45'
            : 'border-forest-fern/20 bg-forest-moss/25'
        )}
      >
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <label
            htmlFor={controlId}
            className="min-w-0 break-words text-sm font-medium leading-snug text-forest-moonlight"
          >
            {fieldConfig.label ?? fieldConfig.name}
          </label>

          <span className="flex shrink-0 items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider">
            {gated && <span className="text-forest-fern">conditional</span>}
            {fieldState.required && (
              <span className="text-forest-marigold">required</span>
            )}
            {fieldState.readonly && <span className="text-forest-mist">read only</span>}
            {fieldState.disabled && <span className="text-forest-mist">locked</span>}
          </span>
        </div>

        <div className={cn('min-w-0', kind === 'toggle' ? 'mt-2.5' : 'mt-3')}>
          <Inner {...props} id={controlId} className={className} />
        </div>

        {fieldConfig.description && (
          <p className="mt-2 min-w-0 break-words text-xs leading-relaxed text-forest-mist">
            {fieldConfig.description}
          </p>
        )}

        {error?.message && (
          <p
            role="alert"
            className="mt-2 min-w-0 break-words text-xs text-forest-ember"
          >
            {String(error.message)}
          </p>
        )}
      </div>
    );
  }

  ForestField.displayName = `ForestField(${Inner.name || 'Field'})`;
  return ForestField;
}

/**
 * The component map handed to FormFieldsProvider. Exported so the use-case
 * section can render its mini forms with the same styling rather than
 * duplicating it.
 */
export const forestFieldComponents: ComponentsMap = {
  ...defaultComponents,
  text: wrapField(TextField, 'input'),
  number: wrapField(NumberField, 'input'),
  email: wrapField(EmailField, 'input'),
  password: wrapField(PasswordField, 'input'),
  textarea: wrapField(TextAreaField, 'input'),
  date: wrapField(DateField, 'input'),
  select: wrapField(SelectField, 'input'),
  checkbox: wrapField(CheckboxField, 'toggle'),
  switch: wrapField(SwitchField, 'toggle'),
  radio: wrapField(RadioField, 'choice'),
};

export const ExampleField = forestFieldComponents.text;
