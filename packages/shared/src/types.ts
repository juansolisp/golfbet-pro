// ===== Enums =====

export enum RoundType {
  NINE_HOLES = 'NINE_HOLES',
  EIGHTEEN_HOLES = 'EIGHTEEN_HOLES',
}

export enum RoundStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BetType {
  NASSAU = 'NASSAU',
  SKINS = 'SKINS',
  MATCH_PLAY = 'MATCH_PLAY',
  WOLF = 'WOLF',
  STABLEFORD = 'STABLEFORD',
  VEGAS = 'VEGAS',
}

export enum BetStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SettlementStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
}

export enum GroupRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  CLUB = 'CLUB',
}

export enum SideBetType {
  CLOSEST_TO_PIN = 'CLOSEST_TO_PIN',
  LONGEST_DRIVE = 'LONGEST_DRIVE',
  GREENIE = 'GREENIE',
  SANDY = 'SANDY',
  BARKIE = 'BARKIE',
  CUSTOM = 'CUSTOM',
}

// ===== Interfaces =====

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  handicap: number;
  tier: SubscriptionTier;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  inviteCode: string;
  members: GroupMember[];
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  user: UserProfile;
  role: GroupRole;
  joinedAt: string;
}

export interface Course {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  holes: HoleInfo[];
  slopeRating: number;
  courseRating: number;
}

export interface HoleInfo {
  number: number;
  par: number;
  yards: number;
  handicapIndex: number;
}

export interface Round {
  id: string;
  courseId: string;
  course: Course;
  groupId: string;
  type: RoundType;
  status: RoundStatus;
  date: string;
  players: RoundPlayer[];
  bets: Bet[];
  createdAt: string;
}

export interface RoundPlayer {
  userId: string;
  user: UserProfile;
  courseHandicap: number;
  scores: Score[];
}

export interface Score {
  id: string;
  hole: number;
  strokes: number;
  putts?: number;
  fairwayHit?: boolean;
  gir?: boolean;
  syncedAt?: string;
}

export interface Bet {
  id: string;
  roundId: string;
  type: BetType;
  status: BetStatus;
  config: BetConfig;
  results: BetResult[];
}

export interface BetConfig {
  amount: number;
  useHandicap: boolean;
  nassauConfig?: NassauConfig;
  skinsConfig?: SkinsConfig;
  matchPlayConfig?: MatchPlayConfig;
}

export interface NassauConfig {
  frontNineAmount: number;
  backNineAmount: number;
  totalAmount: number;
  autoPress: boolean;
  pressAfterDown: number; // Number of holes down to trigger press
  maxPresses: number;
}

export interface SkinsConfig {
  skinValue: number;
  carryOver: boolean;
}

export interface MatchPlayConfig {
  isTeamMatch: boolean;
  teams?: { teamA: string[]; teamB: string[] };
  bestBall: boolean;
  pointValue: number;
}

export interface BetResult {
  id: string;
  betId: string;
  winnerId: string;
  loserId: string;
  amount: number;
  description: string;
}

export interface Settlement {
  id: string;
  roundId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: SettlementStatus;
  confirmedAt?: string;
}

// ===== WebSocket Events =====

export interface WSScoreUpdate {
  roundId: string;
  userId: string;
  hole: number;
  strokes: number;
  putts?: number;
  fairwayHit?: boolean;
  gir?: boolean;
}

export interface WSLeaderboardUpdate {
  roundId: string;
  leaderboard: LeaderboardEntry[];
  betStates: BetStateUpdate[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalStrokes: number;
  netStrokes: number;
  thru: number;
  toPar: number;
  holesPlayed: number;
}

export interface BetStateUpdate {
  betId: string;
  type: BetType;
  currentState: Record<string, unknown>;
}

export interface NassauState {
  frontNine: { leader: string; margin: number };
  backNine: { leader: string; margin: number };
  overall: { leader: string; margin: number };
  presses: PressState[];
}

export interface PressState {
  id: string;
  startHole: number;
  initiatedBy: string;
  currentLeader: string;
  margin: number;
}

export interface SkinsState {
  skins: SkinResult[];
  carryOverValue: number;
  pendingHoles: number;
}

export interface SkinResult {
  hole: number;
  winnerId: string | null;
  value: number;
  carried: boolean;
}

export interface MatchPlayState {
  status: string; // e.g., "2 UP", "AS", "3 & 2"
  holesRemaining: number;
  holeResults: MatchPlayHoleResult[];
}

export interface MatchPlayHoleResult {
  hole: number;
  winner: string | null; // userId or null for halved
}

// ===== API Request/Response Types =====

export interface CreateRoundRequest {
  courseId: string;
  groupId: string;
  type: RoundType;
  playerIds: string[];
  bets: CreateBetRequest[];
}

export interface CreateBetRequest {
  type: BetType;
  config: BetConfig;
}

export interface SubmitScoreRequest {
  roundId: string;
  hole: number;
  strokes: number;
  putts?: number;
  fairwayHit?: boolean;
  gir?: boolean;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface JoinGroupRequest {
  inviteCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
