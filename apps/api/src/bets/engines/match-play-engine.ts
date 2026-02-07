import { BaseBetEngine, PlayerScore, EngineResult } from './base-engine';

interface MatchPlayConfig {
  isTeamMatch: boolean;
  teams?: { teamA: string[]; teamB: string[] };
  bestBall: boolean;
  pointValue: number;
}

interface HoleResult {
  hole: number;
  winner: string | null; // userId, teamId, or null for halved
  winnerLabel: string;
}

export class MatchPlayEngine extends BaseBetEngine {
  calculateState(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): Record<string, unknown> {
    const mpConfig = config as unknown as MatchPlayConfig;
    const completedHoles = this.getCompletedHoles(scores);

    if (mpConfig.isTeamMatch && mpConfig.teams) {
      return this.calculateTeamState(scores, mpConfig, totalHoles, completedHoles);
    }

    return this.calculateIndividualState(scores, mpConfig, totalHoles, completedHoles);
  }

  calculateResults(
    scores: Map<string, PlayerScore[]>,
    config: Record<string, unknown>,
    totalHoles: number,
  ): EngineResult {
    const mpConfig = config as unknown as MatchPlayConfig;
    const state = this.calculateState(scores, config, totalHoles) as Record<string, unknown>;
    const results: EngineResult['results'] = [];

    if (mpConfig.isTeamMatch && mpConfig.teams) {
      const teamStatus = state['status'] as string;
      const margin = state['margin'] as number;
      
      if (margin > 0) {
        const winnerTeam = state['leader'] as string;
        const teamA = mpConfig.teams.teamA;
        const teamB = mpConfig.teams.teamB;
        const losers = winnerTeam === 'teamA' ? teamB : teamA;
        const winners = winnerTeam === 'teamA' ? teamA : teamB;

        // Each winner gets pointValue from each loser
        for (const winnerId of winners) {
          for (const loserId of losers) {
            results.push({
              winnerId,
              loserId,
              amount: mpConfig.pointValue,
              description: `Match Play: ${teamStatus}`,
              segment: 'match_play_team',
            });
          }
        }
      }
    } else {
      // Individual match play - handle each pair
      const playerIds = this.getPlayerIds(scores);
      if (playerIds.length === 2) {
        const margin = state['margin'] as number;
        if (margin > 0) {
          const leaderId = state['leader'] as string;
          const loserId = playerIds.find(id => id !== leaderId)!;
          results.push({
            winnerId: leaderId,
            loserId,
            amount: mpConfig.pointValue,
            description: `Match Play: ${state['status']}`,
            segment: 'match_play',
          });
        }
      }
    }

    return { results, currentState: state };
  }

  private calculateIndividualState(
    scores: Map<string, PlayerScore[]>,
    config: MatchPlayConfig,
    totalHoles: number,
    completedHoles: number,
  ): Record<string, unknown> {
    const playerIds = this.getPlayerIds(scores);
    if (playerIds.length !== 2) return { error: 'Match Play requires exactly 2 players for individual' };

    const [playerA, playerB] = playerIds;
    const holeResults: HoleResult[] = [];
    let aUp = 0;

    for (let hole = 1; hole <= completedHoles; hole++) {
      const aScore = (scores.get(playerA) || []).find(s => s.hole === hole);
      const bScore = (scores.get(playerB) || []).find(s => s.hole === hole);

      if (!aScore || !bScore) continue;

      const aNet = aScore.netStrokes;
      const bNet = bScore.netStrokes;

      if (aNet < bNet) {
        aUp++;
        holeResults.push({ hole, winner: playerA, winnerLabel: 'A' });
      } else if (bNet < aNet) {
        aUp--;
        holeResults.push({ hole, winner: playerB, winnerLabel: 'B' });
      } else {
        holeResults.push({ hole, winner: null, winnerLabel: 'Halved' });
      }
    }

    const holesRemaining = totalHoles - completedHoles;
    const margin = Math.abs(aUp);
    const leader = aUp > 0 ? playerA : aUp < 0 ? playerB : null;
    const isMatchOver = margin > holesRemaining;

    let status: string;
    if (isMatchOver) {
      status = `${margin} & ${holesRemaining}`;
    } else if (completedHoles === totalHoles) {
      if (margin === 0) {
        status = 'All Square';
      } else {
        status = `${margin} UP`;
      }
    } else {
      if (margin === 0) {
        status = 'All Square';
      } else {
        status = `${margin} UP`;
      }
    }

    return {
      leader,
      margin,
      status,
      holesRemaining,
      holeResults,
      isMatchOver,
      matchComplete: completedHoles >= totalHoles || isMatchOver,
    };
  }

  private calculateTeamState(
    scores: Map<string, PlayerScore[]>,
    config: MatchPlayConfig,
    totalHoles: number,
    completedHoles: number,
  ): Record<string, unknown> {
    if (!config.teams) return { error: 'Team configuration required' };

    const { teamA, teamB } = config.teams;
    const holeResults: HoleResult[] = [];
    let teamAUp = 0;

    for (let hole = 1; hole <= completedHoles; hole++) {
      let teamABest = Infinity;
      let teamBBest = Infinity;

      if (config.bestBall) {
        // Best ball: take the best net score from each team
        for (const playerId of teamA) {
          const score = (scores.get(playerId) || []).find(s => s.hole === hole);
          if (score) teamABest = Math.min(teamABest, score.netStrokes);
        }
        for (const playerId of teamB) {
          const score = (scores.get(playerId) || []).find(s => s.hole === hole);
          if (score) teamBBest = Math.min(teamBBest, score.netStrokes);
        }
      } else {
        // Combined: add all scores from each team
        teamABest = 0;
        teamBBest = 0;
        for (const playerId of teamA) {
          const score = (scores.get(playerId) || []).find(s => s.hole === hole);
          if (score) teamABest += score.netStrokes;
        }
        for (const playerId of teamB) {
          const score = (scores.get(playerId) || []).find(s => s.hole === hole);
          if (score) teamBBest += score.netStrokes;
        }
      }

      if (teamABest < teamBBest) {
        teamAUp++;
        holeResults.push({ hole, winner: 'teamA', winnerLabel: 'Team A' });
      } else if (teamBBest < teamABest) {
        teamAUp--;
        holeResults.push({ hole, winner: 'teamB', winnerLabel: 'Team B' });
      } else {
        holeResults.push({ hole, winner: null, winnerLabel: 'Halved' });
      }
    }

    const holesRemaining = totalHoles - completedHoles;
    const margin = Math.abs(teamAUp);
    const leader = teamAUp > 0 ? 'teamA' : teamAUp < 0 ? 'teamB' : null;
    const isMatchOver = margin > holesRemaining;

    let status: string;
    if (isMatchOver) {
      status = `${margin} & ${holesRemaining}`;
    } else if (completedHoles === totalHoles) {
      status = margin === 0 ? 'All Square' : `${margin} UP`;
    } else {
      status = margin === 0 ? 'All Square' : `${margin} UP`;
    }

    return {
      leader,
      margin,
      status,
      holesRemaining,
      holeResults,
      isMatchOver,
      matchComplete: completedHoles >= totalHoles || isMatchOver,
    };
  }
}
