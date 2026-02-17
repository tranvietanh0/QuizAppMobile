# QuizApp Mobile

A comprehensive quiz application built with React Native (Expo) featuring multiplayer, achievements, daily challenges, leaderboards, and offline support.

## Tech Stack

### Mobile App

- **Framework**: Expo (managed workflow)
- **Navigation**: Expo Router (file-based routing)
- **UI**: Gluestack UI
- **State Management**: Zustand + TanStack Query
- **Storage**: MMKV (fast), WatermelonDB (offline sync)
- **Realtime**: Socket.IO Client

### Backend

- **Framework**: NestJS + Fastify
- **Database**: PostgreSQL + Prisma
- **Auth**: Passport.js + JWT
- **Realtime**: Socket.IO

### Admin Panel

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui
- **State**: TanStack Query

## Project Structure

```
QuizAppMobile/
├── apps/
│   ├── mobile/        # React Native (Expo) app
│   ├── backend/       # NestJS API server
│   └── admin/         # Next.js admin panel
├── packages/
│   └── shared/        # Shared types, constants
├── docs/              # Module documentation (Vietnamese)
├── .github/
│   └── workflows/     # CI/CD pipelines
├── package.json       # Monorepo root
└── turbo.json         # Turborepo config
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd QuizAppMobile

# Install dependencies
pnpm install

# Build shared package
pnpm --filter @quizapp/shared build
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm --filter mobile dev
pnpm --filter backend dev
pnpm --filter admin dev
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @quizapp/shared build
```

### Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Documentation

Detailed documentation for each module is available in Vietnamese in the `docs/` directory:

- [01. Project Setup & Monorepo](docs/01-project-setup.md)
- [02. Backend Core Setup](docs/02-backend-core.md)
- [03. Mobile Core Setup](docs/03-mobile-core.md)
- ... (more modules)

## Features

- **Authentication**: Email/password, Google, Facebook, Apple Sign-In
- **Quiz Gameplay**: Multiple choice, true/false, fill-in-the-blank
- **Multiplayer**: Real-time quiz battles with friends
- **Achievements**: Unlock badges and track progress
- **Daily Challenges**: New challenges every day with streak rewards
- **Leaderboards**: Global and category-specific rankings
- **Offline Mode**: Download quizzes and play offline

## CI/CD

- **GitHub Actions**: Automated testing, linting, and deployment
- **EAS Build**: Cloud builds for Android (and iOS)
- **Preview Builds**: Automatic builds on pull requests

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm format`
4. Commit with conventional commit format
5. Create a pull request

## License

Private - All rights reserved
