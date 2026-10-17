"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/useField.ts
var _react = require('react');
var _reacthookform = require('react-hook-form');
var _core = require('@form-os/core');
function useField(field, control) {
  const values = _reacthookform.useWatch.call(void 0, { control });
  const state = _react.useMemo.call(void 0, 
    () => _core.getFieldState.call(void 0, field, _nullishCoalesce(values, () => ( {}))),
    [field, values]
  );
  const { field: f, fieldState } = _reacthookform.useController.call(void 0, {
    name: field.name,
    control,
    rules: _optionalChain([field, 'optionalAccess', _ => _.rules]),
    defaultValue: state.defaultValue,
    disabled: state.disabled
  });
  return { field: f, fieldState, state };
}

// src/FormFieldsContext.tsx

var _jsxruntime = require('react/jsx-runtime');
var FormFieldsContext = _react.createContext.call(void 0, {});
function FormFieldsProvider({ components, children }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FormFieldsContext.Provider, { value: components, children });
}
function useFieldComponents() {
  return _react.useContext.call(void 0, FormFieldsContext);
}

// src/Field.tsx

function Field({
  field,
  control,
  component,
  ...rest
}) {
  const contextComponents = useFieldComponents();
  const Component = _nullishCoalesce(_nullishCoalesce(component, () => ( contextComponents[field.type])), () => ( contextComponents["text"]));
  const { field: f, fieldState, state } = useField(field, control);
  if (!state.visible) {
    return null;
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    Component,
    {
      formField: f,
      fieldConfig: field,
      fieldState: state,
      error: fieldState.error,
      ...rest
    }
  );
}






exports.useField = useField; exports.FormFieldsProvider = FormFieldsProvider; exports.useFieldComponents = useFieldComponents; exports.Field = Field;
//# sourceMappingURL=chunk-K6XSKRGP.cjs.map