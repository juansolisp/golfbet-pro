# CLAUDE.md — SandyBogey (GolfBet Pro)

## CRITICAL RULES

### Quality-First Methodology
- **Be Socratic and diligent**: Before implementing anything, question whether the approach is correct. Ask "why" at every decision point. Challenge assumptions. If something feels like a shortcut or hack, stop and reconsider.
- **Always spawn a dedicated QA validation agent**: After completing any non-trivial change, launch a separate agent (subagent_type=Explore or general-purpose) whose SOLE job is to audit and validate what was just done. This agent must:
  1. Read every file that was modified and verify the changes are consistent and correct
  2. Cross-reference changes against the existing codebase (e.g., if a Prisma model changed, verify all NestJS services, controllers, DTOs, frontend types, and tests are updated)
  3. Check for regressions: did the change break any existing API endpoint, WebSocket gateway, betting engine, or UI component?
  4. Verify the change is consistent with the Prisma schema and shared types package
  5. Report any discrepancies or missed references before proceeding
- **Never assume a bulk change is complete**: If you rename a field, endpoint, or type across the monorepo, the QA agent must grep for the OLD name in all workspaces (`apps/api`, `apps/web`, `packages/shared`) to confirm zero remaining references.
- **Strict correctness over speed**: It is better to be slow and correct than fast and wrong. A single mismatched type between frontend and backend will cause runtime errors for all users.
- **Verify before committing**: Run `npm run lint`, `npm run type-check`, and `npm run test` AND spawn a QA agent before creating any git commit. Never commit untested or unvalidated changes.

### Deployment — CI/CD ONLY
- **ALL deployments go through GitHub Actions** (`.github/workflows/ci.yml`)
- Pipeline: Lint & Type Check → API Tests (PostgreSQL) → Build → Deploy (Vercel)
- **Never deploy manually** — no direct `vercel deploy`, no manual server pushes
- Staging: `develop` branch → Vercel preview | Production: `main` branch → Vercel production

### GitHub CLI Token Fix
- There is an **invalid `GITHUB_TOKEN`** in `~/.zshrc` that overrides the valid keyring token
- **Always run `unset GITHUB_TOKEN`** before any `gh` command, or it will fail with `HTTP 401: Bad credentials`

### Git Workflow
- Remote: `git@github.com-personal:juansolisp/golfbet-pro.git` (SSH)
- `main` → production deploy, `develop` → staging deploy
- Commit messages: `type: description` (fix:, feat:, refactor:, docs:, chore:)

## Project Overview

**SandyBogey** is a Progressive Web App (PWA) for social golf betting. "Bet, Play, Bogey — Golf with your crew." Groups of golfers create, manage, and settle bets automatically during rounds.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo with npm workspaces (`@sandybogey/*`) |
| **Frontend** | Next.js 15, React 19, TypeScript 5.7, Tailwind CSS, Radix UI |
| **Backend** | NestJS 10.4, TypeScript, Prisma ORM 6.1 |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Real-time** | Socket.IO 4.8 (namespaces: `/rounds`, `/feed`, `/nemesis`) |
| **State** | Zustand 5.0 (local) + TanStack Query 5.62 (server) |
| **PWA** | Service Workers + IndexedDB + Background Sync |
| **Auth** | JWT + Google OAuth + NextAuth 5.0-beta |
| **Testing** | Jest 29.7 (API), Vitest 4.0 (Web) |
| **Deploy** | Vercel (frontend), Docker (API) |

## Directory Structure

```
apps/
  api/              # NestJS backend (port 3001)
    src/
      auth/         # JWT + OAuth strategies
      users/        # User management
      groups/       # Golf group management
      courses/      # Course data (20+ Mexico courses)
      rounds/       # Round creation & lifecycle
      scores/       # Score entry & tracking
      bets/         # Betting engine (modular: Nassau, Skins, Match Play)
        engines/    # BaseBetEngine → NassauEngine, SkinsEngine, MatchPlayEngine
      settlements/  # Debt settlement & calculation
      feed/         # Live course feed
      nemesis/      # 1v1 rivalry challenges
      websocket/    # Socket.IO gateways
    prisma/         # Schema + seed
  web/              # Next.js frontend (port 3000)
    src/
      app/          # Next.js App Router
      components/   # React components (ui/, round/, bet/, feed/, nemesis/)
      hooks/        # Custom hooks (use-offline-sync.ts)
      stores/       # Zustand stores
packages/
  shared/           # Shared types, constants, utils (@sandybogey/shared)
  tsconfig/         # Shared TypeScript configs
  eslint-config/    # Shared ESLint rules
```

## CI/CD Pipeline (ci.yml)

1. **lint-and-typecheck**: ESLint + TypeScript across all workspaces
2. **test-api**: Jest tests with PostgreSQL 16 service container
3. **build**: Turbo build all packages (Prisma generate first)
4. **deploy-staging**: Vercel preview (on `develop` push)
5. **deploy-production**: Vercel production (on `main` push)

## Testing

```bash
npm run test                                    # Run all tests (turbo)
npm run test --workspace=@sandybogey/api        # API tests only (Jest)
npm run test --workspace=@sandybogey/web        # Web tests only (Vitest)
npm run lint                                    # Lint all workspaces
npm run type-check                              # Type-check all workspaces
```

## Common Commands

```bash
npm install                          # Install all dependencies
npm run dev                          # Start all apps in dev mode
npm run build                        # Build all apps
npm run db:generate                  # Generate Prisma client
npm run db:migrate                   # Run database migrations
npm run db:seed                      # Seed with demo data
npm run db:studio                    # Open Prisma Studio
docker-compose up -d postgres redis  # Start DB + cache
```

## Key Architecture Decisions

- **Betting engines** are modular (`apps/api/src/bets/engines/`) — each bet type is a separate engine class extending `BaseBetEngine`
- **Debt simplification** algorithm minimizes settlement transactions
- **Offline-first**: scores saved to IndexedDB when offline, synced via Background Sync
- **Dark mode default** (optimized for outdoor OLED screens)
- **Sandy/warm amber** color scheme (`sand-*` Tailwind palette, primary `#E87B0F`)

## Port Configuration

- PostgreSQL: **5433** (avoids conflict with LumenLead on 5432)
- Redis: **6380** (avoids conflict with LumenLead on 6379)
- API: **3001** | Frontend: **3000**

## Demo Users (password: `password123`)

- `juan@sandybogey.com` (PRO tier, handicap 15.4)
- `miguel@sandybogey.com`, `carlos@sandybogey.com`, `roberto@sandybogey.com` (FREE tier)
