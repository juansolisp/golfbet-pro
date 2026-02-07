-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'CLUB');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "RoundType" AS ENUM ('NINE_HOLES', 'EIGHTEEN_HOLES');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BetType" AS ENUM ('NASSAU', 'SKINS', 'MATCH_PLAY', 'WOLF', 'STABLEFORD', 'VEGAS');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SideBetType" AS ENUM ('CLOSEST_TO_PIN', 'LONGEST_DRIVE', 'GREENIE', 'SANDY', 'BARKIE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DISPUTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "handicap" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passwordHash" TEXT,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "googleId" TEXT,
    "appleId" TEXT,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "pushToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "inviteCode" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "slopeRating" DOUBLE PRECISION NOT NULL DEFAULT 113,
    "courseRating" DOUBLE PRECISION NOT NULL DEFAULT 72,
    "totalPar" INTEGER NOT NULL DEFAULT 72,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holes" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "yards" INTEGER NOT NULL,
    "handicapIndex" INTEGER NOT NULL,

    CONSTRAINT "holes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "type" "RoundType" NOT NULL DEFAULT 'EIGHTEEN_HOLES',
    "status" "RoundStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round_players" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseHandicap" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "round_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "roundPlayerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "hole" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "putts" INTEGER,
    "fairwayHit" BOOLEAN,
    "gir" BOOLEAN,
    "localId" TEXT,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "type" "BetType" NOT NULL,
    "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bet_results" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "loserId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "segment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bet_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nassau_presses" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "startHole" INTEGER NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nassau_presses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_bets" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "type" "SideBetType" NOT NULL,
    "config" JSONB NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "side_bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_bet_results" (
    "id" TEXT NOT NULL,
    "sideBetId" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "hole" INTEGER NOT NULL,
    "details" TEXT,

    CONSTRAINT "side_bet_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_appleId_key" ON "users"("appleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "groups_inviteCode_key" ON "groups"("inviteCode");

-- CreateIndex
CREATE INDEX "groups_inviteCode_idx" ON "groups"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON "group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "courses_name_idx" ON "courses"("name");

-- CreateIndex
CREATE INDEX "courses_city_state_idx" ON "courses"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "holes_courseId_number_key" ON "holes"("courseId", "number");

-- CreateIndex
CREATE INDEX "rounds_groupId_idx" ON "rounds"("groupId");

-- CreateIndex
CREATE INDEX "rounds_status_idx" ON "rounds"("status");

-- CreateIndex
CREATE INDEX "rounds_date_idx" ON "rounds"("date");

-- CreateIndex
CREATE UNIQUE INDEX "round_players_roundId_userId_key" ON "round_players"("roundId", "userId");

-- CreateIndex
CREATE INDEX "scores_roundId_idx" ON "scores"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "scores_roundPlayerId_hole_key" ON "scores"("roundPlayerId", "hole");

-- CreateIndex
CREATE INDEX "bets_roundId_idx" ON "bets"("roundId");

-- CreateIndex
CREATE INDEX "bet_results_betId_idx" ON "bet_results"("betId");

-- CreateIndex
CREATE INDEX "nassau_presses_betId_idx" ON "nassau_presses"("betId");

-- CreateIndex
CREATE INDEX "side_bets_roundId_idx" ON "side_bets"("roundId");

-- CreateIndex
CREATE INDEX "settlements_roundId_idx" ON "settlements"("roundId");

-- CreateIndex
CREATE INDEX "settlements_fromUserId_idx" ON "settlements"("fromUserId");

-- CreateIndex
CREATE INDEX "settlements_toUserId_idx" ON "settlements"("toUserId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holes" ADD CONSTRAINT "holes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_roundPlayerId_fkey" FOREIGN KEY ("roundPlayerId") REFERENCES "round_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_results" ADD CONSTRAINT "bet_results_betId_fkey" FOREIGN KEY ("betId") REFERENCES "bets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_results" ADD CONSTRAINT "bet_results_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet_results" ADD CONSTRAINT "bet_results_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nassau_presses" ADD CONSTRAINT "nassau_presses_betId_fkey" FOREIGN KEY ("betId") REFERENCES "bets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_bets" ADD CONSTRAINT "side_bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_bet_results" ADD CONSTRAINT "side_bet_results_sideBetId_fkey" FOREIGN KEY ("sideBetId") REFERENCES "side_bets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_bet_results" ADD CONSTRAINT "side_bet_results_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
