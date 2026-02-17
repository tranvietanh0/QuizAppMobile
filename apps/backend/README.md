# QuizApp Backend

Backend API for QuizApp Mobile built with NestJS and Fastify.

## Quick Start

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Copy environment file
cp .env.example .env

# 3. Install dependencies (from root)
pnpm install

# 4. Setup database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Start development server
pnpm dev
```

## API Documentation

- Swagger UI: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/v1/health

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start:prod` | Start production server |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Tech Stack

- NestJS with Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

See full documentation at: `/docs/02-backend-core.md`
