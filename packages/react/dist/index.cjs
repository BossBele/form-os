"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkK6XSKRGPcjs = require('./chunk-K6XSKRGP.cjs');

// src/useFormConfig.ts
var _react = require('react');


var _reacthookform = require('react-hook-form');



var _core = require('@form-os/core');
function useFormConfig(config) {
  const normalized = _react.useMemo.call(void 0, () => _core.normalizeConfig.call(void 0, config), [config]);
  const defaultValues = _react.useMemo.call(void 0, 
    () => _core.createDefaultValues.call(void 0, normalized.fields),
    [normalized.fields]
  );
  const form = _reacthookform.useForm.call(void 0, {
    defaultValues,
    mode: normalized.validationMode,
    reValidateMode: normalized.reValidateMode
  });
  return { ...form, fields: normalized.fields };
}

// src/index.ts










exports.Field = _chunkK6XSKRGPcjs.Field; exports.FormFieldsProvider = _chunkK6XSKRGPcjs.FormFieldsProvider; exports.FormProvider = _reacthookform.FormProvider; exports.useField = _chunkK6XSKRGPcjs.useField; exports.useFieldComponents = _chunkK6XSKRGPcjs.useFieldComponents; exports.useForm = _reacthookform.useForm; exports.useFormConfig = useFormConfig; exports.useFormContext = _reacthookform.useFormContext;
//# sourceMappingURL=index.cjs.map