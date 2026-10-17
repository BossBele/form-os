import type { FieldComponentProps } from './types';

export function RadioField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}: FieldComponentProps) {
  const { ref, onChange, onBlur, name, value } = formField;

  return (
    <div className={className} {...rest}>
      {fieldConfig.options?.map((opt) => (
        <label key={opt.value}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            onBlur={onBlur}
            ref={value === opt.value ? ref : undefined}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
