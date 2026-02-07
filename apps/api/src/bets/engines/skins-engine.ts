import { BaseBetEngine, PlayerScore, EngineResult } from './base-engine';

interface SkinsConfig {
  skinValue: number;
  carryOver: boolean;
}

interface SkinResult {
  hole: number;
  winnerId: string | null;
  value: number;
  carried: boolean;
}

export class SkinsEngine extends BaseBetEngine {
  calculateState(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): Record<string, unknown> {
    const skinsConfig = config as unknown as SkinsConfig;
    const skins: SkinResult[] = [];
    let carryOverValue = 0;
    const completedHoles = this.getCompletedHoles(scores);

    for (let hole = 1; hole <= completedHoles; hole++) {
      const holeScores: Array<{ userId: string; netStrokes: number }> = [];

      for (const [userId, playerScores] of scores) {
        const score = playerScores.find(s => s.hole === hole);
        if (score) {
          holeScores.push({ userId, netStrokes: score.netStrokes });
        }
      }

      if (holeScores.length < 2) continue;

      // Sort by net strokes (lowest first)
      holeScores.sort((a, b) => a.netStrokes - b.netStrokes);

      const skinValue = skinsConfig.skinValue + carryOverValue;

      // Check if there's a sole winner (no tie for lowest)
      if (holeScores[0].netStrokes < holeScores[1].netStrokes) {
        skins.push({
          hole,
          winnerId: holeScores[0].userId,
          value: skinValue,
          carried: carryOverValue > 0,
        });
        carryOverValue = 0;
      } else {
        // Tie - carry over if enabled
        skins.push({
          hole,
          winnerId: null,
          value: skinsConfig.skinValue,
          carried: false,
        });
        if (skinsConfig.carryOver) {
          carryOverValue += skinsConfig.skinValue;
        }
      }
    }

    // Calculate pending holes
    const pendingHoles = totalHoles - completedHoles;

    return {
      skins,
      carryOverValue,
      pendingHoles,
      totalPot: skins.filter(s => s.winnerId).reduce((sum, s) => sum + s.value, 0) + carryOverValue + (pendingHoles * skinsConfig.skinValue),
    };
  }

  calculateResults(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): EngineResult {
    const skinsConfig = config as unknown as SkinsConfig;
    const state = this.calculateState(scores, config, totalHoles) as {
      skins: SkinResult[];
      carryOverValue: number;
    };

    const results: EngineResult['results'] = [];
    const playerIds = this.getPlayerIds(scores);
    const numPlayers = playerIds.length;

    // Each skin won means the winner gets skinValue from each other player
    for (const skin of state.skins) {
      if (!skin.winnerId) continue;

      for (const loserId of playerIds) {
        if (loserId === skin.winnerId) continue;

        const perPlayerAmount = skin.value / (numPlayers - 1);
        results.push({
          winnerId: skin.winnerId,
          loserId,
          amount: Math.round(perPlayerAmount * 100) / 100,
          description: `Skin hole ${skin.hole}: ${skin.carried ? '(with carry-over) ' : ''}$${skin.value}`,
          segment: `skin_${skin.hole}`,
        });
      }
    }

    // Handle remaining carry-over on last hole
    if (state.carryOverValue > 0) {
      // Carry-over goes to the last skin winner or is split/voided
      // Common rule: carry-over on 18 pushes (no one wins it)
    }

    return { results, currentState: state };
  }
}
