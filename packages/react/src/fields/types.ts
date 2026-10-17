import type { FieldConfig, FieldState } from '@form-os/core';
import type { ControllerRenderProps, FieldError } from 'react-hook-form';

export interface FieldComponentProps {
  formField: ControllerRenderProps;
  fieldConfig: FieldConfig;
  fieldState: FieldState;
  error?: FieldError;
  className?: string;
  [key: string]: any;
}
