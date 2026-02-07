import { Module } from '@nestjs/common';
import { RoundGateway } from './round.gateway';
import { ScoresModule } from '../scores/scores.module';
import { BetsModule } from '../bets/bets.module';

@Module({
  imports: [ScoresModule, BetsModule],
  providers: [RoundGateway],
  exports: [RoundGateway],
})
export class WebsocketModule {}
