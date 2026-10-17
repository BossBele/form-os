import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PLAYGROUND_PRESETS } from '../lib/prompt-to-config';
import { validateFormConfigSchema } from '../lib/schema-validator';
import { FormOSLiveRenderer } from '../components/FormRenderer';
import {
  ComponentDock,
  DOCK_MODULES,
  createDockFieldConfig,
} from '../components/ComponentDock';
import {
  CockpitCanvas,
  BootSequenceBanner,
  BOOT_STORAGE_KEY,
  markBootCompletedInStorage,
  hasBootCompletedInStorage,
} from '../components/CockpitCanvas';
import { HeroPlayground } from '../components/HeroPlayground';

describe('Task 2: Interactive Hero, Live FormRenderer, 3D Cockpit & Component Dock', () => {
  it('renders live FormConfig using @form-os/react useFormConfig and Field, obeying getFieldState visibility', () => {
    const kycConfig = PLAYGROUND_PRESETS[0].config;
    const html = renderToString(<FormOSLiveRenderer config={kycConfig} />);

    // Default jurisdiction is EU: vatNumber should be visible, einNumber (US-only) should be hidden
    expect(html).toContain('Legal Entity Name');
    expect(html).toContain('EU VIES VAT Registration Number');
    expect(html).not.toContain('US IRS Employer Identification Number (EIN)');
  });

  it('exposes all 11 built-in @form-os/react/fields modules in ComponentDock and appends schema-valid FieldConfigs', () => {
    expect(DOCK_MODULES.length).toBe(11);
    const componentNames = DOCK_MODULES.map((m) => m.exportName);
    expect(componentNames).toEqual([
      'TextField',
      'NumberField',
      'EmailField',
      'PasswordField',
      'TextAreaField',
      'DateField',
      'SelectField',
      'CheckboxField',
      'RadioField',
      'SwitchField',
      'DefaultField',
    ]);

    for (const mod of DOCK_MODULES) {
      const newField = createDockFieldConfig(mod.type, 1);
      const check = validateFormConfigSchema({ fields: [newField] });
      expect(check.valid).toBe(true);
    }

    const dockHtml = renderToString(<ComponentDock onAddField={() => {}} />);
    expect(dockHtml).toContain('TextField');
    expect(dockHtml).toContain('SwitchField');
  });

  it('renders 3D CockpitCanvas and BootSequenceBanner with real config telemetry and non-WebGL safe fallback', () => {
    const kycConfig = PLAYGROUND_PRESETS[0].config;
    const cockpitHtml = renderToString(
      <CockpitCanvas
        config={kycConfig}
        values={{ jurisdiction: 'EU', isPep: false }}
      />
    );
    expect(cockpitHtml).toContain('entityLegalName');
    expect(cockpitHtml).toContain('vatNumber');

    const bootHtml = renderToString(
      <BootSequenceBanner
        config={kycConfig}
        active={true}
        onComplete={() => {}}
      />
    );
    expect(bootHtml).toContain('@form-os/core');
    expect(bootHtml).toContain('Skip Boot');
  });

  it('renders split-screen HeroPlayground with Plain-English prompt input, Developer View / Business View toggle, and live preview', () => {
    const kycConfig = PLAYGROUND_PRESETS[0].config;
    const html = renderToString(
      <HeroPlayground
        config={kycConfig}
        onConfigChange={() => {}}
        onValuesChange={() => {}}
        onEarnXp={() => {}}
      />
    );
    expect(html).toContain('Developer View');
    expect(html).toContain('Business View');
    expect(html).toContain('Describe a complex multi-step KYC onboarding form');
    expect(html).toContain('EU VIES VAT Registration Number');
  });

  it('persists boot sequence completion in storage and syncs external config mounts in HeroPlayground', () => {
    const fakeStore: Record<string, string> = {};
    const storage = {
      getItem: (k: string) => fakeStore[k] ?? null,
      setItem: (k: string, v: string) => {
        fakeStore[k] = v;
      },
    };
    expect(BOOT_STORAGE_KEY).toBe('form-os:booted');
    expect(hasBootCompletedInStorage(storage)).toBe(false);
    markBootCompletedInStorage(storage);
    expect(hasBootCompletedInStorage(storage)).toBe(true);

    const hipaaConfig = PLAYGROUND_PRESETS[1].config;
    const html = renderToString(
      <HeroPlayground
        config={hipaaConfig}
        onConfigChange={() => {}}
      />
    );
    expect(html).toContain('patientFullName');
    expect(html).toContain('guardianName');
  });
});
