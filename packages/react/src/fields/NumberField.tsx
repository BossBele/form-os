import type { FieldComponentProps } from './types';

function getRuleValue(
  rule: number | string | { value: number | string; message: string } | undefined
): number | string | undefined {
  if (rule && typeof rule === 'object' && 'value' in rule) {
    return rule.value;
  }
  return rule;
}

export function NumberField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}: FieldComponentProps) {
  const { ref, ...field } = formField;
  return (
    <input
      ref={ref}
      {...field}
      type="number"
      readOnly={fieldState.readonly}
      min={getRuleValue(fieldConfig.rules?.min)}
      max={getRuleValue(fieldConfig.rules?.max)}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
