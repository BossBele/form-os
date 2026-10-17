import {
  getFieldState,
  type Dependency,
  type FieldConfig,
  type FieldState,
} from '@form-os/core';

export interface WireItTestVector {
  id: string;
  label: string;
  values: Record<string, any>;
  expectedState: Partial<Pick<FieldState, 'visible' | 'required' | 'disabled' | 'readonly'>>;
}

export interface WireItLevel {
  id: string;
  levelNumber: number;
  title: string;
  difficulty: 'Bootcamp' | 'Operator' | 'Systems' | 'Principal' | 'Kernel Boss';
  xpReward: number;
  scenarioBrief: string;
  hint: string;
  sourceFields: Array<{
    name: string;
    type: string;
    label: string;
    sampleValues: Array<{ label: string; value: any }>;
  }>;
  targetField: FieldConfig;
  solutionDependencies: Dependency[];
  testVectors: WireItTestVector[];
}

export const WIRE_IT_LEVELS: WireItLevel[] = [
  {
    id: 'lvl-1',
    levelNumber: 1,
    title: 'EU VAT Onboarding Gate',
    difficulty: 'Bootcamp',
    xpReward: 150,
    scenarioBrief:
      'Wire the "vatNumber" field so it is ONLY visible when "country" equals "EU".',
    hint: 'Add a dependency with name="country", type="show", and value="EU".',
    sourceFields: [
      {
        name: 'country',
        type: 'select',
        label: 'Company Tax Region',
        sampleValues: [
          { label: 'European Union (EU)', value: 'EU' },
          { label: 'United States (US)', value: 'US' },
          { label: 'United Kingdom (UK)', value: 'UK' },
        ],
      },
    ],
    targetField: {
      name: 'vatNumber',
      type: 'text',
      label: 'EU VIES VAT Number',
    },
    solutionDependencies: [{ name: 'country', value: 'EU', type: 'show' }],
    testVectors: [
      {
        id: 'v1',
        label: 'When country === "EU", vatNumber must be visible',
        values: { country: 'EU' },
        expectedState: { visible: true },
      },
      {
        id: 'v2',
        label: 'When country === "US", vatNumber must be hidden',
        values: { country: 'US' },
        expectedState: { visible: false },
      },
    ],
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    title: 'Pediatric Guardian Consent',
    difficulty: 'Operator',
    xpReward: 200,
    scenarioBrief:
      'In clinical triage, "guardianSignature" must be both SHOWN and REQUIRED when "ageBracket" equals "minor".',
    hint: 'Wire two dependencies on "ageBracket" = "minor": one with type="show" and one with type="required".',
    sourceFields: [
      {
        name: 'ageBracket',
        type: 'radio',
        label: 'Patient Age Bracket',
        sampleValues: [
          { label: 'Minor (<18)', value: 'minor' },
          { label: 'Adult (18+)', value: 'adult' },
        ],
      },
    ],
    targetField: {
      name: 'guardianSignature',
      type: 'text',
      label: 'Legal Guardian Signature',
    },
    solutionDependencies: [
      { name: 'ageBracket', value: 'minor', type: 'show' },
      { name: 'ageBracket', value: 'minor', type: 'required' },
    ],
    testVectors: [
      {
        id: 'v1',
        label: 'Minor patient -> guardianSignature is visible AND required',
        values: { ageBracket: 'minor' },
        expectedState: { visible: true, required: true },
      },
      {
        id: 'v2',
        label: 'Adult patient -> guardianSignature is hidden AND not required',
        values: { ageBracket: 'adult' },
        expectedState: { visible: false, required: false },
      },
    ],
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    title: 'Auditor Seal Read-Only Lock',
    difficulty: 'Systems',
    xpReward: 250,
    scenarioBrief:
      'When "auditSealed" is true, lock "settlementAccount" as read-only so compliance reviewers can view but not mutate it.',
    hint: 'Add a dependency with name="auditSealed", type="readonly", value=true.',
    sourceFields: [
      {
        name: 'auditSealed',
        type: 'switch',
        label: 'Seal Record for External Audit',
        sampleValues: [
          { label: 'Sealed (true)', value: true },
          { label: 'Editable (false)', value: false },
        ],
      },
    ],
    targetField: {
      name: 'settlementAccount',
      type: 'text',
      label: 'Primary Settlement IBAN',
    },
    solutionDependencies: [
      { name: 'auditSealed', value: true, type: 'readonly' },
    ],
    testVectors: [
      {
        id: 'v1',
        label: 'auditSealed === true -> readonly is true',
        values: { auditSealed: true },
        expectedState: { visible: true, readonly: true },
      },
      {
        id: 'v2',
        label: 'auditSealed === false -> readonly is false',
        values: { auditSealed: false },
        expectedState: { visible: true, readonly: false },
      },
    ],
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    title: 'OFAC Sanctions Freeze & Fast-Track Hide',
    difficulty: 'Principal',
    xpReward: 300,
    scenarioBrief:
      'When "sanctionsFlag" is true, the "wireTransferButton" field must be both HIDDEN and DISABLED.',
    hint: 'Wire name="sanctionsFlag", value=true with both type="hidden" and type="disabled".',
    sourceFields: [
      {
        name: 'sanctionsFlag',
        type: 'switch',
        label: 'OFAC Sanctions Match Active',
        sampleValues: [
          { label: 'Flagged (true)', value: true },
          { label: 'Clear (false)', value: false },
        ],
      },
    ],
    targetField: {
      name: 'wireTransferButton',
      type: 'text',
      label: 'Instant Wire Authorization Code',
    },
    solutionDependencies: [
      { name: 'sanctionsFlag', value: true, type: 'hidden' },
      { name: 'sanctionsFlag', value: true, type: 'disabled' },
    ],
    testVectors: [
      {
        id: 'v1',
        label: 'sanctionsFlag === true -> hidden (visible: false) AND disabled: true',
        values: { sanctionsFlag: true },
        expectedState: { visible: false, disabled: true },
      },
      {
        id: 'v2',
        label: 'sanctionsFlag === false -> visible: true AND disabled: false',
        values: { sanctionsFlag: false },
        expectedState: { visible: true, disabled: false },
      },
    ],
  },
  {
    id: 'lvl-5',
    levelNumber: 5,
    title: 'Sovereign Dual-Key AND Gate',
    difficulty: 'Kernel Boss',
    xpReward: 450,
    scenarioBrief:
      '@form-os/core ANDs multiple dependencies of the same type! Reveal AND require "sovereignClusterKey" ONLY when "tier" === "sovereign" AND "clearanceVerified" === true.',
    hint: 'Add two "show" dependencies (tier="sovereign", clearanceVerified=true) AND two "required" dependencies.',
    sourceFields: [
      {
        name: 'tier',
        type: 'select',
        label: 'Deployment Tier',
        sampleValues: [
          { label: 'Sovereign Air-Gapped', value: 'sovereign' },
          { label: 'Scale Cloud', value: 'scale' },
        ],
      },
      {
        name: 'clearanceVerified',
        type: 'switch',
        label: 'SecOps Clearance Verified',
        sampleValues: [
          { label: 'Verified (true)', value: true },
          { label: 'Pending (false)', value: false },
        ],
      },
    ],
    targetField: {
      name: 'sovereignClusterKey',
      type: 'password',
      label: 'Air-Gapped Cluster Root HSM Key',
    },
    solutionDependencies: [
      { name: 'tier', value: 'sovereign', type: 'show' },
      { name: 'clearanceVerified', value: true, type: 'show' },
      { name: 'tier', value: 'sovereign', type: 'required' },
      { name: 'clearanceVerified', value: true, type: 'required' },
    ],
    testVectors: [
      {
        id: 'v1',
        label: 'tier="sovereign" + clearanceVerified=true -> visible: true, required: true',
        values: { tier: 'sovereign', clearanceVerified: true },
        expectedState: { visible: true, required: true },
      },
      {
        id: 'v2',
        label: 'tier="sovereign" + clearanceVerified=false -> hidden & not required (AND gate blocks)',
        values: { tier: 'sovereign', clearanceVerified: false },
        expectedState: { visible: false, required: false },
      },
      {
        id: 'v3',
        label: 'tier="scale" + clearanceVerified=true -> hidden & not required',
        values: { tier: 'scale', clearanceVerified: true },
        expectedState: { visible: false, required: false },
      },
    ],
  },
];

export interface WireItCaseEvaluation {
  vectorId: string;
  label: string;
  actualState: FieldState;
  expectedState: WireItTestVector['expectedState'];
  matched: boolean;
}

export interface WireItEvaluationResult {
  passed: boolean;
  caseResults: WireItCaseEvaluation[];
}

export function evaluateWireItSubmission(
  level: WireItLevel,
  candidateDependencies: Dependency[]
): WireItEvaluationResult {
  const configuredTarget: FieldConfig = {
    ...level.targetField,
    dependencies: candidateDependencies,
  };

  const caseResults: WireItCaseEvaluation[] = level.testVectors.map((vec) => {
    const actualState = getFieldState(configuredTarget, vec.values);
    let matched = true;

    for (const [k, expectedVal] of Object.entries(vec.expectedState)) {
      const key = k as keyof typeof vec.expectedState;
      if (actualState[key] !== expectedVal) {
        matched = false;
      }
    }

    return {
      vectorId: vec.id,
      label: vec.label,
      actualState,
      expectedState: vec.expectedState,
      matched,
    };
  });

  return {
    passed: caseResults.every((c) => c.matched),
    caseResults,
  };
}

export interface LeaderboardScoreObject {
  playerRank: string;
  totalScore: number;
  maxStreak: number;
  completedLevels: number;
  timestampIso: string;
  shareableBadgeText: string;
}

export function buildLeaderboardScoreObject(params: {
  completedLevelIds: string[];
  streak: number;
  basePoints: number;
}): LeaderboardScoreObject {
  const streakBonus = params.streak * 75;
  const totalScore = params.basePoints + streakBonus;
  const completedLevels = params.completedLevelIds.length;

  const playerRank =
    completedLevels >= 5
      ? 'Principal Kernel Architect (Ring 0)'
      : completedLevels >= 3
        ? 'Systems Dependency Engineer'
        : 'Form-OS Runtime Operator';

  return {
    playerRank,
    totalScore,
    maxStreak: params.streak,
    completedLevels,
    timestampIso: '2026-10-17T00:00:00.000Z',
    shareableBadgeText: `I wired all ${completedLevels}/5 @form-os/core Dependency Engine challenges (${totalScore} pts · ${playerRank}) on form-os! https://github.com/BossBele/formsjs`,
  };
}
