import { Module } from '@nestjs/common';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';
import { BetsModule } from '../bets/bets.module';
import { SettlementsModule } from '../settlements/settlements.module';

@Module({
  imports: [BetsModule, SettlementsModule],
  controllers: [RoundsController],
  providers: [RoundsService],
  exports: [RoundsService],
})
export class RoundsModule {}
