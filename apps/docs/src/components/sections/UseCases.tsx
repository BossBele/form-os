'use client';

import React, { useMemo } from 'react';
import type { FormConfig } from '@form-os/core';
import {
  Field,
  FormFieldsProvider,
  FormProvider,
  useFormConfig,
} from '@form-os/react';
import { USE_CASES } from '../../lib/use-cases';
import { forestFieldComponents } from '../example/ExampleField';
import { ScrollReveal } from '../lightswind/scroll-reveal';
import { cn } from '../../lib/utils';

/** A live form with no submit button — these illustrate, they do not collect. */
function MiniForm({ config }: { config: FormConfig }) {
  const stableConfig = useMemo(() => config, [config]);
  const form = useFormConfig(stableConfig);

  return (
    <div className="min-w-0 rounded-2xl border border-forest-fern/25 bg-forest-moss/25 p-5">
      <FormFieldsProvider components={forestFieldComponents}>
        <FormProvider {...form}>
          <div className="min-w-0 space-y-3">
            {form.fields.map((field) => (
              <Field key={field.name} field={field} control={form.control} />
            ))}
          </div>
        </FormProvider>
      </FormFieldsProvider>
    </div>
  );
}

export function UseCases() {
  return (
    <section id="use-cases" className="relative px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-forest-mist">
            where it earns its keep
          </p>
          <ScrollReveal
            size="xl"
            align="left"
            threshold={0.15}
            textClassName="font-display tracking-[-0.02em] text-forest-moonlight"
          >
            Four places this pays for itself.
          </ScrollReveal>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-forest-mist">
            Each one below is a working form, not a screenshot. They are here to
            show the same small set of rules handling four very different jobs.
          </p>
        </header>

        <div className="mt-24 space-y-28">
          {USE_CASES.map((useCase, index) => (
            <div
              key={useCase.id}
              className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div
                className={cn('min-w-0', index % 2 === 1 && 'lg:order-2')}
              >
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-forest-marigold">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-tight tracking-[-0.01em] text-forest-moonlight">
                  {useCase.title}
                </h3>
                <p className="mt-5 max-w-xl break-words text-base leading-[1.75] text-forest-mist">
                  {useCase.outcome}
                </p>
              </div>

              <div
                className={cn('min-w-0', index % 2 === 1 && 'lg:order-1')}
              >
                <MiniForm config={useCase.config} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
