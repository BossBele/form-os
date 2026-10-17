import {
  Field,
  FormFieldsProvider,
  useField,
  useFieldComponents
} from "./chunk-G74UGG7R.js";

// src/useFormConfig.ts
import { useMemo } from "react";
import {
  useForm
} from "react-hook-form";
import {
  createDefaultValues,
  normalizeConfig
} from "@form-os/core";
function useFormConfig(config) {
  const normalized = useMemo(() => normalizeConfig(config), [config]);
  const defaultValues = useMemo(
    () => createDefaultValues(normalized.fields),
    [normalized.fields]
  );
  const form = useForm({
    defaultValues,
    mode: normalized.validationMode,
    reValidateMode: normalized.reValidateMode
  });
  return { ...form, fields: normalized.fields };
}

// src/index.ts
import { FormProvider, useFormContext, useForm as useForm2 } from "react-hook-form";
export {
  Field,
  FormFieldsProvider,
  FormProvider,
  useField,
  useFieldComponents,
  useForm2 as useForm,
  useFormConfig,
  useFormContext
};
//# sourceMappingURL=index.js.map