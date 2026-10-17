import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MentalModel } from '../components/sections/MentalModel';

describe('Task 5: Mental model', () => {
  it('states the core idea plainly and names the four real pieces', () => {
    const html = renderToString(<MentalModel />);
    expect(html).toContain('A form is not markup');
    expect(html).toContain('FormConfig');
    expect(html).toContain('@form-os/core');
    expect(html).toContain('@form-os/react');
    expect(html).toContain('@form-os/schema');
  });

  it('describes the pipeline as a journey, not a machine', () => {
    const html = renderToString(<MentalModel />);
    expect(html.toLowerCase()).not.toMatch(/\bkernel\b|\bdaemon\b|\bprocess\b/);
  });
});
