import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { BulkSyncDto } from './dto/bulk-sync.dto';

@Injectable()
export class ScoresService {
  constructor(private prisma: PrismaService) {}

  async submit(userId: string, dto: SubmitScoreDto) {
    const roundPlayer = await this.prisma.roundPlayer.findFirst({
      where: { roundId: dto.roundId, userId },
      include: { round: true },
    });

    if (!roundPlayer) throw new NotFoundException('Player not found in this round');
    if (roundPlayer.round.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Round is not in progress');
    }

    // Upsert score (allows updating)
    const score = await this.prisma.score.upsert({
      where: {
        roundPlayerId_hole: {
          roundPlayerId: roundPlayer.id,
          hole: dto.hole,
        },
      },
      update: {
        strokes: dto.strokes,
        putts: dto.putts,
        fairwayHit: dto.fairwayHit,
        gir: dto.gir,
        syncedAt: new Date(),
      },
      create: {
        roundPlayerId: roundPlayer.id,
        userId,
        roundId: dto.roundId,
        hole: dto.hole,
        strokes: dto.strokes,
        putts: dto.putts,
        fairwayHit: dto.fairwayHit,
        gir: dto.gir,
        localId: dto.localId,
        syncedAt: new Date(),
      },
    });

    return score;
  }

  async bulkSync(userId: string, dto: BulkSyncDto) {
    const results = [];

    for (const scoreData of dto.scores) {
      const result = await this.submit(userId, {
        roundId: dto.roundId,
        ...scoreData,
      });
      results.push(result);
    }

    return { synced: results.length, scores: results };
  }

  async getScorecard(roundId: string) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        course: { include: { holes: { orderBy: { number: 'asc' } } } },
        players: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            scores: { orderBy: { hole: 'asc' } },
          },
        },
      },
    });

    if (!round) throw new NotFoundException('Round not found');

    return {
      round: {
        id: round.id,
        status: round.status,
        type: round.type,
        date: round.date,
      },
      course: round.course,
      players: round.players.map(p => ({
        userId: p.user.id,
        userName: p.user.name,
        avatar: p.user.avatar,
        courseHandicap: p.courseHandicap,
        scores: p.scores,
      })),
    };
  }
}
