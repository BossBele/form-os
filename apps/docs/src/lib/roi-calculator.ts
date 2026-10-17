export type PricingTierId = 'open-source' | 'scale' | 'sovereign';

export interface PricingTier {
  id: PricingTierId;
  name: string;
  magicSubtitle: string;
  targetAudience: string;
  priceLabel: string;
  billingCadence: string;
  badge?: string;
  dreamOutcome: string;
  perceivedLikelihood: string;
  timeDelayAndEffort: string;
  effortAndSacrifice: string;
  valueEquationGauges: {
    dreamOutcome: number; // 0-100
    perceivedLikelihood: number; // 0-100
    timeDelayDays: number; // lower is better
    effortScore: number; // 1-100, lower is better
  };
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
}

export interface BonusItem {
  id: string;
  title: string;
  problemSolved: string;
  description: string;
  anchoredValueUsd: number;
  includedIn: PricingTierId[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'open-source',
    name: 'Form-OS Kernel (MIT)',
    magicSubtitle: 'The Forever-Free Open-Source Standard',
    targetAudience: 'Individual Builders & Open-Source Teams',
    priceLabel: '$0',
    billingCadence: 'MIT Licensed Forever — Zero Lock-In',
    dreamOutcome:
      'Every form your app needs — described once as a declarative FormConfig, owned forever in your repo.',
    perceivedLikelihood:
      '100% deterministic unit-tested @form-os/core dependency engine, @form-os/react bindings, and @form-os/schema JSON Schema.',
    timeDelayAndEffort:
      'Install via pnpm in 15 seconds; render your first multi-dependency form in under 5 minutes.',
    effortAndSacrifice:
      'Write one JSON/TS config instead of 400 lines of bespoke state-machine spaghetti.',
    valueEquationGauges: {
      dreamOutcome: 85,
      perceivedLikelihood: 88,
      timeDelayDays: 1,
      effortScore: 22,
    },
    features: [
      '@form-os/core — dependency-free kernel (normalizeConfig, getFieldState, createFieldRegistry)',
      '@form-os/react — useFormConfig, Field, useField, FormFieldsProvider + 11 tree-shakeable field components',
      '@form-os/schema — portable Draft-07 JSON Schema ABI for CMS, API, and LLM form generation',
      'Full TypeScript module augmentation for custom FieldTypeMap components',
      'Community GitHub Discussions & issue tracker (BossBele/formsjs)',
    ],
    ctaLabel: 'pnpm add @form-os/core @form-os/react',
    ctaHref: '#docs-hub',
  },
  {
    id: 'scale',
    name: 'Form-OS Scale',
    magicSubtitle: 'High-Velocity Cloud Runtime for Growth Teams',
    targetAudience: 'Growth Teams & Scaling Product Orgs',
    priceLabel: '$349',
    billingCadence: 'per month · includes 250k form boots + unlimited configs',
    badge: 'MOST ADOPTED BY SERIES A–C',
    highlighted: true,
    dreamOutcome:
      'Lightning-fast dynamic form experiences with zero UI bloat across every product surface.',
    perceivedLikelihood:
      'SOC2 Type II certified cloud infrastructure, 99.99% uptime SLA, and battle-tested core primitives.',
    timeDelayAndEffort:
      'Instant NPM installation, zero-config default validations, and automated schema migrations.',
    effortAndSacrifice:
      'Zero backend plumbing: hosted submission endpoints, field-level drop-off telemetry, and visual config studio for PMs.',
    valueEquationGauges: {
      dreamOutcome: 95,
      perceivedLikelihood: 96,
      timeDelayDays: 0.5,
      effortScore: 8,
    },
    features: [
      'Everything in Open-Source MIT Kernel + Hosted Form-OS Cloud Studio',
      'SOC2 Type II certified submission vault & 99.99% uptime SLA',
      'Zero-config default validations & automated @form-os/schema version migrations',
      'Per-field conversion & dependency drop-off analytics heatmap',
      'AI Prompt-to-FormConfig Co-Pilot with schema guardrails for PMs & marketers',
      ' Edge spam/bot shield + signed webhook replay queue',
    ],
    ctaLabel: 'Start 14-Day Scale Pilot',
    ctaHref: '#playground-cockpit',
  },
  {
    id: 'sovereign',
    name: 'Form-OS Sovereign',
    magicSubtitle: 'Air-Gapped & Done-For-You Enterprise Infrastructure',
    targetAudience: 'Enterprise & Regulated Industries (FinTech, Health, Gov)',
    priceLabel: '$2,450',
    billingCadence: 'per month · annual agreement · 30-day risk-free evaluation',
    badge: '$100M GRAND SLAM OFFER',
    dreamOutcome:
      'Fully compliant, white-labeled, air-gapped form infrastructure with custom data residency.',
    perceivedLikelihood:
      'Dedicated enterprise migration engineer assigned within 2 hours, custom connectors for Salesforce, Snowflake, and SAP, deployed in under 48 hours.',
    timeDelayAndEffort:
      'Assigned Principal Engineer in < 2 hours; full production deployment in under 48 hours.',
    effortAndSacrifice:
      '"Done-For-You" Migration Guarantee — our engineers rewrite your legacy Typeform/Jotform schemas into form-os free of charge. Risk-free 30-day evaluation.',
    valueEquationGauges: {
      dreamOutcome: 100,
      perceivedLikelihood: 99,
      timeDelayDays: 0.1,
      effortScore: 2,
    },
    features: [
      'Air-gapped self-hosted Docker/Kubernetes control plane + custom regional data residency (EU/US-Gov/APAC)',
      'Dedicated Enterprise Migration Engineer assigned within 2 hours of kickoff',
      'Native bi-directional connectors for Salesforce, Snowflake, and SAP deployed in under 48 hours',
      '"Done-For-You" Migration Guarantee: legacy Typeform/Jotform/Formik schemas rewritten into form-os FREE',
      'Private Field-Component Registry + SAML 2.0 / OIDC SSO & SCIM directory sync',
      'Cryptographic audit trail per field mutation (HIPAA BAA, GDPR DPA, & custom MSA)',
    ],
    ctaLabel: 'Claim Free Migration & 30-Day Eval',
    ctaHref: '#enterprise-Calculator',
  },
];

export const BONUS_STACK: BonusItem[] = [
  {
    id: 'dfy-migration',
    title: 'Bonus #1: "Done-For-You" Legacy Schema Migration Engine & Service',
    problemSolved: 'Obstacle: "We have 150 legacy Typeform, Jotform, and Formik forms we cannot rewrite by hand."',
    description:
      'Our forward-deployed engineers convert up to 250 legacy forms into validated @form-os/schema configs with 100% parity tests — free of charge.',
    anchoredValueUsd: 18500,
    includedIn: ['sovereign'],
  },
  {
    id: 'enterprise-connectors',
    title: 'Bonus #2: Pre-Built Salesforce, Snowflake & SAP Sink Connectors',
    problemSolved: 'Obstacle: "Every form change breaks our downstream CRM and data warehouse pipelines."',
    description:
      'Zero-maintenance schema-aware pipelines that auto-evolve Snowflake tables and Salesforce objects whenever your FormConfig updates.',
    anchoredValueUsd: 12000,
    includedIn: ['sovereign'],
  },
  {
    id: 'visual-studio',
    title: 'Bonus #3: White-Label Visual Form Studio for Non-Developers',
    problemSolved: 'Obstacle: "PMs and Ops open Jira tickets for every label or conditional rule change."',
    description:
      'Embeddable drag-and-drop builder that outputs strict @form-os/schema JSON PRs straight to your GitHub repo.',
    anchoredValueUsd: 8500,
    includedIn: ['scale', 'sovereign'],
  },
  {
    id: 'compliance-pack',
    title: 'Bonus #4: Regulated KYC / HIPAA / SOC2 Field Component Blueprint Pack',
    problemSolved: 'Obstacle: "Building accessible, WCAG AA compliant, audit-logged field UIs takes months."',
    description:
      '40+ production-hardened custom field components (IBAN, VIES VAT, e-Signature, OTP, File Vault) pre-wired for FormFieldsProvider.',
    anchoredValueUsd: 6000,
    includedIn: ['scale', 'sovereign'],
  },
  {
    id: 'schema-ci',
    title: 'Bonus #5: Automated Schema Migration & GitHub Action ABI Guard',
    problemSolved: 'Obstacle: "Deploying a broken JSON config from a CMS can crash checkout in production."',
    description:
      'Zero-config CI/CD action & edge middleware that validates every FormConfig against @form-os/schema in <0.4ms before boot.',
    anchoredValueUsd: 3500,
    includedIn: ['open-source', 'scale', 'sovereign'],
  },
];

export interface ROICalculatorInput {
  engineersCount: number;
  formsPerMonth: number;
  avgConditionalFieldsPerForm: number;
  hourlyEngineeringRate: number;
  tierId: PricingTierId;
}

export interface ROICalculatorOutput {
  monthlyHoursSaved: number;
  annualHoursSaved: number;
  monthlyDollarsSaved: number;
  annualDollarsSaved: number;
  legacyHoursPerForm: number;
  formOsHoursPerForm: number;
  speedupMultiplier: number;
  totalStackedBonusUsd: number;
  valueEquation: {
    dreamOutcome: number;
    perceivedLikelihood: number;
    timeDelayDays: number;
    effortScore: number;
    compositeValueIndex: number;
  };
}

export function calculateHormoziROI(input: ROICalculatorInput): ROICalculatorOutput {
  const tier =
    PRICING_TIERS.find((t) => t.id === input.tierId) ?? PRICING_TIERS[1];

  // Legacy form builds cost ~6h base + 1.25h per conditional field + 0.35h per engineer coordination overhead
  const legacyHoursPerForm =
    6 +
    input.avgConditionalFieldsPerForm * 1.25 +
    Math.min(input.engineersCount, 50) * 0.25;

  // With form-os, declarative config + getFieldState cuts per-form time to ~0.65h (or 0.25h on Sovereign DFY)
  const tierEfficiency =
    input.tierId === 'sovereign' ? 0.3 : input.tierId === 'scale' ? 0.55 : 0.85;
  const formOsHoursPerForm = Math.max(
    0.4,
    (0.8 + input.avgConditionalFieldsPerForm * 0.08) * tierEfficiency
  );

  const hoursSavedPerForm = Math.max(1, legacyHoursPerForm - formOsHoursPerForm);
  const monthlyHoursSaved = Math.round(hoursSavedPerForm * input.formsPerMonth);
  const annualHoursSaved = monthlyHoursSaved * 12;
  const monthlyDollarsSaved = Math.round(
    monthlyHoursSaved * input.hourlyEngineeringRate
  );
  const annualDollarsSaved = monthlyDollarsSaved * 12;
  const speedupMultiplier = Number(
    (legacyHoursPerForm / formOsHoursPerForm).toFixed(1)
  );

  const totalStackedBonusUsd = BONUS_STACK.filter((b) =>
    b.includedIn.includes(tier.id)
  ).reduce((acc, b) => acc + b.anchoredValueUsd, 0);

  const { dreamOutcome, perceivedLikelihood, timeDelayDays, effortScore } =
    tier.valueEquationGauges;

  // Hormozi Value Equation: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)
  const numerator = dreamOutcome * perceivedLikelihood;
  const denominator = Math.max(0.2, timeDelayDays * (effortScore / 10));
  const compositeValueIndex = Math.round(numerator / denominator);

  return {
    monthlyHoursSaved,
    annualHoursSaved,
    monthlyDollarsSaved,
    annualDollarsSaved,
    legacyHoursPerForm: Number(legacyHoursPerForm.toFixed(1)),
    formOsHoursPerForm: Number(formOsHoursPerForm.toFixed(1)),
    speedupMultiplier,
    totalStackedBonusUsd,
    valueEquation: {
      dreamOutcome,
      perceivedLikelihood,
      timeDelayDays,
      effortScore,
      compositeValueIndex,
    },
  };
}
