import {
  Field
} from "../chunk-G74UGG7R.js";

// src/fields/TextField.tsx
import { jsx } from "react/jsx-runtime";
function TextField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      ...field,
      type: "text",
      readOnly: fieldState.readonly,
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/NumberField.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function getRuleValue(rule) {
  if (rule && typeof rule === "object" && "value" in rule) {
    return rule.value;
  }
  return rule;
}
function NumberField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx2(
    "input",
    {
      ref,
      ...field,
      type: "number",
      readOnly: fieldState.readonly,
      min: getRuleValue(fieldConfig.rules?.min),
      max: getRuleValue(fieldConfig.rules?.max),
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/EmailField.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function EmailField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx3(
    "input",
    {
      ref,
      ...field,
      type: "email",
      readOnly: fieldState.readonly,
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/PasswordField.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function PasswordField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx4(
    "input",
    {
      ref,
      ...field,
      type: "password",
      readOnly: fieldState.readonly,
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/TextAreaField.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function TextAreaField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx5(
    "textarea",
    {
      ref,
      ...field,
      readOnly: fieldState.readonly,
      rows: fieldConfig.props?.rows ?? 3,
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/DateField.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function DateField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ jsx6(
    "input",
    {
      ref,
      ...field,
      type: "date",
      readOnly: fieldState.readonly,
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/SelectField.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function SelectField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  const multiple = !!fieldConfig.props?.multiple;
  return /* @__PURE__ */ jsx7(
    "select",
    {
      ref,
      ...field,
      multiple,
      className,
      ...rest,
      children: fieldConfig.options?.map((opt) => /* @__PURE__ */ jsx7("option", { value: opt.value, children: opt.label }, opt.value))
    }
  );
}

// src/fields/CheckboxField.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function CheckboxField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, value, ...field } = formField;
  return /* @__PURE__ */ jsx8(
    "input",
    {
      ref,
      type: "checkbox",
      checked: !!value,
      ...field,
      onChange: (e) => field.onChange(e.target.checked),
      className,
      ...rest
    }
  );
}

// src/fields/RadioField.tsx
import { jsx as jsx9, jsxs } from "react/jsx-runtime";
function RadioField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, onChange, onBlur, name, value } = formField;
  return /* @__PURE__ */ jsx9("div", { className, ...rest, children: fieldConfig.options?.map((opt) => /* @__PURE__ */ jsxs("label", { children: [
    /* @__PURE__ */ jsx9(
      "input",
      {
        type: "radio",
        name,
        value: opt.value,
        checked: value === opt.value,
        onChange: () => onChange(opt.value),
        onBlur,
        ref: value === opt.value ? ref : void 0
      }
    ),
    opt.label
  ] }, opt.value)) });
}

// src/fields/SwitchField.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function SwitchField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, value, ...field } = formField;
  return /* @__PURE__ */ jsx10(
    "input",
    {
      ref,
      type: "checkbox",
      role: "switch",
      checked: !!value,
      ...field,
      onChange: (e) => field.onChange(e.target.checked),
      className,
      ...rest
    }
  );
}

// src/fields/defaultComponents.ts
var defaultComponents = {
  text: TextField,
  number: NumberField,
  email: EmailField,
  password: PasswordField,
  textarea: TextAreaField,
  date: DateField,
  select: SelectField,
  checkbox: CheckboxField,
  radio: RadioField,
  switch: SwitchField
};

// src/fields/DefaultField.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function DefaultField({
  field,
  control,
  component,
  ...rest
}) {
  const components = defaultComponents;
  const resolved = component ?? components[field.type] ?? components["text"];
  return /* @__PURE__ */ jsx11(Field, { field, control, component: resolved, ...rest });
}
export {
  CheckboxField,
  DateField,
  DefaultField,
  EmailField,
  NumberField,
  PasswordField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  defaultComponents
};
//# sourceMappingURL=index.js.map