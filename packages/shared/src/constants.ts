export const APP_NAME = 'GolfBet Pro';
export const APP_DESCRIPTION = 'Plataforma de Apuestas Sociales de Golf';
export const APP_VERSION = '1.0.0';

export const MAX_PLAYERS_FREE = 4;
export const MAX_PLAYERS_PRO = 12;
export const MAX_PLAYERS_CLUB = 12;

export const HOLES_NINE = 9;
export const HOLES_EIGHTEEN = 18;

export const DEFAULT_HANDICAP = 0;
export const MAX_HANDICAP = 54;
export const MIN_HANDICAP = -10; // Plus handicap

export const STABLEFORD_POINTS: Record<string, number> = {
  'double_bogey_or_worse': 0,
  'bogey': 1,
  'par': 2,
  'birdie': 3,
  'eagle': 4,
  'albatross': 5,
};

export const WS_EVENTS = {
  // Client -> Server
  JOIN_ROUND: 'join_round',
  LEAVE_ROUND: 'leave_round',
  SUBMIT_SCORE: 'submit_score',
  PRESS_BET: 'press_bet',
  
  // Server -> Client
  SCORE_UPDATED: 'score_updated',
  LEADERBOARD_UPDATED: 'leaderboard_updated',
  BET_STATE_UPDATED: 'bet_state_updated',
  ROUND_COMPLETED: 'round_completed',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PRESS_ACTIVATED: 'press_activated',
  SKIN_WON: 'skin_won',
  
  // Connection
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    STATS: '/users/stats',
    HANDICAP: '/users/handicap',
  },
  GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    GET: (id: string) => `/groups/${id}`,
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    JOIN: '/groups/join',
    LEAVE: (id: string) => `/groups/${id}/leave`,
    INVITE: (id: string) => `/groups/${id}/invite`,
    MEMBERS: (id: string) => `/groups/${id}/members`,
  },
  COURSES: {
    LIST: '/courses',
    SEARCH: '/courses/search',
    GET: (id: string) => `/courses/${id}`,
  },
  ROUNDS: {
    LIST: '/rounds',
    CREATE: '/rounds',
    GET: (id: string) => `/rounds/${id}`,
    START: (id: string) => `/rounds/${id}/start`,
    COMPLETE: (id: string) => `/rounds/${id}/complete`,
    CANCEL: (id: string) => `/rounds/${id}/cancel`,
    SCORECARD: (id: string) => `/rounds/${id}/scorecard`,
    LEADERBOARD: (id: string) => `/rounds/${id}/leaderboard`,
  },
  SCORES: {
    SUBMIT: '/scores',
    UPDATE: (id: string) => `/scores/${id}`,
    BULK_SYNC: '/scores/sync',
  },
  BETS: {
    LIST: (roundId: string) => `/rounds/${roundId}/bets`,
    CREATE: '/bets',
    GET: (id: string) => `/bets/${id}`,
    PRESS: (id: string) => `/bets/${id}/press`,
    RESULTS: (id: string) => `/bets/${id}/results`,
  },
  SETTLEMENTS: {
    LIST: (roundId: string) => `/rounds/${roundId}/settlements`,
    CONFIRM: (id: string) => `/settlements/${id}/confirm`,
    DISPUTE: (id: string) => `/settlements/${id}/dispute`,
  },
} as const;
