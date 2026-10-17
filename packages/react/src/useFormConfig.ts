import { useMemo } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';
import {
  createDefaultValues,
  normalizeConfig,
  type FieldConfig,
  type FormConfig,
} from '@form-os/core';

export function useFormConfig<TFieldValues extends FieldValues = FieldValues>(
  config: FieldConfig[] | FormConfig
): UseFormReturn<TFieldValues> & { fields: FieldConfig[] } {
  const normalized = useMemo(() => normalizeConfig(config), [config]);

  const defaultValues = useMemo(
    () => createDefaultValues(normalized.fields),
    [normalized.fields]
  );

  const form = useForm<TFieldValues>({
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
    mode: normalized.validationMode,
    reValidateMode: normalized.reValidateMode,
  });

  return { ...form, fields: normalized.fields };
}
