import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NassauEngine } from './engines/nassau-engine';
import { SkinsEngine } from './engines/skins-engine';
import { MatchPlayEngine } from './engines/match-play-engine';
import { BaseBetEngine, PlayerScore } from './engines/base-engine';
import { BetType } from '@prisma/client';
import { CreateBetDto } from './dto/create-bet.dto';
import { calculateNetScore } from '@golfbet/shared';

@Injectable()
export class BetsService {
  private engines: Map<BetType, BaseBetEngine>;

  constructor(private prisma: PrismaService) {
    this.engines = new Map([
      [BetType.NASSAU, new NassauEngine()],
      [BetType.SKINS, new SkinsEngine()],
      [BetType.MATCH_PLAY, new MatchPlayEngine()],
    ]);
  }

  async create(roundId: string, dto: CreateBetDto) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
    });

    if (!round) throw new NotFoundException('Round not found');

    return this.prisma.bet.create({
      data: {
        roundId,
        type: dto.type,
        config: dto.config as any,
        status: 'PENDING',
      },
    });
  }

  async getBetState(betId: string) {
    const bet = await this.prisma.bet.findUnique({
      where: { id: betId },
      include: {
        round: {
          include: {
            players: {
              include: {
                scores: true,
                user: true,
              },
            },
            course: {
              include: { holes: true },
            },
          },
        },
      },
    });

    if (!bet) throw new NotFoundException('Bet not found');

    const engine = this.engines.get(bet.type);
    if (!engine) throw new BadRequestException(`Unsupported bet type: ${bet.type}`);

    const scores = this.buildScoresMap(bet.round.players, bet.round.course.holes);
    const totalHoles = bet.round.type === 'EIGHTEEN_HOLES' ? 18 : 9;

    return engine.calculateState(scores, bet.config as Record<string, unknown>, totalHoles);
  }

  async calculateBetResults(betId: string) {
    const bet = await this.prisma.bet.findUnique({
      where: { id: betId },
      include: {
        round: {
          include: {
            players: {
              include: {
                scores: true,
                user: true,
              },
            },
            course: {
              include: { holes: true },
            },
          },
        },
      },
    });

    if (!bet) throw new NotFoundException('Bet not found');

    const engine = this.engines.get(bet.type);
    if (!engine) throw new BadRequestException(`Unsupported bet type: ${bet.type}`);

    const scores = this.buildScoresMap(bet.round.players, bet.round.course.holes);
    const totalHoles = bet.round.type === 'EIGHTEEN_HOLES' ? 18 : 9;

    const engineResult = engine.calculateResults(scores, bet.config as Record<string, unknown>, totalHoles);

    // Save results to database
    const betResults = await Promise.all(
      engineResult.results.map(result =>
        this.prisma.betResult.create({
          data: {
            betId: bet.id,
            winnerId: result.winnerId,
            loserId: result.loserId,
            amount: result.amount,
            description: result.description,
            segment: result.segment,
          },
        }),
      ),
    );

    // Update bet status
    await this.prisma.bet.update({
      where: { id: betId },
      data: { status: 'COMPLETED' },
    });

    return { results: betResults, state: engineResult.currentState };
  }

  async activatePress(betId: string, userId: string, startHole: number) {
    const bet = await this.prisma.bet.findUnique({ where: { id: betId } });

    if (!bet) throw new NotFoundException('Bet not found');
    if (bet.type !== BetType.NASSAU) throw new BadRequestException('Press only available for Nassau bets');

    const config = bet.config as any;
    return this.prisma.nassauPress.create({
      data: {
        betId,
        startHole,
        initiatedBy: userId,
        amount: config.frontNineAmount || config.amount,
      },
    });
  }

  async getBetsForRound(roundId: string) {
    return this.prisma.bet.findMany({
      where: { roundId },
      include: {
        results: true,
        presses: true,
      },
    });
  }

  private buildScoresMap(
    players: Array<{
      userId: string;
      courseHandicap: number;
      scores: Array<{ hole: number; strokes: number }>;
    }>,
    holes: Array<{ number: number; par: number; handicapIndex: number }>,
  ): Map<string, PlayerScore[]> {
    const scoresMap = new Map<string, PlayerScore[]>();

    for (const player of players) {
      const playerScores: PlayerScore[] = player.scores.map(score => {
        const holeInfo = holes.find(h => h.number === score.hole);
        const netStrokes = holeInfo
          ? calculateNetScore(
              score.strokes,
              holeInfo.handicapIndex,
              player.courseHandicap,
              holes.length,
            )
          : score.strokes;

        return {
          userId: player.userId,
          hole: score.hole,
          strokes: score.strokes,
          netStrokes,
        };
      });

      scoresMap.set(player.userId, playerScores);
    }

    return scoresMap;
  }
}
