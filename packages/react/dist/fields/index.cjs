"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkK6XSKRGPcjs = require('../chunk-K6XSKRGP.cjs');

// src/fields/TextField.tsx
var _jsxruntime = require('react/jsx-runtime');
function TextField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "input",
    {
      ref,
      ...field,
      type: "number",
      readOnly: fieldState.readonly,
      min: getRuleValue(_optionalChain([fieldConfig, 'access', _ => _.rules, 'optionalAccess', _2 => _2.min])),
      max: getRuleValue(_optionalChain([fieldConfig, 'access', _3 => _3.rules, 'optionalAccess', _4 => _4.max])),
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/EmailField.tsx

function EmailField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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

function PasswordField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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

function TextAreaField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "textarea",
    {
      ref,
      ...field,
      readOnly: fieldState.readonly,
      rows: _nullishCoalesce(_optionalChain([fieldConfig, 'access', _5 => _5.props, 'optionalAccess', _6 => _6.rows]), () => ( 3)),
      placeholder: fieldConfig.placeholder,
      className,
      ...rest
    }
  );
}

// src/fields/DateField.tsx

function DateField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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

function SelectField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, ...field } = formField;
  const multiple = !!_optionalChain([fieldConfig, 'access', _7 => _7.props, 'optionalAccess', _8 => _8.multiple]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "select",
    {
      ref,
      ...field,
      multiple,
      className,
      ...rest,
      children: _optionalChain([fieldConfig, 'access', _9 => _9.options, 'optionalAccess', _10 => _10.map, 'call', _11 => _11((opt) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "option", { value: opt.value, children: opt.label }, opt.value))])
    }
  );
}

// src/fields/CheckboxField.tsx

function CheckboxField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, value, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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

function RadioField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, onChange, onBlur, name, value } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className, ...rest, children: _optionalChain([fieldConfig, 'access', _12 => _12.options, 'optionalAccess', _13 => _13.map, 'call', _14 => _14((opt) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "label", { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
  ] }, opt.value))]) });
}

// src/fields/SwitchField.tsx

function SwitchField({
  formField,
  fieldConfig,
  fieldState,
  error,
  className,
  ...rest
}) {
  const { ref, value, ...field } = formField;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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

function DefaultField({
  field,
  control,
  component,
  ...rest
}) {
  const components = defaultComponents;
  const resolved = _nullishCoalesce(_nullishCoalesce(component, () => ( components[field.type])), () => ( components["text"]));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkK6XSKRGPcjs.Field, { field, control, component: resolved, ...rest });
}













exports.CheckboxField = CheckboxField; exports.DateField = DateField; exports.DefaultField = DefaultField; exports.EmailField = EmailField; exports.NumberField = NumberField; exports.PasswordField = PasswordField; exports.RadioField = RadioField; exports.SelectField = SelectField; exports.SwitchField = SwitchField; exports.TextAreaField = TextAreaField; exports.TextField = TextField; exports.defaultComponents = defaultComponents;
//# sourceMappingURL=index.cjs.map