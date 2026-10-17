export type PricingTierId = 'open-source' | 'scale' | 'sovereign';

export interface PricingTier {
  id: PricingTierId;
  name: string;
  price: string;
  cadence: string;
  audience: string;
  dream: string;
  likelihood: string;
  timeDelay: string;
  effort: string;
  features: string[];
  guarantee: string;
}

export const PRICING_TIERS: ReadonlyArray<PricingTier> = [
  {
    id: 'open-source',
    name: 'form-os',
    price: '$0',
    cadence: 'MIT, forever',
    audience: 'Anyone building a form',
    dream:
      'Every form your product will ever need, described once and owned outright — with nothing between you and your users.',
    likelihood:
      'The dependency engine, the React bindings and the schema are the same code the paid tiers run. There is no crippled edition.',
    timeDelay:
      'Installed in about fifteen seconds. A form with real conditional logic in about five minutes.',
    effort:
      'One file per form instead of a few hundred lines of per-form wiring, and no hosted account to keep alive.',
    features: [
      '@form-os/core — the dependency engine and validation rules, with no dependencies of its own',
      '@form-os/react — useFormConfig, Field, useField, and eleven components you can replace one at a time',
      '@form-os/schema — a published JSON Schema so forms can be stored, served, or generated',
      'Full TypeScript support, including your own field types',
      'Community support on GitHub, at github.com/BossBele/formsjs',
    ],
    guarantee:
      'Nothing to guarantee. It is MIT licensed, it will stay MIT licensed, and it will never be taken away or moved behind a paywall.',
  },
  {
    id: 'scale',
    name: 'Form-OS Scale',
    price: '$349',
    cadence: 'per month',
    audience: 'Growth teams shipping forms every week',
    dream:
      'Forms that stay fast and stay finished — no backend to build, no analytics to bolt on, no config left unchecked.',
    likelihood:
      'Hosted infrastructure audited to SOC 2 Type II, a 99.99 per cent uptime commitment, and the same core primitives everyone else runs.',
    timeDelay:
      'Install as usual, then point your forms at a hosted endpoint. No schema migrations to write when the config changes.',
    effort:
      'The plumbing you would otherwise build yourself: submission handling, drop-off analytics, spam protection, and a visual editor your product managers can use without a deploy.',
    features: [
      'Everything in the MIT package, plus hosted submission endpoints',
      'SOC 2 Type II certified handling and a 99.99 per cent uptime commitment',
      'Per-field drop-off and completion analytics',
      'A visual editor that writes the same configuration file your engineers read',
      'Edge spam and bot protection with signed webhook delivery',
    ],
    guarantee:
      'Fourteen days to decide. If Scale does not remove more work than it adds, we refund the period in full and you keep the open-source package.',
  },
  {
    id: 'sovereign',
    name: 'Form-OS Sovereign',
    price: '$2,450',
    cadence: 'per month, annual',
    audience: 'Regulated and enterprise teams',
    dream:
      'Compliant, white-labelled form infrastructure that runs where your regulators require it to run, and answers to nobody else.',
    likelihood:
      'A named migration engineer assigned within two hours, connectors for Salesforce, Snowflake and SAP deployed within forty-eight hours, and a signed agreement that says so.',
    timeDelay:
      'Two hours to a named engineer. Forty-eight hours to production. Your existing forms are rewritten for you in between.',
    effort:
      'Almost none. We convert your legacy forms, deploy the infrastructure, and stay on the call until it is live.',
    features: [
      'Self-hosted, air-gapped deployment with the data residency your regulator asks for',
      'A named migration engineer, assigned within two hours of kick-off',
      'Bi-directional Salesforce, Snowflake and SAP connectors, live within forty-eight hours',
      'A private field-component registry, plus SAML and SCIM for your directory',
      'Per-field cryptographic audit trail, a HIPAA business associate agreement, and a GDPR data processing agreement',
    ],
    guarantee:
      'Done-for-you migration: our engineers rewrite your existing Typeform, Jotform or hand-rolled forms into form-os configurations at no charge, and if you are not in production within forty-eight hours your first ninety days are free.',
  },
];
