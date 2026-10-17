import type { FieldComponentProps } from './types';

export function TextField({
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
      type="text"
      readOnly={fieldState.readonly}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
