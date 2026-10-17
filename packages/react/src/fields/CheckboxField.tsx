import type { FieldComponentProps } from './types';

export function CheckboxField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}: FieldComponentProps) {
  const { ref, value, ...field } = formField;
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!value}
      {...field}
      onChange={(e) => field.onChange(e.target.checked)}
      className={className}
      {...rest}
    />
  );
}
