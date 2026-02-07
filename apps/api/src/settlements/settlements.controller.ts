import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { SettlementsService } from './settlements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('settlements')
@UseGuards(JwtAuthGuard)
export class SettlementsController {
  constructor(private settlementsService: SettlementsService) {}

  @Get('round/:roundId')
  async getSettlements(@Param('roundId') roundId: string) {
    return this.settlementsService.getSettlements(roundId);
  }

  @Post(':id/confirm')
  async confirm(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.settlementsService.confirmSettlement(id, userId);
  }

  @Get('balance')
  async getBalance(@CurrentUser('id') userId: string) {
    return this.settlementsService.getUserBalance(userId);
  }
}
