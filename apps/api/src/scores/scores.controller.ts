import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { BulkSyncDto } from './dto/bulk-sync.dto';

@Controller('scores')
@UseGuards(JwtAuthGuard)
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Post()
  async submit(@CurrentUser('id') userId: string, @Body() dto: SubmitScoreDto) {
    return this.scoresService.submit(userId, dto);
  }

  @Post('sync')
  async bulkSync(@CurrentUser('id') userId: string, @Body() dto: BulkSyncDto) {
    return this.scoresService.bulkSync(userId, dto);
  }

  @Get('round/:roundId')
  async getScorecard(@Param('roundId') roundId: string) {
    return this.scoresService.getScorecard(roundId);
  }
}
