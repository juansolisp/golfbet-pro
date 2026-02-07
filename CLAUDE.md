# GolfBet Pro

## Project Description
GolfBet Pro is a Progressive Web App (PWA) for social golf betting. It allows groups of golfers to create, manage, and settle bets automatically during rounds of golf.

## Tech Stack
- **Monorepo**: Turborepo with npm workspaces
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Radix UI
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **Real-time**: Socket.IO WebSockets
- **State**: Zustand (local) + React Query/TanStack Query (server)
- **PWA**: Service Workers + IndexedDB for offline support
- **Auth**: JWT with refresh tokens, Google OAuth

## Project Structure
```
apps/
  web/          # Next.js frontend (port 3000)
  api/          # NestJS backend (port 3001)
packages/
  shared/       # Shared types, constants, utils
  tsconfig/     # Shared TypeScript configs
  eslint-config/ # Shared ESLint config
```

## Development Commands
```bash
npm install              # Install all dependencies
npm run dev              # Start all apps in dev mode
npm run build            # Build all apps
npm run lint             # Lint all packages
npm run type-check       # Type check all packages
npm run test             # Run all tests
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with demo data
npm run db:studio        # Open Prisma Studio
docker-compose up -d postgres redis  # Start database and cache
```

## Key Architecture Decisions
- Betting engines are modular (apps/api/src/bets/engines/) - each bet type is a separate engine class
- Debt simplification algorithm minimizes settlement transactions
- Offline-first: scores saved to IndexedDB when offline, synced via Background Sync
- Dark mode is default (optimized for outdoor OLED screens)
- Mobile-first responsive design with thumb-friendly zones

## Environment Setup
Copy `.env.example` to `.env` in root, `apps/web/.env.example` to `apps/web/.env.local`, and `apps/api/.env.example` to `apps/api/.env`
