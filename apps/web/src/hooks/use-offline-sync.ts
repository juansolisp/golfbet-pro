'use client';

import { useEffect, useCallback } from 'react';
import { useRoundStore } from '@/stores/round-store';
import { useAuthStore } from '@/stores/auth-store';
import { api } from '@/lib/api';

// IndexedDB wrapper for offline score storage
const DB_NAME = 'golfbet-offline';
const STORE_NAME = 'pending-scores';

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'localId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePendingScore(score: any): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(score);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getPendingScores(): Promise<any[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function clearPendingScores(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function useOfflineSync() {
  const { activeRound, setOnline, clearOfflineQueue } = useRoundStore();
  const { accessToken } = useAuthStore();

  const syncScores = useCallback(async () => {
    if (!accessToken) return;

    try {
      const pending = await getPendingScores();
      if (pending.length === 0) return;

      // Group by roundId
      const byRound = pending.reduce((acc: Record<string, any[]>, score) => {
        if (!acc[score.roundId]) acc[score.roundId] = [];
        acc[score.roundId].push(score);
        return acc;
      }, {});

      for (const [roundId, scores] of Object.entries(byRound)) {
        await api.scores.sync(accessToken, {
          roundId,
          scores: scores.map((s: any) => ({
            hole: s.hole,
            strokes: s.strokes,
            putts: s.putts,
            fairwayHit: s.fairwayHit,
            gir: s.gir,
            localId: s.localId,
          })),
        });
      }

      await clearPendingScores();
      clearOfflineQueue();
    } catch (error) {
      console.error('Sync failed, will retry:', error);
    }
  }, [accessToken, clearOfflineQueue]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncScores();
    };
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, syncScores]);

  const saveScoreOffline = useCallback(async (score: any) => {
    const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await savePendingScore({ ...score, localId, savedAt: new Date().toISOString() });
  }, []);

  return { syncScores, saveScoreOffline };
}
