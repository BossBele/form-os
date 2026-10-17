import type { FieldComponentProps } from './types';

export function DateField({
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
      type="date"
      readOnly={fieldState.readonly}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
