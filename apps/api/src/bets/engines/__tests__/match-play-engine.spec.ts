import { MatchPlayEngine } from '../match-play-engine';
import { PlayerScore } from '../base-engine';

describe('MatchPlayEngine', () => {
  let engine: MatchPlayEngine;

  const matchPlayConfig = {
    isTeamMatch: false,
    bestBall: false,
    pointValue: 20,
  };

  beforeEach(() => {
    engine = new MatchPlayEngine();
  });

  function createScores(aScores: number[], bScores: number[]): Map<string, PlayerScore[]> {
    const scores = new Map<string, PlayerScore[]>();
    scores.set('playerA', aScores.map((s, i) => ({
      userId: 'playerA', hole: i + 1, strokes: s, netStrokes: s,
    })));
    scores.set('playerB', bScores.map((s, i) => ({
      userId: 'playerB', hole: i + 1, strokes: s, netStrokes: s,
    })));
    return scores;
  }

  it('should track match play status correctly', () => {
    // A wins holes 1,2; B wins hole 3 -> A is 1 UP
    const scores = createScores([3, 3, 5], [4, 4, 4]);
    const state = engine.calculateState(scores, matchPlayConfig as any, 18) as any;

    expect(state.leader).toBe('playerA');
    expect(state.margin).toBe(1);
    expect(state.status).toBe('1 UP');
    expect(state.holesRemaining).toBe(15);
  });

  it('should detect all square', () => {
    const scores = createScores([4, 3], [3, 4]);
    const state = engine.calculateState(scores, matchPlayConfig as any, 18) as any;

    expect(state.leader).toBeNull();
    expect(state.status).toBe('All Square');
  });

  it('should detect match over when margin > holes remaining', () => {
    // A wins first 10 holes out of 18 -> 10 UP with 8 remaining -> match over (10 & 8)
    const aScores = Array(10).fill(3);
    const bScores = Array(10).fill(5);
    const scores = createScores(aScores, bScores);
    const state = engine.calculateState(scores, matchPlayConfig as any, 18) as any;

    expect(state.isMatchOver).toBe(true);
    expect(state.status).toBe('10 & 8');
  });

  it('should calculate results for completed match', () => {
    const aScores = Array(18).fill(4);
    const bScores = Array(18).fill(5);
    const scores = createScores(aScores, bScores);
    const result = engine.calculateResults(scores, matchPlayConfig as any, 18);

    expect(result.results.length).toBe(1);
    expect(result.results[0].winnerId).toBe('playerA');
    expect(result.results[0].amount).toBe(20);
  });
});
