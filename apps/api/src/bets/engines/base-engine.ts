export interface PlayerScore {
  userId: string;
  hole: number;
  strokes: number;
  netStrokes: number;
}

export interface EngineResult {
  results: Array<{
    winnerId: string;
    loserId: string;
    amount: number;
    description: string;
    segment: string;
  }>;
  currentState: Record<string, unknown>;
}

export abstract class BaseBetEngine {
  abstract calculateState(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): Record<string, unknown>;

  abstract calculateResults(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): EngineResult;

  protected getCompletedHoles(scores: Map<string, PlayerScore[]>): number {
    let minHoles = Infinity;
    for (const playerScores of scores.values()) {
      minHoles = Math.min(minHoles, playerScores.length);
    }
    return minHoles === Infinity ? 0 : minHoles;
  }

  protected getPlayerIds(scores: Map<string, PlayerScore[]>): string[] {
    return Array.from(scores.keys());
  }
}
