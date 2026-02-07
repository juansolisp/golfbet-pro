import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { simplifyDebts } from '@golfbet/shared';

@Injectable()
export class SettlementsService {
  constructor(private prisma: PrismaService) {}

  async generateSettlements(roundId: string) {
    // Get all bet results for the round
    const betResults = await this.prisma.betResult.findMany({
      where: { bet: { roundId } },
    });

    if (betResults.length === 0) return [];

    // Build debt list from bet results
    const debts = betResults.map(result => ({
      from: result.loserId,
      to: result.winnerId,
      amount: result.amount,
    }));

    // Simplify debts to minimize transactions
    const simplified = simplifyDebts(debts);

    // Delete existing settlements for this round
    await this.prisma.settlement.deleteMany({ where: { roundId } });

    // Create optimized settlements
    const settlements = await Promise.all(
      simplified.map(debt =>
        this.prisma.settlement.create({
          data: {
            roundId,
            fromUserId: debt.from,
            toUserId: debt.to,
            amount: debt.amount,
            status: 'PENDING',
          },
          include: {
            fromUser: { select: { id: true, name: true, avatar: true } },
            toUser: { select: { id: true, name: true, avatar: true } },
          },
        }),
      ),
    );

    return settlements;
  }

  async getSettlements(roundId: string) {
    return this.prisma.settlement.findMany({
      where: { roundId },
      include: {
        fromUser: { select: { id: true, name: true, avatar: true } },
        toUser: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async confirmSettlement(settlementId: string, userId: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id: settlementId },
    });

    if (!settlement) throw new NotFoundException('Settlement not found');

    // Either the payer or receiver can confirm
    if (settlement.fromUserId !== userId && settlement.toUserId !== userId) {
      throw new NotFoundException('Settlement not found');
    }

    return this.prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        fromUser: { select: { id: true, name: true, avatar: true } },
        toUser: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async getUserBalance(userId: string) {
    const [owed, owing] = await Promise.all([
      this.prisma.settlement.aggregate({
        where: { toUserId: userId, status: 'PENDING' },
        _sum: { amount: true },
      }),
      this.prisma.settlement.aggregate({
        where: { fromUserId: userId, status: 'PENDING' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalOwed: owed._sum.amount || 0,
      totalOwing: owing._sum.amount || 0,
      netBalance: (owed._sum.amount || 0) - (owing._sum.amount || 0),
    };
  }
}
