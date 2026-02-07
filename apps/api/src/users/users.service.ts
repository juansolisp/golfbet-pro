import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        handicap: true,
        tier: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatar && { avatar: dto.avatar }),
        ...(dto.handicap !== undefined && { handicap: dto.handicap }),
        ...(dto.pushToken && { pushToken: dto.pushToken }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        handicap: true,
        tier: true,
      },
    });
  }

  async getStats(userId: string) {
    const [totalRounds, totalBetsWon, totalBetsLost, recentRounds] = await Promise.all([
      this.prisma.roundPlayer.count({ where: { userId } }),
      this.prisma.betResult.aggregate({
        where: { winnerId: userId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.betResult.aggregate({
        where: { loserId: userId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.roundPlayer.findMany({
        where: { userId },
        include: {
          round: {
            include: {
              course: true,
            },
          },
          scores: true,
        },
        orderBy: { round: { date: 'desc' } },
        take: 10,
      }),
    ]);

    const totalWinnings = totalBetsWon._sum.amount || 0;
    const totalLosses = totalBetsLost._sum.amount || 0;

    // Calculate scoring average
    const allScores = recentRounds.flatMap(rp => rp.scores);
    const scoringAverage = allScores.length > 0
      ? allScores.reduce((sum, s) => sum + s.strokes, 0) / allScores.length * 18
      : 0;

    return {
      totalRounds,
      betsWon: totalBetsWon._count,
      betsLost: totalBetsLost._count,
      totalWinnings,
      totalLosses,
      netBalance: totalWinnings - totalLosses,
      scoringAverage: Math.round(scoringAverage * 10) / 10,
      recentRounds: recentRounds.map(rp => ({
        roundId: rp.round.id,
        courseName: rp.round.course.name,
        date: rp.round.date,
        status: rp.round.status,
        totalStrokes: rp.scores.reduce((sum, s) => sum + s.strokes, 0),
        holesPlayed: rp.scores.length,
      })),
    };
  }
}
