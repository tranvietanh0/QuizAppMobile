# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuizApp Mobile is a full-stack quiz application with:

- **Mobile App**: React Native (Expo) with file-based routing
- **Backend API**: NestJS with Fastify and PostgreSQL
- **Admin Panel**: Next.js (not yet implemented)
- **Shared Package**: TypeScript types and constants shared across apps

## Development Commands

### Monorepo (Root)

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps in development
pnpm build                # Build all packages
pnpm lint                 # Lint all packages
pnpm lint:fix             # Fix lint issues
pnpm format               # Format code with Prettier
pnpm format:check         # Check formatting
```

### Mobile App (apps/mobile)

```bash
pnpm --filter mobile dev           # Start Expo dev server
pnpm --filter mobile android       # Run on Android
pnpm --filter mobile ios           # Run on iOS
pnpm --filter mobile typecheck     # TypeScript check
pnpm --filter mobile build:preview # EAS preview build (Android)
pnpm --filter mobile build:prod    # EAS production build
```

### Backend (apps/backend)

```bash
pnpm --filter backend dev          # Start with hot reload
pnpm --filter backend start:prod   # Start production server
pnpm --filter backend test         # Run unit tests
pnpm --filter backend test:watch   # Watch mode
pnpm --filter backend test:cov     # Tests with coverage
pnpm --filter backend test:e2e     # End-to-end tests

# Database (Prisma)
pnpm --filter backend db:generate  # Generate Prisma client
pnpm --filter backend db:migrate   # Run migrations (dev)
pnpm --filter backend db:migrate:prod  # Deploy migrations
pnpm --filter backend db:push      # Push schema without migrations
pnpm --filter backend db:studio    # Open Prisma Studio
pnpm --filter backend db:seed      # Seed database
pnpm --filter backend db:reset     # Reset database
```

### Shared Package

```bash
pnpm --filter @quizapp/shared build  # Build shared types (required before other builds)
```

## Architecture

### Monorepo Structure

- **Turborepo** for task orchestration with remote caching
- **pnpm workspaces** for package management
- Shared types in `packages/shared` must be built before other apps

### Mobile App (apps/mobile)

- **Expo Router** for file-based navigation in `app/` directory
- **Route Groups**: `(auth)` for auth screens, `(main)/(tabs)` for main app
- **State Management**: Zustand stores in `src/stores/`
- **API Layer**: TanStack Query + Axios in `src/services/`
- **UI Components**: Gluestack UI with custom theme in `src/theme/`
- Path alias: `@/` maps to `src/`

### Backend (apps/backend)

- **NestJS Modules**: Each feature is a self-contained module
- **Prisma ORM**: Schema at `prisma/schema.prisma`
- **Auth**: JWT with access/refresh token strategy
- **Common utilities**: Guards, decorators, filters, interceptors in `src/common/`
- **Config**: Joi validation schema in `src/config/`
- API docs at `/api` when `SWAGGER_ENABLED=true`

### Data Models

Key entities: User, RefreshToken, Category, Question, QuizSession, UserAnswer

- Quiz supports multiple types: MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK
- Difficulty levels: EASY, MEDIUM, HARD
- Session tracking with score calculation

## Commit Convention

Uses Conventional Commits (enforced via commitlint):

```
type(scope): message
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Environment Setup

### Backend Requirements

Copy `apps/backend/.env.example` to `.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: Auth secrets
- `PORT`: Server port (default 3000)

### Mobile Requirements

- Expo CLI (`npx expo`)
- EAS CLI for builds (`eas build`)

## CI/CD

GitHub Actions runs on push to main and PRs:

1. **Lint**: ESLint + Prettier check
2. **Typecheck**: TypeScript validation
3. **Test**: Backend unit tests with PostgreSQL service
4. **Build**: All packages
5. **E2E**: End-to-end tests (main branch only)

Requires `TURBO_TOKEN` and `TURBO_TEAM` for remote caching.
