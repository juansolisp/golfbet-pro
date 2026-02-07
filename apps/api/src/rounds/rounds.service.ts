import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BetsService } from '../bets/bets.service';
import { SettlementsService } from '../settlements/settlements.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { calculateCourseHandicap } from '@golfbet/shared';

@Injectable()
export class RoundsService {
  constructor(
    private prisma: PrismaService,
    private betsService: BetsService,
    private settlementsService: SettlementsService,
  ) {}

  async create(userId: string, dto: CreateRoundDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: { holes: true },
    });
    if (!course) throw new NotFoundException('Course not found');

    // Verify all players exist
    const players = await this.prisma.user.findMany({
      where: { id: { in: dto.playerIds } },
    });
    if (players.length !== dto.playerIds.length) {
      throw new BadRequestException('One or more players not found');
    }

    // Create round with players and bets
    const round = await this.prisma.round.create({
      data: {
        courseId: dto.courseId,
        groupId: dto.groupId,
        creatorId: userId,
        type: dto.type,
        status: 'PENDING',
        date: new Date(),
        players: {
          create: dto.playerIds.map(playerId => {
            const player = players.find(p => p.id === playerId)!;
            const courseHandicap = calculateCourseHandicap(
              player.handicap,
              course.slopeRating,
              course.courseRating,
              course.totalPar,
            );
            return {
              userId: playerId,
              courseHandicap,
            };
          }),
        },
        bets: {
          create: (dto.bets || []).map(bet => ({
            type: bet.type,
            config: bet.config as any,
            status: 'PENDING',
          })),
        },
      },
      include: {
        course: { include: { holes: { orderBy: { number: 'asc' } } } },
        players: { include: { user: { select: { id: true, name: true, avatar: true, handicap: true } } } },
        bets: true,
      },
    });

    return round;
  }

  async findById(roundId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        course: { include: { holes: { orderBy: { number: 'asc' } } } },
        players: {
          include: {
            user: { select: { id: true, name: true, avatar: true, handicap: true } },
            scores: { orderBy: { hole: 'asc' } },
          },
        },
        bets: { include: { results: true, presses: true } },
        settlements: true,
      },
    });
    if (!round) throw new NotFoundException('Round not found');
    return round;
  }

  async findForUser(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const [rounds, total] = await Promise.all([
      this.prisma.round.findMany({
        where: { players: { some: { userId } } },
        include: {
          course: true,
          players: { include: { user: { select: { id: true, name: true, avatar: true } } } },
          bets: true,
        },
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.round.count({ where: { players: { some: { userId } } } }),
    ]);

    return { items: rounds, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async startRound(roundId: string, userId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
    });
    if (!round) throw new NotFoundException('Round not found');
    if (round.creatorId !== userId) throw new ForbiddenException('Only the creator can start the round');
    if (round.status !== 'PENDING') throw new BadRequestException('Round is not in pending status');

    return this.prisma.round.update({
      where: { id: roundId },
      data: {
        status: 'IN_PROGRESS',
        bets: { updateMany: { where: { roundId }, data: { status: 'ACTIVE' } } },
      },
      include: {
        course: { include: { holes: { orderBy: { number: 'asc' } } } },
        players: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        bets: true,
      },
    });
  }

  async completeRound(roundId: string, userId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: { bets: true },
    });
    if (!round) throw new NotFoundException('Round not found');
    if (round.creatorId !== userId) throw new ForbiddenException('Only the creator can complete the round');
    if (round.status !== 'IN_PROGRESS') throw new BadRequestException('Round is not in progress');

    // Calculate results for all bets
    for (const bet of round.bets) {
      await this.betsService.calculateBetResults(bet.id);
    }

    // Generate settlements
    await this.settlementsService.generateSettlements(roundId);

    return this.prisma.round.update({
      where: { id: roundId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        course: { include: { holes: true } },
        players: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            scores: { orderBy: { hole: 'asc' } },
          },
        },
        bets: { include: { results: true } },
        settlements: true,
      },
    });
  }

  async getLeaderboard(roundId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        course: { include: { holes: { orderBy: { number: 'asc' } } } },
        players: {
          include: {
            user: { select: { id: true, name: true, avatar: true, handicap: true } },
            scores: { orderBy: { hole: 'asc' } },
          },
        },
      },
    });
    if (!round) throw new NotFoundException('Round not found');

    const totalPar = round.course.holes.reduce((sum, h) => sum + h.par, 0);

    const leaderboard = round.players.map(player => {
      const totalStrokes = player.scores.reduce((sum, s) => sum + s.strokes, 0);
      const holesPlayed = player.scores.length;
      const parForHolesPlayed = player.scores.reduce((sum, s) => {
        const hole = round.course.holes.find(h => h.number === s.hole);
        return sum + (hole?.par || 0);
      }, 0);

      return {
        userId: player.user.id,
        userName: player.user.name,
        avatar: player.user.avatar,
        totalStrokes,
        netStrokes: totalStrokes - player.courseHandicap,
        thru: holesPlayed,
        toPar: totalStrokes - parForHolesPlayed,
        holesPlayed,
        courseHandicap: player.courseHandicap,
      };
    });

    // Sort by net strokes (ascending)
    leaderboard.sort((a, b) => a.netStrokes - b.netStrokes);

    return { leaderboard, coursePar: totalPar };
  }
}
