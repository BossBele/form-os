import type { FieldComponentProps } from './types';

export function SelectField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}: FieldComponentProps) {
  const { ref, ...field } = formField;
  const multiple = !!fieldConfig.props?.multiple;

  return (
    <select
      ref={ref}
      {...field}
      multiple={multiple}
      className={className}
      {...rest}
    >
      {fieldConfig.options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
