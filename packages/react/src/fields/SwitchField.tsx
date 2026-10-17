import type { FieldComponentProps } from './types';

export function SwitchField({
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
      role="switch"
      checked={!!value}
      {...field}
      onChange={(e) => field.onChange(e.target.checked)}
      className={className}
      {...rest}
    />
  );
}
