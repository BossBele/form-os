import type { FieldComponentProps } from './types';

export function PasswordField({
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
      type="password"
      readOnly={fieldState.readonly}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
