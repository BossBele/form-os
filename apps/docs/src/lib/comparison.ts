export type AlternativeName =
  | 'react-hook-form'
  | 'JSON Forms'
  | 'Hosted form builders';

export interface ComparisonRow {
  capability: string;
  formOs: string;
  alternative: string;
  alternativeName: AlternativeName;
}

export const COMPARISON_ROWS: ReadonlyArray<ComparisonRow> = [
  {
    capability: 'Where the form actually lives',
    formOs:
      'In a file. A description you can commit, review, diff, and hand to someone who does not write code.',
    alternative:
      'In the components you wrote by hand — which means the form only exists in one place, and only as long as that code survives.',
    alternativeName: 'react-hook-form',
  },
  {
    capability: 'Conditional behaviour',
    formOs:
      'Declared on the field. Show, hide, require, disable and lock are five lines of data, and rules of the same kind combine automatically.',
    alternative:
      'Written as watchers and ternaries inside the component. Perfectly workable, and rewritten from scratch every time a form is built.',
    alternativeName: 'react-hook-form',
  },
  {
    capability: 'What it is, underneath',
    formOs:
      'A superset. The React binding is built on top of react-hook-form, so every hook it gives you is still there, with the per-form wiring removed.',
    alternative:
      'The foundation itself. Excellent at what it does — form-os would not exist without it — but it deliberately leaves the shape of your form to you.',
    alternativeName: 'react-hook-form',
  },
  {
    capability: 'How much you own',
    formOs:
      'Everything. Components come from your design system, registered once in a provider, and the defaults are yours to replace or ignore.',
    alternative:
      'The renderer decides what your inputs look like, and changing that means working against it rather than with it.',
    alternativeName: 'JSON Forms',
  },
  {
    capability: 'What you send to the browser',
    formOs:
      'A dependency-free core that runs in a test, a worker, or a server, plus the fields you actually use.',
    alternative:
      'A renderer suite with its own component library, most of which a given form will never touch.',
    alternativeName: 'JSON Forms',
  },
  {
    capability: 'Who holds the keys',
    formOs:
      'You do. Forms are files in your repository, and responses land wherever you point them.',
    alternative:
      'The vendor does. Forms live in their editor, at their URLs, priced per response — and leaving means rebuilding every one of them.',
    alternativeName: 'Hosted form builders',
  },
];

export const ALTERNATIVE_NOTES: ReadonlyArray<{
  name: AlternativeName;
  note: string;
}> = [
  {
    name: 'react-hook-form',
    note: 'A dependency, not a competitor. form-os is built on top of it.',
  },
  {
    name: 'JSON Forms',
    note: 'Closest in spirit, and heavier in practice. The idea is right; the renderer gets in the way.',
  },
  {
    name: 'Hosted form builders',
    note: 'The fastest way to start and the hardest way to leave. Worth it for some teams, and worth knowing the trade.',
  },
];
