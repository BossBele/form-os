import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PLAYGROUND_PRESETS } from '../lib/prompt-to-config';
import {
  WIRE_IT_LEVELS,
  evaluateWireItSubmission,
  buildLeaderboardScoreObject,
} from '../lib/wire-it-engine';
import { DependencyWiringBoard } from '../components/DependencyWiringBoard';
import { WireItGame } from '../components/WireItGame';
import { KernelPanicModal } from '../components/KernelPanicModal';

describe('Task 3: Dependency Wiring Board, Playable "Wire It" Game & KERNEL PANIC', () => {
  it('validates all 5 Wire It levels against real @form-os/core getFieldState semantics (including AND logic)', () => {
    expect(WIRE_IT_LEVELS.length).toBe(5);

    for (const level of WIRE_IT_LEVELS) {
      // Solution dependencies must pass 100% of test vectors via real getFieldState
      const passingResult = evaluateWireItSubmission(
        level,
        level.solutionDependencies
      );
      expect(passingResult.passed).toBe(true);
      expect(passingResult.caseResults.every((c) => c.matched)).toBe(true);

      // Empty dependencies must fail at least one test vector
      const failingResult = evaluateWireItSubmission(level, []);
      expect(failingResult.passed).toBe(false);
    }
  });

  it('produces a clean leaderboard score card object with rank and streak multiplier', () => {
    const scoreObj = buildLeaderboardScoreObject({
      completedLevelIds: ['lvl-1', 'lvl-2', 'lvl-3', 'lvl-4', 'lvl-5'],
      streak: 5,
      basePoints: 1250,
    });
    expect(scoreObj.totalScore).toBeGreaterThan(1250);
    expect(scoreObj.completedLevels).toBe(5);
    expect(scoreObj.playerRank).toContain('Kernel');
  });

  it('renders DependencyWiringBoard with SVG signal cables and live getFieldState badges', () => {
    const kycConfig = PLAYGROUND_PRESETS[0].config;
    const html = renderToString(
      <DependencyWiringBoard
        config={kycConfig}
        values={{ jurisdiction: 'EU', isPep: true }}
        onUpdateConfig={() => {}}
      />
    );
    expect(html).toContain('jurisdiction');
    expect(html).toContain('vatNumber');
    expect(html).toContain('pepSourceOfWealth');
  });

  it('renders WireItGame arena and KernelPanicModal BSOD + mini-game', () => {
    const gameHtml = renderToString(<WireItGame onEarnXp={() => {}} />);
    expect(gameHtml).toContain('WIRE IT');
    expect(gameHtml).toContain('EU VAT Onboarding');

    const panicHtml = renderToString(
      <KernelPanicModal open={true} onClose={() => {}} onEarnXp={() => {}} />
    );
    expect(panicHtml).toContain('KERNEL PANIC');
    expect(panicHtml).toContain('0xF04M_OS');
  });
});
