import type { FieldComponentProps } from './types';

export function TextAreaField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}: FieldComponentProps) {
  const { ref, ...field } = formField;
  return (
    <textarea
      ref={ref}
      {...field}
      readOnly={fieldState.readonly}
      rows={fieldConfig.props?.rows ?? 3}
      placeholder={fieldConfig.placeholder}
      className={className}
      {...rest}
    />
  );
}
