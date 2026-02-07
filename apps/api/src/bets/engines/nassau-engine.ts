import { BaseBetEngine, PlayerScore, EngineResult } from './base-engine';

interface NassauConfig {
  frontNineAmount: number;
  backNineAmount: number;
  totalAmount: number;
  autoPress: boolean;
  pressAfterDown: number;
  maxPresses: number;
}

interface SegmentState {
  leader: string | null;
  margin: number;
  scores: Map<string, number>;
}

interface PressInfo {
  id: string;
  startHole: number;
  initiatedBy: string;
  segment: 'front' | 'back';
  leader: string | null;
  margin: number;
}

export class NassauEngine extends BaseBetEngine {
  calculateState(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): Record<string, unknown> {
    const nassauConfig = config as unknown as NassauConfig;
    const playerIds = this.getPlayerIds(scores);
    
    if (playerIds.length < 2) return { frontNine: null, backNine: null, overall: null, presses: [] };

    const frontNine = this.calculateSegment(scores, 1, 9);
    const backNine = totalHoles === 18 ? this.calculateSegment(scores, 10, 18) : null;
    const overall = this.calculateSegment(scores, 1, totalHoles);

    // Calculate auto-presses
    const presses: PressInfo[] = [];
    if (nassauConfig.autoPress) {
      // Check front nine for press opportunities
      for (const [userId, _] of scores) {
        if (frontNine.leader && frontNine.leader !== userId && frontNine.margin >= nassauConfig.pressAfterDown) {
          if (presses.filter(p => p.segment === 'front').length < nassauConfig.maxPresses) {
            const completedHoles = this.getCompletedHoles(scores);
            if (completedHoles <= 9) {
              presses.push({
                id: `press_front_${presses.length + 1}`,
                startHole: completedHoles,
                initiatedBy: userId,
                segment: 'front',
                leader: frontNine.leader,
                margin: frontNine.margin,
              });
            }
          }
        }
      }
    }

    return { frontNine, backNine, overall, presses };
  }

  calculateResults(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): EngineResult {
    const nassauConfig = config as unknown as NassauConfig;
    const results: EngineResult['results'] = [];
    const playerIds = this.getPlayerIds(scores);

    if (playerIds.length < 2) return { results: [], currentState: {} };

    // For each pair of players, calculate Nassau results
    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        const playerA = playerIds[i];
        const playerB = playerIds[j];

        // Front 9
        const frontResult = this.getSegmentWinner(scores, playerA, playerB, 1, 9);
        if (frontResult.winner) {
          results.push({
            winnerId: frontResult.winner,
            loserId: frontResult.loser!,
            amount: nassauConfig.frontNineAmount,
            description: `Nassau Front 9: won by ${frontResult.margin} holes`,
            segment: 'front_nine',
          });
        }

        // Back 9 (only for 18-hole rounds)
        if (totalHoles === 18) {
          const backResult = this.getSegmentWinner(scores, playerA, playerB, 10, 18);
          if (backResult.winner) {
            results.push({
              winnerId: backResult.winner,
              loserId: backResult.loser!,
              amount: nassauConfig.backNineAmount,
              description: `Nassau Back 9: won by ${backResult.margin} holes`,
              segment: 'back_nine',
            });
          }
        }

        // Total
        const totalResult = this.getSegmentWinner(scores, playerA, playerB, 1, totalHoles);
        if (totalResult.winner) {
          results.push({
            winnerId: totalResult.winner,
            loserId: totalResult.loser!,
            amount: nassauConfig.totalAmount,
            description: `Nassau Total: won by ${totalResult.margin} strokes`,
            segment: 'total',
          });
        }
      }
    }

    return {
      results,
      currentState: this.calculateState(scores, config, totalHoles),
    };
  }

  private calculateSegment(
    scores: Map<string, PlayerScore[]>,
    startHole: number,
    endHole: number,
  ): SegmentState {
    const segmentScores = new Map<string, number>();

    for (const [userId, playerScores] of scores) {
      const segmentTotal = playerScores
        .filter(s => s.hole >= startHole && s.hole <= endHole)
        .reduce((sum, s) => sum + s.netStrokes, 0);
      segmentScores.set(userId, segmentTotal);
    }

    // Find leader (lowest total)
    let leader: string | null = null;
    let bestScore = Infinity;
    let secondBest = Infinity;

    for (const [userId, total] of segmentScores) {
      if (total < bestScore) {
        secondBest = bestScore;
        bestScore = total;
        leader = userId;
      } else if (total < secondBest) {
        secondBest = total;
      }
    }

    // Check for tie
    const margin = secondBest - bestScore;
    if (margin === 0) leader = null;

    return { leader, margin, scores: segmentScores };
  }

  private getSegmentWinner(
    scores: Map<string, PlayerScore[]>,
    playerA: string,
    playerB: string,
    startHole: number,
    endHole: number,
  ): { winner: string | null; loser: string | null; margin: number } {
    const aScores = scores.get(playerA) || [];
    const bScores = scores.get(playerB) || [];

    let aTotal = 0;
    let bTotal = 0;

    for (let hole = startHole; hole <= endHole; hole++) {
      const aScore = aScores.find(s => s.hole === hole);
      const bScore = bScores.find(s => s.hole === hole);
      if (aScore) aTotal += aScore.netStrokes;
      if (bScore) bTotal += bScore.netStrokes;
    }

    if (aTotal < bTotal) return { winner: playerA, loser: playerB, margin: bTotal - aTotal };
    if (bTotal < aTotal) return { winner: playerB, loser: playerA, margin: aTotal - bTotal };
    return { winner: null, loser: null, margin: 0 };
  }
}
