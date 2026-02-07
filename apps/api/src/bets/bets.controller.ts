import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateBetDto } from './dto/create-bet.dto';

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Get('round/:roundId')
  async getBetsForRound(@Param('roundId') roundId: string) {
    return this.betsService.getBetsForRound(roundId);
  }

  @Post('round/:roundId')
  async createBet(@Param('roundId') roundId: string, @Body() dto: CreateBetDto) {
    return this.betsService.create(roundId, dto);
  }

  @Get(':id/state')
  async getBetState(@Param('id') id: string) {
    return this.betsService.getBetState(id);
  }

  @Post(':id/results')
  async calculateResults(@Param('id') id: string) {
    return this.betsService.calculateBetResults(id);
  }

  @Post(':id/press')
  async activatePress(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('startHole') startHole: number,
  ) {
    return this.betsService.activatePress(id, userId, startHole);
  }
}
