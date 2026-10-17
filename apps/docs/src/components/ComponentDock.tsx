'use client';

import React from 'react';
import type { FieldConfig } from '@form-os/core';
import {
  Type,
  Hash,
  Mail,
  KeyRound,
  AlignLeft,
  Calendar,
  ListFilter,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  Cpu,
  Plus,
} from 'lucide-react';

export interface DockModuleDescriptor {
  type: string;
  exportName: string;
  label: string;
  summary: string;
  defaultProps?: Partial<FieldConfig>;
}

export const DOCK_MODULES: DockModuleDescriptor[] = [
  {
    type: 'text',
    exportName: 'TextField',
    label: 'Text Input',
    summary: 'Single-line string input with readonly & pattern support',
  },
  {
    type: 'number',
    exportName: 'NumberField',
    label: 'Number Input',
    summary: 'Numeric input supporting min/max validation rules',
  },
  {
    type: 'email',
    exportName: 'EmailField',
    label: 'Email Input',
    summary: 'RFC email address input from @form-os/react/fields',
  },
  {
    type: 'password',
    exportName: 'PasswordField',
    label: 'Password Vault',
    summary: 'Masked secret / hardware token input component',
  },
  {
    type: 'textarea',
    exportName: 'TextAreaField',
    label: 'Multiline TextArea',
    summary: 'Long-form disclosure or compliance notes input',
  },
  {
    type: 'date',
    exportName: 'DateField',
    label: 'ISO Date Picker',
    summary: 'Native date selector with string default resolution',
  },
  {
    type: 'select',
    exportName: 'SelectField',
    label: 'Select Dropdown',
    summary: 'Single or multiple Choice[] dropdown selector',
  },
  {
    type: 'checkbox',
    exportName: 'CheckboxField',
    label: 'Boolean Checkbox',
    summary: 'Boolean consent toggle defaulting to false',
  },
  {
    type: 'radio',
    exportName: 'RadioField',
    label: 'Radio Group',
    summary: 'Mutually exclusive Choice[] option selector',
  },
  {
    type: 'switch',
    exportName: 'SwitchField',
    label: 'OS Switch Gate',
    summary: 'Role="switch" boolean gate ideal for dependency triggers',
  },
  {
    type: 'default',
    exportName: 'DefaultField',
    label: 'Universal DefaultField',
    summary: 'All-in-one dispatcher wrapping label, Field, and error output',
  },
];

export function createDockFieldConfig(
  moduleType: string,
  indexSuffix: number
): FieldConfig {
  const normalizedType = moduleType === 'default' ? 'text' : moduleType;
  const safeName = `${normalizedType}Field_${indexSuffix}`;

  if (normalizedType === 'select' || normalizedType === 'radio') {
    return {
      name: safeName,
      type: normalizedType,
      label: `Custom ${normalizedType.toUpperCase()} Module #${indexSuffix}`,
      defaultValue: 'tier_a',
      options: [
        { label: 'Option Alpha (tier_a)', value: 'tier_a' },
        { label: 'Option Beta (tier_b)', value: 'tier_b' },
      ],
    };
  }

  if (normalizedType === 'checkbox' || normalizedType === 'switch') {
    return {
      name: safeName,
      type: normalizedType,
      label: `Enable ${normalizedType.toUpperCase()} Gate #${indexSuffix}`,
      defaultValue: false,
    };
  }

  if (normalizedType === 'number') {
    return {
      name: safeName,
      type: 'number',
      label: `Threshold Metric #${indexSuffix}`,
      defaultValue: 100,
      rules: { min: 0, max: 100000 },
    };
  }

  if (normalizedType === 'date') {
    return {
      name: safeName,
      type: 'date',
      label: `Effective Date #${indexSuffix}`,
      defaultValue: '2026-10-17',
    };
  }

  return {
    name: safeName,
    type: normalizedType,
    label: `Docked ${normalizedType.toUpperCase()} Module #${indexSuffix}`,
    placeholder: `Enter ${normalizedType} value...`,
    defaultValue: '',
  };
}

function getModuleIcon(type: string) {
  switch (type) {
    case 'text':
      return <Type className="h-3.5 w-3.5 text-teal-300" />;
    case 'number':
      return <Hash className="h-3.5 w-3.5 text-amber-300" />;
    case 'email':
      return <Mail className="h-3.5 w-3.5 text-cyan-300" />;
    case 'password':
      return <KeyRound className="h-3.5 w-3.5 text-rose-300" />;
    case 'textarea':
      return <AlignLeft className="h-3.5 w-3.5 text-purple-300" />;
    case 'date':
      return <Calendar className="h-3.5 w-3.5 text-emerald-300" />;
    case 'select':
      return <ListFilter className="h-3.5 w-3.5 text-sky-300" />;
    case 'checkbox':
      return <CheckSquare className="h-3.5 w-3.5 text-teal-300" />;
    case 'radio':
      return <CircleDot className="h-3.5 w-3.5 text-amber-300" />;
    case 'switch':
      return <ToggleLeft className="h-3.5 w-3.5 text-teal-400" />;
    default:
      return <Cpu className="h-3.5 w-3.5 text-slate-300" />;
  }
}

export interface ComponentDockProps {
  onAddField: (field: FieldConfig) => void;
  existingFieldCount?: number;
}

export function ComponentDock({
  onAddField,
  existingFieldCount = 1,
}: ComponentDockProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-teal-300">
            @form-os/react/fields Hardware Dock (11 Tree-Shakeable Modules)
          </span>
          <p className="text-[11px] text-slate-400">
            Click or drag any physical module below to hot-swap its FieldConfig into the live OS image.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {DOCK_MODULES.map((mod, idx) => (
          <button
            key={mod.exportName}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', mod.type);
            }}
            onClick={() =>
              onAddField(createDockFieldConfig(mod.type, existingFieldCount + idx + 1))
            }
            className="group flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/70 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-teal-400/60 hover:bg-slate-900 hover:shadow-[0_0_20px_-8px_rgba(0,245,212,0.5)]"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-100">
                {getModuleIcon(mod.type)}
                {mod.exportName}
              </span>
              <Plus className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-teal-300" />
            </div>
            <span className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-slate-400">
              {mod.summary}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
