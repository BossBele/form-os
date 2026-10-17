import { useMemo } from 'react';
import { useController, useWatch } from 'react-hook-form';
import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { getFieldState, type FieldConfig } from '@form-os/core';

export function useField<TFieldValues extends FieldValues = FieldValues>(
  field: FieldConfig,
  control: Control<TFieldValues>
) {
  const values = useWatch({ control }) as Record<string, any>;

  const state = useMemo(
    () => getFieldState(field, values ?? {}),
    [field, values]
  );

  const { field: f, fieldState } = useController<TFieldValues>({
    name: field.name as FieldPath<TFieldValues>,
    control,
    rules: (field?.rules) as RegisterOptions<TFieldValues> | undefined,
    defaultValue: state.defaultValue,
    disabled: state.disabled,
  });

  return { field: f, fieldState, state };
}
