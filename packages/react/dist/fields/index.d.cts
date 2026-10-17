import { FieldConfig, FieldState } from '@form-os/core';
import { ControllerRenderProps, FieldError, FieldValues } from 'react-hook-form';
import * as react from 'react';
import { F as FieldProps } from '../Field-5cPJnVTb.cjs';

interface FieldComponentProps {
    formField: ControllerRenderProps;
    fieldConfig: FieldConfig;
    fieldState: FieldState;
    error?: FieldError;
    className?: string;
    [key: string]: any;
}

declare function TextField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function NumberField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function EmailField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function PasswordField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function TextAreaField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function DateField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function SelectField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function CheckboxField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function RadioField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare function SwitchField({ formField, fieldConfig, fieldState, error, className, ...rest }: FieldComponentProps): react.JSX.Element;

declare const defaultComponents: {
    text: typeof TextField;
    number: typeof NumberField;
    email: typeof EmailField;
    password: typeof PasswordField;
    textarea: typeof TextAreaField;
    date: typeof DateField;
    select: typeof SelectField;
    checkbox: typeof CheckboxField;
    radio: typeof RadioField;
    switch: typeof SwitchField;
};

declare function DefaultField<TFieldValues extends FieldValues = FieldValues>({ field, control, component, ...rest }: FieldProps<TFieldValues>): react.JSX.Element;

export { CheckboxField, DateField, DefaultField, EmailField, type FieldComponentProps, NumberField, PasswordField, RadioField, SelectField, SwitchField, TextAreaField, TextField, defaultComponents };
