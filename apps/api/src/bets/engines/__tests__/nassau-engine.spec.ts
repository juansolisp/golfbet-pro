import { NassauEngine } from '../nassau-engine';
import { PlayerScore } from '../base-engine';

describe('NassauEngine', () => {
  let engine: NassauEngine;

  const nassauConfig = {
    frontNineAmount: 10,
    backNineAmount: 10,
    totalAmount: 10,
    autoPress: false,
    pressAfterDown: 2,
    maxPresses: 3,
  };

  beforeEach(() => {
    engine = new NassauEngine();
  });

  function createScores(playerAScores: number[], playerBScores: number[], startHole = 1): Map<string, PlayerScore[]> {
    const scores = new Map<string, PlayerScore[]>();
    scores.set('playerA', playerAScores.map((strokes, i) => ({
      userId: 'playerA',
      hole: startHole + i,
      strokes,
      netStrokes: strokes,
    })));
    scores.set('playerB', playerBScores.map((strokes, i) => ({
      userId: 'playerB',
      hole: startHole + i,
      strokes,
      netStrokes: strokes,
    })));
    return scores;
  }

  it('should calculate state with a clear leader on front 9', () => {
    // Player A: 4,3,5,4,4 = 20 (5 holes)
    // Player B: 5,4,5,5,4 = 23 (5 holes)
    const scores = createScores([4, 3, 5, 4, 4], [5, 4, 5, 5, 4]);
    const state = engine.calculateState(scores, nassauConfig as any, 18) as any;

    expect(state.frontNine.leader).toBe('playerA');
    expect(state.frontNine.margin).toBe(3);
  });

  it('should handle a tie correctly', () => {
    const scores = createScores([4, 4, 4], [4, 4, 4]);
    const state = engine.calculateState(scores, nassauConfig as any, 18) as any;

    expect(state.frontNine.leader).toBeNull();
    expect(state.frontNine.margin).toBe(0);
  });

  it('should calculate final results for a complete round', () => {
    // Complete 18-hole round
    const aScores = [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4]; // Total: 72
    const bScores = [5, 3, 5, 4, 5, 3, 4, 6, 4, 4, 4, 5, 5, 4, 3, 5, 5, 4]; // Total: 78

    const scores = createScores(aScores, bScores);
    const result = engine.calculateResults(scores, nassauConfig as any, 18);

    expect(result.results.length).toBeGreaterThan(0);
    
    // Player A should win overall (lower total)
    const totalResult = result.results.find(r => r.segment === 'total');
    expect(totalResult).toBeDefined();
    expect(totalResult!.winnerId).toBe('playerA');
    expect(totalResult!.amount).toBe(10);
  });

  it('should generate no results when scores are equal', () => {
    const equalScores = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
    const scores = createScores(equalScores, equalScores);
    const result = engine.calculateResults(scores, nassauConfig as any, 18);

    // All segments should be ties, no winners
    const winnersResults = result.results.filter(r => r.winnerId);
    expect(winnersResults.length).toBe(0);
  });
});
