import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PLAYGROUND_PRESETS } from '../lib/prompt-to-config';
import { PricingEngine } from '../components/PricingEngine';
import { CommandShellModal } from '../components/CommandShellModal';
import { FormOSAppShell } from '../components/FormOSAppShell';
import { generateLlmsTxt } from '../lib/llms-txt';

describe('Task 5: $100M Offers Pricing Engine, Value Equation Machine, ⌘K Shell & Full App', () => {
  it('renders PricingEngine with Form-OS Scale, Form-OS Sovereign, Hormozi Value Equation Machine, Bonus Stack, and ROI Calculator', () => {
    const html = renderToString(<PricingEngine onEarnXp={() => {}} />);

    // Tiers
    expect(html).toContain('Form-OS Scale');
    expect(html).toContain('Form-OS Sovereign');
    expect(html).toContain('SOC2 Type II');
    expect(html).toContain('99.99%');
    expect(html).toContain('Salesforce, Snowflake, and SAP');
    expect(html).toContain('Done-For-You');
    expect(html).toContain('Typeform/Jotform');

    // Value Equation Machine levers
    expect(html).toContain('Dream Outcome');
    expect(html).toContain('Perceived Likelihood');
    expect(html).toContain('Time Delay');
    expect(html).toContain('Effort &amp; Sacrifice');

    // Engineering Hours Saved Calculator
    expect(html).toContain('Engineering Hours Saved');
  });

  it('renders ⌘K CommandShellModal with interactive kernel prompt', () => {
    const html = renderToString(
      <CommandShellModal
        open={true}
        onClose={() => {}}
        config={PLAYGROUND_PRESETS[0].config}
        values={{ jurisdiction: 'EU' }}
        xp={350}
        onAction={() => {}}
        onEarnXp={() => {}}
      />
    );
    expect(html).toContain('form-os kernel v1.0.0');
    expect(html).toContain('ls fields');
  });

  it('renders full FormOSAppShell with dark/light toggle, BossBele/formsjs GitHub links, and all sections', () => {
    const html = renderToString(<FormOSAppShell />);
    expect(html).toContain('Describe your form once. Run it anywhere.');
    expect(html).toContain('https://github.com/BossBele/formsjs');
    expect(html).toContain('Form-OS Scale');
    expect(html).toContain('Form-OS Sovereign');
    expect(html).toContain('WIRE IT');
  });

  it('generates comprehensive llms.txt documentation for AI tools', () => {
    const text = generateLlmsTxt();
    expect(text).toContain('# form-os (@form-os/core, @form-os/react, @form-os/schema)');
    expect(text).toContain('getFieldState(field, values)');
    expect(text).toContain('https://github.com/BossBele/formsjs');
  });
});
