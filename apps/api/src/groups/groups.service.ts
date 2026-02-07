import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { generateInviteCode } from '@golfbet/shared';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateGroupDto) {
    const inviteCode = generateInviteCode();

    const group = await this.prisma.group.create({
      data: {
        name: dto.name,
        description: dto.description,
        inviteCode,
        creatorId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true, handicap: true } } },
        },
      },
    });

    return group;
  }

  async findAllForUser(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, avatar: true, handicap: true } } },
        },
        _count: { select: { rounds: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true, handicap: true, tier: true } } },
        },
        rounds: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            course: true,
            players: { include: { user: { select: { id: true, name: true } } } },
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found');

    const isMember = group.members.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Not a member of this group');

    return group;
  }

  async update(groupId: string, userId: string, dto: UpdateGroupDto) {
    const membership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Only owners and admins can update the group');
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async join(userId: string, inviteCode: string) {
    const group = await this.prisma.group.findUnique({
      where: { inviteCode },
      include: { members: true },
    });

    if (!group) throw new NotFoundException('Invalid invite code');

    const alreadyMember = group.members.some(m => m.userId === userId);
    if (alreadyMember) throw new ConflictException('Already a member of this group');

    await this.prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
        role: 'MEMBER',
      },
    });

    return this.findById(group.id, userId);
  }

  async leave(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });

    if (!membership) throw new NotFoundException('Not a member of this group');

    if (membership.role === 'OWNER') {
      const otherMembers = await this.prisma.groupMember.findMany({
        where: { groupId, userId: { not: userId } },
        orderBy: { joinedAt: 'asc' },
      });

      if (otherMembers.length > 0) {
        // Transfer ownership to the next oldest member
        await this.prisma.groupMember.update({
          where: { id: otherMembers[0].id },
          data: { role: 'OWNER' },
        });
      }
    }

    await this.prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });

    return { success: true };
  }

  async getMembers(groupId: string) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, handicap: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
