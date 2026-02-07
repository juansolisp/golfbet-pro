import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateRoundDto } from './dto/create-round.dto';

@Controller('rounds')
@UseGuards(JwtAuthGuard)
export class RoundsController {
  constructor(private roundsService: RoundsService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateRoundDto) {
    return this.roundsService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.roundsService.findForUser(userId, page || 1, pageSize || 20);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roundsService.findById(id);
  }

  @Post(':id/start')
  async start(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.roundsService.startRound(id, userId);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.roundsService.completeRound(id, userId);
  }

  @Get(':id/leaderboard')
  async leaderboard(@Param('id') id: string) {
    return this.roundsService.getLeaderboard(id);
  }
}
