'use client';

import React, { useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import {
  Field,
  FormFieldsProvider,
  FormProvider,
  useFormConfig,
} from '@form-os/react';
import { EXAMPLE_CONFIG, EXAMPLE_TOGGLES } from '../../lib/example-config';
import { forestFieldComponents } from './ExampleField';
import { ConfigPane } from './ConfigPane';
import { cn } from '../../lib/utils';

export function FormOSExample() {
  const config = useMemo(() => EXAMPLE_CONFIG, []);
  const form = useFormConfig(config);
  const values = useWatch({ control: form.control }) as Record<string, any>;
  const [committed, setCommitted] = useState<Record<string, any> | null>(null);

  const setSource = (name: string, next: unknown) => {
    form.setValue(name, next as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <section
      id="live-example"
      data-form-os-example
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            the whole idea, in one form
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-forest-moonlight">
            Change the rules. Watch the form follow.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-forest-mist">
            This is a real form running on the real library, in your browser,
            right now. Nothing here is a screenshot. Flip a switch on the left
            and the fields below rearrange themselves — because the rules live
            in the configuration, not in the markup.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0 space-y-10">
            <div className="min-w-0">
              <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-forest-mist">
                change something
              </h3>
              <div className="mt-5 space-y-4">
                {EXAMPLE_TOGGLES.map((toggle) => {
                  const field = EXAMPLE_CONFIG.fields.find(
                    (candidate) => candidate.name === toggle.name
                  )!;
                  const current = values?.[toggle.name] ?? field.defaultValue;
                  const isSwitch = field.type === 'switch';

                  return (
                    <div
                      key={toggle.name}
                      className="min-w-0 rounded-xl border border-forest-fern/20 bg-forest-moss/25 p-4"
                    >
                      {isSwitch ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(current)}
                          onClick={() => setSource(toggle.name, !current)}
                          className="flex min-w-0 items-center gap-3 text-left text-sm font-medium text-forest-moonlight"
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
                              current ? 'bg-forest-marigold' : 'bg-forest-fern/40'
                            )}
                          >
                            <span
                              className={cn(
                                'absolute top-0.5 h-4 w-4 rounded-full bg-forest-bark transition-all',
                                current ? 'left-[1.15rem]' : 'left-0.5'
                              )}
                            />
                          </span>
                          {toggle.label}
                        </button>
                      ) : (
                        <label className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-sm font-medium text-forest-moonlight">
                          {toggle.label}
                          <select
                            value={String(current)}
                            onChange={(event) =>
                              setSource(toggle.name, event.target.value)
                            }
                            className="min-w-0 rounded-lg border border-forest-fern/35 bg-forest-bark/70 px-3 py-1.5 font-mono text-xs text-forest-moonlight focus:border-forest-marigold focus:outline-none"
                          >
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <p className="mt-2 min-w-0 break-words text-xs leading-relaxed text-forest-mist">
                        {toggle.hint}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <FormFieldsProvider components={forestFieldComponents}>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    setCommitted(data as Record<string, any>)
                  )}
                  noValidate
                  className="min-w-0 space-y-3"
                >
                  {form.fields.map((field) => (
                    <Field key={field.name} field={field} control={form.control} />
                  ))}

                  <button
                    type="submit"
                    className="mt-2 rounded-full bg-forest-ember px-6 py-3 text-sm font-semibold text-forest-bark transition hover:bg-forest-marigold"
                  >
                    Check the form
                  </button>
                </form>
              </FormProvider>
            </FormFieldsProvider>

            {committed && (
              <div className="min-w-0 rounded-xl border border-forest-fern/30 bg-forest-moss/30 p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-forest-marigold">
                  accepted, and here is what the form handed back
                </p>
                <pre className="mt-3 overflow-x-auto font-mono text-[0.72rem] text-forest-mist">
                  {JSON.stringify(committed, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ConfigPane config={config} />
            <p className="mt-4 min-w-0 break-words text-xs leading-relaxed text-forest-mist">
              Ten fields, five kinds of conditional rule, and no per-form
              JavaScript written by hand. The file on the right is the entire
              form.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
