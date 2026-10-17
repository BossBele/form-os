import { getFieldState, type FormConfig } from '@form-os/core';
import { validateFormConfigSchema } from './schema-validator';
import { PLAYGROUND_PRESETS } from './prompt-to-config';

export interface ShellContext {
  config: FormConfig;
  values: Record<string, any>;
  xp: number;
}

export type ShellAction =
  | { type: 'BOOT_SEQUENCE' }
  | { type: 'MOUNT_PRESET'; presetId: string }
  | { type: 'SCROLL_SECTION'; sectionId: string }
  | { type: 'SET_THEME'; theme: 'dark' | 'light' }
  | { type: 'KERNEL_PANIC' }
  | { type: 'CLEAR_TERMINAL' };

export interface ShellExecutionResult {
  lines: string[];
  action?: ShellAction;
  xpDelta?: number;
}

export function executeShellCommand(
  rawInput: string,
  context: ShellContext
): ShellExecutionResult {
  const trimmed = rawInput.trim();
  const [cmd = '', ...args] = trimmed.split(/\s+/);
  const command = cmd.toLowerCase();

  switch (command) {
    case 'help':
      return {
        lines: [
          'form-os kernel v1.0.0 — available system calls:',
          '  boot                  Replay the 3D OS kernel boot sequence',
          '  ls fields             List mounted FieldConfig nodes & live getFieldState()',
          '  inspect <fieldName>   Inspect a field node, rules, and dependency gates',
          '  mount <preset>        Mount image: kyc | hipaa | treasury | saas-lead | ai-agent',
          '  schema                Validate active FormConfig against @form-os/schema ABI',
          '  wire                  Jump to the "Wire It" dependency puzzle arena',
          '  theme <dark|light>    Switch OS display compositor mode',
          '  xp                    Show Form Engineer rank & earned XP',
          '  panic                 Trigger 0xF04M_OS kernel panic & recovery mini-game',
          '  clear                 Clear kernel ring buffer',
        ],
      };

    case 'clear':
      return {
        lines: [],
        action: { type: 'CLEAR_TERMINAL' },
      };

    case 'boot':
      return {
        lines: [
          '[0.0001s] Reading FormConfig disk image...',
          '[0.0014s] @form-os/core normalizeConfig() -> OK',
          '[0.0028s] @form-os/react runtime mounted.',
        ],
        action: { type: 'BOOT_SEQUENCE' },
        xpDelta: 50,
      };

    case 'ls': {
      const target = (args[0] ?? 'fields').toLowerCase();
      if (target === 'presets') {
        return {
          lines: PLAYGROUND_PRESETS.map(
            (p) => `  ${p.id.padEnd(12)} [${p.badge}] — ${p.title}`
          ),
        };
      }
      const lines = [
        `MOUNTED IMAGE: ${context.config.fields.length} field nodes (mode=${context.config.validationMode ?? 'onTouched'})`,
      ];
      for (const f of context.config.fields) {
        const state = getFieldState(f, context.values);
        const flags = [
          state.visible ? 'VIS' : 'HID',
          state.required ? 'REQ' : 'OPT',
          state.disabled ? 'DIS' : 'ENA',
          state.readonly ? 'R/O' : 'R/W',
        ].join('|');
        lines.push(
          `  • ${f.name.padEnd(24)} (${f.type.padEnd(8)}) [${flags}] deps=${f.dependencies?.length ?? 0}`
        );
      }
      return { lines, xpDelta: 25 };
    }

    case 'inspect': {
      const fieldName = args[0];
      if (!fieldName) {
        return { lines: ['Usage: inspect <fieldName> (try: inspect vatNumber)'] };
      }
      const field = context.config.fields.find((f) => f.name === fieldName);
      if (!field) {
        return {
          lines: [
            `ENOENT: Field "${fieldName}" not found in mounted FormConfig.`,
            `Available: ${context.config.fields.map((f) => f.name).join(', ')}`,
          ],
        };
      }
      const state = getFieldState(field, context.values);
      return {
        lines: [
          `NODE: ${field.name} (type: ${field.type})`,
          `  visible: ${state.visible}`,
          `  required: ${state.required}`,
          `  disabled: ${state.disabled}`,
          `  readonly: ${state.readonly}`,
          `  defaultValue: ${JSON.stringify(state.defaultValue)}`,
          `  liveValue: ${JSON.stringify(context.values[field.name])}`,
          `  dependencies: ${JSON.stringify(field.dependencies ?? [])}`,
        ],
        xpDelta: 35,
      };
    }

    case 'mount': {
      const presetId = (args[0] ?? '').toLowerCase();
      const preset = PLAYGROUND_PRESETS.find((p) => p.id === presetId);
      if (!preset) {
        return {
          lines: [
            `Unknown image "${presetId}". Available images: ${PLAYGROUND_PRESETS.map((p) => p.id).join(', ')}`,
          ],
        };
      }
      return {
        lines: [
          `Mounting FormConfig image "${preset.id}" (${preset.title})...`,
          `Normalized ${preset.config.fields.length} fields via @form-os/core.`,
        ],
        action: { type: 'MOUNT_PRESET', presetId: preset.id },
        xpDelta: 60,
      };
    }

    case 'schema': {
      const check = validateFormConfigSchema(context.config);
      return {
        lines: [
          `ABI Validation against ${check.schemaId}:`,
          `  Status:       ${check.valid ? 'VALID (0 errors)' : 'INVALID'}`,
          `  Fields:       ${check.fieldCount}`,
          `  Dependencies: ${check.dependencyCount}`,
          ...check.errors.map((e) => `  ! ${e}`),
        ],
        xpDelta: 30,
      };
    }

    case 'wire':
      return {
        lines: ['Routing to "Wire It" Dependency Engine Arena...'],
        action: { type: 'SCROLL_SECTION', sectionId: 'wire-it-game' },
        xpDelta: 40,
      };

    case 'theme': {
      const mode = args[0]?.toLowerCase() === 'light' ? 'light' : 'dark';
      return {
        lines: [`Switching display compositor to ${mode.toUpperCase()} mode...`],
        action: { type: 'SET_THEME', theme: mode },
      };
    }

    case 'xp':
      return {
        lines: [
          `Form Engineer Telemetry: ${context.xp} XP`,
          `Rank: ${context.xp >= 500 ? 'Principal Kernel Architect' : context.xp >= 250 ? 'Systems Form Engineer' : 'Runtime Explorer'}`,
        ],
      };

    case 'panic':
      return {
        lines: [
          'KERNEL PANIC — fatal exception 0xF04M_OS in getFieldState() ring 0!',
          'Booting emergency packet-recovery mini-game...',
        ],
        action: { type: 'KERNEL_PANIC' },
        xpDelta: 200,
      };

    default:
      return {
        lines: [
          `form-os: command not found: "${command}". Type "help" for available kernel commands.`,
        ],
      };
  }
}
