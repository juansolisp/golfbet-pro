import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { CoursesModule } from './courses/courses.module';
import { RoundsModule } from './rounds/rounds.module';
import { ScoresModule } from './scores/scores.module';
import { BetsModule } from './bets/bets.module';
import { SettlementsModule } from './settlements/settlements.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    CoursesModule,
    RoundsModule,
    ScoresModule,
    BetsModule,
    SettlementsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
