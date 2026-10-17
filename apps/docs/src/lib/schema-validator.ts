import { schema } from '@form-os/schema';
import type { FormConfig } from '@form-os/core';

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  fieldCount: number;
  dependencyCount: number;
  schemaId: string;
}

const VALID_DEPENDENCY_TYPES = new Set<string>(
  schema.$defs.Dependency.properties.type.enum
);
const VALID_VALIDATION_MODES = new Set<string>(
  schema.properties.validationMode.enum
);
const VALID_REVALIDATE_MODES = new Set<string>(
  schema.properties.reValidateMode.enum
);
const ALLOWED_FIELD_KEYS = new Set<string>(
  Object.keys(schema.$defs.FieldConfig.properties)
);
const ALLOWED_RULE_KEYS = new Set<string>(
  Object.keys(schema.$defs.ValidationRules.properties)
);

export function validateFormConfigSchema(input: unknown): SchemaValidationResult {
  const errors: string[] = [];
  let fieldCount = 0;
  let dependencyCount = 0;

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      valid: false,
      errors: ['Root config must be a JSON object matching FormConfig.'],
      fieldCount: 0,
      dependencyCount: 0,
      schemaId: schema.$id,
    };
  }

  const cfg = input as Record<string, unknown>;

  if (cfg.validationMode !== undefined) {
    if (typeof cfg.validationMode !== 'string' || !VALID_VALIDATION_MODES.has(cfg.validationMode)) {
      errors.push(
        `validationMode must be one of: ${Array.from(VALID_VALIDATION_MODES).join(', ')}`
      );
    }
  }

  if (cfg.reValidateMode !== undefined) {
    if (typeof cfg.reValidateMode !== 'string' || !VALID_REVALIDATE_MODES.has(cfg.reValidateMode)) {
      errors.push(
        `reValidateMode must be one of: ${Array.from(VALID_REVALIDATE_MODES).join(', ')}`
      );
    }
  }

  if (!Array.isArray(cfg.fields)) {
    errors.push('Missing required property "fields" (must be an array of FieldConfig).');
    return {
      valid: false,
      errors,
      fieldCount: 0,
      dependencyCount: 0,
      schemaId: schema.$id,
    };
  }

  fieldCount = cfg.fields.length;
  const seenNames = new Set<string>();

  cfg.fields.forEach((rawField, idx) => {
    const prefix = `fields[${idx}]`;
    if (!rawField || typeof rawField !== 'object' || Array.isArray(rawField)) {
      errors.push(`${prefix} must be an object.`);
      return;
    }

    const field = rawField as Record<string, unknown>;

    for (const key of Object.keys(field)) {
      if (!ALLOWED_FIELD_KEYS.has(key)) {
        errors.push(`${prefix}.${key} is not allowed by additionalProperties: false.`);
      }
    }

    if (typeof field.name !== 'string' || field.name.trim().length === 0) {
      errors.push(`${prefix}.name is required and must be a non-empty string.`);
    } else if (seenNames.has(field.name)) {
      errors.push(`${prefix}.name "${field.name}" is duplicated.`);
    } else {
      seenNames.add(field.name);
    }

    if (typeof field.type !== 'string' || field.type.trim().length === 0) {
      errors.push(`${prefix}.type is required and must be a non-empty string.`);
    }

    if (field.dependencies !== undefined) {
      if (!Array.isArray(field.dependencies)) {
        errors.push(`${prefix}.dependencies must be an array.`);
      } else {
        field.dependencies.forEach((rawDep, depIdx) => {
          dependencyCount += 1;
          const depPrefix = `${prefix}.dependencies[${depIdx}]`;
          if (!rawDep || typeof rawDep !== 'object') {
            errors.push(`${depPrefix} must be an object.`);
            return;
          }
          const dep = rawDep as Record<string, unknown>;
          if (typeof dep.name !== 'string' || dep.name.length === 0) {
            errors.push(`${depPrefix}.name must be a non-empty string.`);
          }
          if (!('value' in dep)) {
            errors.push(`${depPrefix}.value is required.`);
          }
          if (typeof dep.type !== 'string' || !VALID_DEPENDENCY_TYPES.has(dep.type)) {
            errors.push(
              `${depPrefix}.type must be one of: ${Array.from(VALID_DEPENDENCY_TYPES).join(', ')}`
            );
          }
        });
      }
    }

    if (field.options !== undefined) {
      if (!Array.isArray(field.options)) {
        errors.push(`${prefix}.options must be an array of { label, value }.`);
      } else {
        field.options.forEach((opt, optIdx) => {
          if (
            !opt ||
            typeof opt !== 'object' ||
            typeof (opt as Record<string, unknown>).label !== 'string' ||
            typeof (opt as Record<string, unknown>).value !== 'string'
          ) {
            errors.push(`${prefix}.options[${optIdx}] must have string label and value.`);
          }
        });
      }
    }

    if (field.rules !== undefined) {
      if (!field.rules || typeof field.rules !== 'object' || Array.isArray(field.rules)) {
        errors.push(`${prefix}.rules must be an object.`);
      } else {
        for (const rKey of Object.keys(field.rules as Record<string, unknown>)) {
          if (!ALLOWED_RULE_KEYS.has(rKey)) {
            errors.push(`${prefix}.rules.${rKey} is not a recognized ValidationRules key.`);
          }
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    fieldCount,
    dependencyCount,
    schemaId: schema.$id,
  };
}

export function assertValidFormConfig(config: FormConfig): FormConfig {
  const res = validateFormConfigSchema(config);
  if (!res.valid) {
    throw new Error(`Invalid FormConfig: ${res.errors.join('; ')}`);
  }
  return config;
}
