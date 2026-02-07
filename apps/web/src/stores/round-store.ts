import { create } from 'zustand';

interface Score {
  hole: number;
  strokes: number;
  putts?: number;
  fairwayHit?: boolean;
  gir?: boolean;
  synced: boolean;
  localId?: string;
}

interface ActiveRound {
  id: string;
  courseId: string;
  courseName: string;
  type: 'NINE_HOLES' | 'EIGHTEEN_HOLES';
  currentHole: number;
  scores: Record<number, Score>;
  offlineQueue: Score[];
}

interface RoundState {
  activeRound: ActiveRound | null;
  isOnline: boolean;
  
  setActiveRound: (round: ActiveRound | null) => void;
  setCurrentHole: (hole: number) => void;
  addScore: (score: Score) => void;
  updateScore: (hole: number, score: Partial<Score>) => void;
  markScoreSynced: (hole: number) => void;
  addToOfflineQueue: (score: Score) => void;
  clearOfflineQueue: () => void;
  setOnline: (online: boolean) => void;
}

export const useRoundStore = create<RoundState>()((set, get) => ({
  activeRound: null,
  isOnline: true,

  setActiveRound: (round) => set({ activeRound: round }),

  setCurrentHole: (hole) =>
    set((state) => ({
      activeRound: state.activeRound
        ? { ...state.activeRound, currentHole: hole }
        : null,
    })),

  addScore: (score) =>
    set((state) => {
      if (!state.activeRound) return state;
      return {
        activeRound: {
          ...state.activeRound,
          scores: {
            ...state.activeRound.scores,
            [score.hole]: score,
          },
        },
      };
    }),

  updateScore: (hole, update) =>
    set((state) => {
      if (!state.activeRound) return state;
      const existing = state.activeRound.scores[hole];
      if (!existing) return state;
      return {
        activeRound: {
          ...state.activeRound,
          scores: {
            ...state.activeRound.scores,
            [hole]: { ...existing, ...update },
          },
        },
      };
    }),

  markScoreSynced: (hole) =>
    set((state) => {
      if (!state.activeRound) return state;
      const existing = state.activeRound.scores[hole];
      if (!existing) return state;
      return {
        activeRound: {
          ...state.activeRound,
          scores: {
            ...state.activeRound.scores,
            [hole]: { ...existing, synced: true },
          },
        },
      };
    }),

  addToOfflineQueue: (score) =>
    set((state) => {
      if (!state.activeRound) return state;
      return {
        activeRound: {
          ...state.activeRound,
          offlineQueue: [...state.activeRound.offlineQueue, score],
        },
      };
    }),

  clearOfflineQueue: () =>
    set((state) => {
      if (!state.activeRound) return state;
      return {
        activeRound: {
          ...state.activeRound,
          offlineQueue: [],
        },
      };
    }),

  setOnline: (online) => set({ isOnline: online }),
}));
