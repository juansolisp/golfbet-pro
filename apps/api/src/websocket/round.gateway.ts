import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WS_EVENTS } from '@golfbet/shared';
import { ScoresService } from '../scores/scores.service';
import { BetsService } from '../bets/bets.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  roundId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/rounds',
})
export class RoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Set<string>>(); // roundId -> Set<userId>

  constructor(
    private scoresService: ScoresService,
    private betsService: BetsService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    // Extract userId from auth token (simplified - in production use JWT verification)
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    if (!userId) {
      client.disconnect();
      return;
    }
    client.userId = userId as string;
    console.warn(`Client connected: ${client.id} (User: ${userId})`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.roundId && client.userId) {
      const roundUsers = this.activeUsers.get(client.roundId);
      if (roundUsers) {
        roundUsers.delete(client.userId);
        if (roundUsers.size === 0) {
          this.activeUsers.delete(client.roundId);
        }
      }

      // Notify others
      client.to(client.roundId).emit(WS_EVENTS.PLAYER_LEFT, {
        userId: client.userId,
        roundId: client.roundId,
      });
    }
    console.warn(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(WS_EVENTS.JOIN_ROUND)
  async handleJoinRound(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roundId: string },
  ) {
    const { roundId } = data;
    client.roundId = roundId;

    // Join socket room
    await client.join(roundId);

    // Track active users
    if (!this.activeUsers.has(roundId)) {
      this.activeUsers.set(roundId, new Set());
    }
    this.activeUsers.get(roundId)!.add(client.userId!);

    // Notify others
    client.to(roundId).emit(WS_EVENTS.PLAYER_JOINED, {
      userId: client.userId,
      roundId,
    });

    // Send current scorecard to the joining player
    const scorecard = await this.scoresService.getScorecard(roundId);
    client.emit('scorecard_sync', scorecard);

    return { success: true, activeUsers: Array.from(this.activeUsers.get(roundId)!) };
  }

  @SubscribeMessage(WS_EVENTS.LEAVE_ROUND)
  async handleLeaveRound(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roundId: string },
  ) {
    const { roundId } = data;
    await client.leave(roundId);

    const roundUsers = this.activeUsers.get(roundId);
    if (roundUsers) {
      roundUsers.delete(client.userId!);
    }

    client.to(roundId).emit(WS_EVENTS.PLAYER_LEFT, {
      userId: client.userId,
      roundId,
    });

    client.roundId = undefined;
    return { success: true };
  }

  @SubscribeMessage(WS_EVENTS.SUBMIT_SCORE)
  async handleSubmitScore(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roundId: string; hole: number; strokes: number; putts?: number; fairwayHit?: boolean; gir?: boolean },
  ) {
    if (!client.userId) return { error: 'Not authenticated' };

    try {
      // Save score to database
      const score = await this.scoresService.submit(client.userId, {
        roundId: data.roundId,
        hole: data.hole,
        strokes: data.strokes,
        putts: data.putts,
        fairwayHit: data.fairwayHit,
        gir: data.gir,
      });

      // Broadcast score update to all players in the round
      this.server.to(data.roundId).emit(WS_EVENTS.SCORE_UPDATED, {
        roundId: data.roundId,
        userId: client.userId,
        hole: data.hole,
        strokes: data.strokes,
        putts: data.putts,
        score,
      });

      // Update bet states and broadcast
      const bets = await this.betsService.getBetsForRound(data.roundId);
      for (const bet of bets) {
        if (bet.status === 'ACTIVE') {
          const betState = await this.betsService.getBetState(bet.id);
          this.server.to(data.roundId).emit(WS_EVENTS.BET_STATE_UPDATED, {
            betId: bet.id,
            type: bet.type,
            state: betState,
          });
        }
      }

      return { success: true, score };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @SubscribeMessage(WS_EVENTS.PRESS_BET)
  async handlePressBet(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { betId: string; startHole: number },
  ) {
    if (!client.userId) return { error: 'Not authenticated' };

    try {
      const press = await this.betsService.activatePress(data.betId, client.userId, data.startHole);

      // Broadcast press activation to all players
      if (client.roundId) {
        this.server.to(client.roundId).emit(WS_EVENTS.PRESS_ACTIVATED, {
          betId: data.betId,
          press,
          initiatedBy: client.userId,
        });
      }

      return { success: true, press };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Method to broadcast round completion from the rounds service
  broadcastRoundCompleted(roundId: string, results: any) {
    this.server.to(roundId).emit(WS_EVENTS.ROUND_COMPLETED, results);
  }
}
