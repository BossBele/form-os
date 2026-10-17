'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useFormConfig,
  Field,
  FormFieldsProvider,
  FormProvider,
  type ComponentsMap,
} from '@form-os/react';
import {
  TextField,
  NumberField,
  EmailField,
  PasswordField,
  TextAreaField,
  DateField,
  SelectField,
  CheckboxField,
  RadioField,
  SwitchField,
  defaultComponents,
  type FieldComponentProps,
} from '@form-os/react/fields';
import { getFieldState, type FormConfig } from '@form-os/core';
import { useWatch } from 'react-hook-form';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Terminal,
} from 'lucide-react';

function wrapFieldComponent(
  InnerComponent: React.ComponentType<FieldComponentProps>,
  kind: 'input' | 'boolean' | 'radio'
) {
  return function StyledOSField(props: FieldComponentProps) {
    const { fieldConfig, fieldState, error } = props;
    const hasDeps = (fieldConfig.dependencies?.length ?? 0) > 0;

    const inputClassName =
      kind === 'boolean'
        ? 'h-4 w-4 rounded border-slate-600 bg-slate-900 text-teal-400 focus:ring-teal-400 accent-teal-400 cursor-pointer'
        : kind === 'radio'
          ? 'space-y-2 text-sm text-slate-200'
          : 'w-full rounded-lg border border-slate-700/80 bg-slate-950/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-inner transition focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/50 disabled:cursor-not-allowed disabled:opacity-50 read-only:border-amber-500/40 read-only:bg-slate-900/60';

    return (
      <div
        className={`group relative rounded-xl border p-3.5 transition-all duration-200 ${
          error
            ? 'border-rose-500/60 bg-rose-950/15'
            : hasDeps
              ? 'border-teal-500/35 bg-slate-900/70 shadow-[0_0_25px_-12px_rgba(0,245,212,0.35)]'
              : 'border-slate-800/90 bg-slate-900/45 hover:border-slate-700'
        }`}
      >
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-200">
            <span>{fieldConfig.label ?? fieldConfig.name}</span>
            {fieldState.required && (
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-amber-300 border border-amber-500/30">
                REQUIRED
              </span>
            )}
            {fieldState.readonly && (
              <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 px-1.5 py-0.5 font-mono text-[10px] text-sky-300 border border-sky-500/30">
                <Lock className="h-2.5 w-2.5" /> READONLY
              </span>
            )}
            {fieldState.disabled && (
              <span className="rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] text-rose-300 border border-rose-500/30">
                DISABLED
              </span>
            )}
          </label>

          <div className="flex items-center gap-1.5">
            {hasDeps && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 font-mono text-[10px] text-teal-300 border border-teal-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                {fieldConfig.dependencies?.length} dep
              </span>
            )}
            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              {fieldConfig.type}
            </span>
          </div>
        </div>

        {kind === 'boolean' ? (
          <div className="flex items-center gap-3 py-1">
            <InnerComponent {...props} className={inputClassName} />
            <span className="text-xs text-slate-400">
              {fieldConfig.description ?? `Toggle ${fieldConfig.name} state`}
            </span>
          </div>
        ) : (
          <>
            <InnerComponent {...props} className={inputClassName} />
            {fieldConfig.description && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                {fieldConfig.description}
              </p>
            )}
          </>
        )}

        {error?.message && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{String(error.message)}</span>
          </div>
        )}
      </div>
    );
  };
}

const styledOSComponents: ComponentsMap = {
  ...defaultComponents,
  text: wrapFieldComponent(TextField, 'input'),
  number: wrapFieldComponent(NumberField, 'input'),
  email: wrapFieldComponent(EmailField, 'input'),
  password: wrapFieldComponent(PasswordField, 'input'),
  textarea: wrapFieldComponent(TextAreaField, 'input'),
  date: wrapFieldComponent(DateField, 'input'),
  select: wrapFieldComponent(SelectField, 'input'),
  checkbox: wrapFieldComponent(CheckboxField, 'boolean'),
  switch: wrapFieldComponent(SwitchField, 'boolean'),
  radio: wrapFieldComponent(RadioField, 'radio'),
};

function FormValueObserver({
  control,
  config,
  onValuesChange,
}: {
  control: any;
  config: FormConfig;
  onValuesChange?: (values: Record<string, any>) => void;
}) {
  const watched = useWatch({ control }) as Record<string, any>;

  useEffect(() => {
    if (onValuesChange && watched) {
      onValuesChange(watched);
    }
  }, [watched, onValuesChange]);

  const visibleCount = useMemo(() => {
    return config.fields.filter((f) => getFieldState(f, watched ?? {}).visible)
      .length;
  }, [config.fields, watched]);

  return (
    <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/90 p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-teal-300">
          <Terminal className="h-3.5 w-3.5" />
          LIVE KERNEL STATE ({visibleCount}/{config.fields.length} visible)
        </span>
        <span>getFieldState(field, values)</span>
      </div>
      <pre className="max-h-32 overflow-auto font-mono text-[11px] leading-relaxed text-slate-300">
        {JSON.stringify(watched ?? {}, null, 2)}
      </pre>
    </div>
  );
}

export interface FormOSLiveRendererProps {
  config: FormConfig;
  onValuesChange?: (values: Record<string, any>) => void;
  onSubmitSuccess?: (values: Record<string, any>) => void;
}

function InnerFormOSRenderer({
  config,
  onValuesChange,
  onSubmitSuccess,
}: FormOSLiveRendererProps) {
  const form = useFormConfig(config);
  const [submittedPayload, setSubmittedPayload] = useState<Record<
    string,
    any
  > | null>(null);

  const handleValidSubmit = (data: Record<string, any>) => {
    setSubmittedPayload(data);
    onSubmitSuccess?.(data);
  };

  return (
    <FormFieldsProvider components={styledOSComponents}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleValidSubmit)}
          className="space-y-3"
          noValidate
        >
          {form.fields.map((field) => (
            <Field key={field.name} field={field} control={form.control} />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-teal-500/20 transition hover:brightness-110"
            >
              <CheckCircle2 className="h-4 w-4" />
              Validate & Commit Form State
            </button>

            <button
              type="button"
              onClick={() => {
                form.reset();
                setSubmittedPayload(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </button>
          </div>

          {submittedPayload && (
            <div className="rounded-xl border border-teal-500/40 bg-teal-950/25 p-3 text-xs text-teal-200">
              <div className="mb-1 flex items-center gap-1.5 font-mono font-semibold text-teal-300">
                <CheckCircle2 className="h-4 w-4" />
                Committed Payload Verified by @form-os/react
              </div>
              <pre className="overflow-x-auto font-mono text-[11px] text-teal-100">
                {JSON.stringify(submittedPayload, null, 2)}
              </pre>
            </div>
          )}

          <FormValueObserver
            control={form.control}
            config={config}
            onValuesChange={onValuesChange}
          />
        </form>
      </FormProvider>
    </FormFieldsProvider>
  );
}

export function FormOSLiveRenderer(props: FormOSLiveRendererProps) {
  const configSignature = useMemo(
    () =>
      props.config.fields
        .map((f) => `${f.name}:${f.type}:${String(f.defaultValue ?? '')}`)
        .join('|'),
    [props.config]
  );

  return <InnerFormOSRenderer key={configSignature} {...props} />;
}
