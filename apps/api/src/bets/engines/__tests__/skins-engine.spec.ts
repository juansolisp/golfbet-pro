import { SkinsEngine } from '../skins-engine';
import { PlayerScore } from '../base-engine';

describe('SkinsEngine', () => {
  let engine: SkinsEngine;

  const skinsConfig = {
    skinValue: 5,
    carryOver: true,
  };

  beforeEach(() => {
    engine = new SkinsEngine();
  });

  function createScores(players: Record<string, number[]>): Map<string, PlayerScore[]> {
    const scores = new Map<string, PlayerScore[]>();
    for (const [userId, strokes] of Object.entries(players)) {
      scores.set(userId, strokes.map((s, i) => ({
        userId,
        hole: i + 1,
        strokes: s,
        netStrokes: s,
      })));
    }
    return scores;
  }

  it('should award skin to sole low scorer', () => {
    const scores = createScores({
      playerA: [3, 4, 5],
      playerB: [4, 4, 5],
      playerC: [4, 4, 5],
    });

    const state = engine.calculateState(scores, skinsConfig as any, 18) as any;

    expect(state.skins[0].winnerId).toBe('playerA');
    expect(state.skins[0].value).toBe(5);
  });

  it('should carry over when there is a tie', () => {
    const scores = createScores({
      playerA: [4, 3],
      playerB: [4, 4],
    });

    const state = engine.calculateState(scores, skinsConfig as any, 18) as any;

    // Hole 1: tie (both 4) -> carry over
    expect(state.skins[0].winnerId).toBeNull();
    // Hole 2: playerA wins with carry over
    expect(state.skins[1].winnerId).toBe('playerA');
    expect(state.skins[1].value).toBe(10); // 5 (base) + 5 (carry)
    expect(state.skins[1].carried).toBe(true);
  });

  it('should not carry over when disabled', () => {
    const noCarryConfig = { skinValue: 5, carryOver: false };
    const scores = createScores({
      playerA: [4, 3],
      playerB: [4, 4],
    });

    const state = engine.calculateState(scores, noCarryConfig as any, 18) as any;

    // Hole 2: playerA wins but no carry over
    expect(state.skins[1].winnerId).toBe('playerA');
    expect(state.skins[1].value).toBe(5);
  });

  it('should calculate results distributing winnings among losers', () => {
    const scores = createScores({
      playerA: [3],
      playerB: [4],
      playerC: [4],
    });

    const result = engine.calculateResults(scores, skinsConfig as any, 18);

    // playerA wins $5 skin, split among 2 losers
    expect(result.results.length).toBe(2); // One result per loser
    expect(result.results[0].winnerId).toBe('playerA');
    expect(result.results[0].amount).toBe(2.5); // $5 / 2 losers
  });
});
