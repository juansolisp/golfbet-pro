'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_EVENTS } from '@golfbet/shared';
import { useAuthStore } from '@/stores/auth-store';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface UseWebSocketOptions {
  roundId: string;
  onScoreUpdate?: (data: any) => void;
  onLeaderboardUpdate?: (data: any) => void;
  onBetStateUpdate?: (data: any) => void;
  onPlayerJoined?: (data: any) => void;
  onPlayerLeft?: (data: any) => void;
  onPressActivated?: (data: any) => void;
  onRoundCompleted?: (data: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const { accessToken, user } = useAuthStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/rounds`, {
      auth: { userId: user?.id, token: accessToken },
      query: { userId: user?.id },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit(WS_EVENTS.JOIN_ROUND, { roundId: options.roundId }, (response: any) => {
        if (response?.activeUsers) {
          setActiveUsers(response.activeUsers);
        }
      });
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on(WS_EVENTS.SCORE_UPDATED, (data) => options.onScoreUpdate?.(data));
    socket.on(WS_EVENTS.LEADERBOARD_UPDATED, (data) => options.onLeaderboardUpdate?.(data));
    socket.on(WS_EVENTS.BET_STATE_UPDATED, (data) => options.onBetStateUpdate?.(data));
    socket.on(WS_EVENTS.PLAYER_JOINED, (data) => {
      setActiveUsers(prev => [...new Set([...prev, data.userId])]);
      options.onPlayerJoined?.(data);
    });
    socket.on(WS_EVENTS.PLAYER_LEFT, (data) => {
      setActiveUsers(prev => prev.filter(id => id !== data.userId));
      options.onPlayerLeft?.(data);
    });
    socket.on(WS_EVENTS.PRESS_ACTIVATED, (data) => options.onPressActivated?.(data));
    socket.on(WS_EVENTS.ROUND_COMPLETED, (data) => options.onRoundCompleted?.(data));

    socketRef.current = socket;
  }, [options.roundId, accessToken, user?.id]);

  const submitScore = useCallback((data: {
    roundId: string;
    hole: number;
    strokes: number;
    putts?: number;
    fairwayHit?: boolean;
    gir?: boolean;
  }) => {
    socketRef.current?.emit(WS_EVENTS.SUBMIT_SCORE, data);
  }, []);

  const pressBet = useCallback((betId: string, startHole: number) => {
    socketRef.current?.emit(WS_EVENTS.PRESS_BET, { betId, startHole });
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit(WS_EVENTS.LEAVE_ROUND, { roundId: options.roundId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, [options.roundId]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    activeUsers,
    submitScore,
    pressBet,
    disconnect,
  };
}
