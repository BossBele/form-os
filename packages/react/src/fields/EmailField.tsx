import type { FieldComponentProps } from './types';

export function EmailField({
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
      type="email"
      readOnly={fieldState.readonly}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
