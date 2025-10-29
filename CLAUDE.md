# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack SaaS boilerplate built with Fastify, tRPC, React 19, and Drizzle ORM. It uses npm workspaces to manage a monorepo structure with separate client, server, and shared packages.

## Development Commands

### Setup

#### Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Wait for database to be ready (check with)
docker-compose ps

# Install dependencies
npm i

# Setup database (applies Drizzle schema to Postgres)
npm run push

# Seed the database with initial data
npm run seed
```

#### Manual PostgreSQL Setup
If you prefer to use your own PostgreSQL installation:
```bash
# Create database manually
psql -U your_user
CREATE DATABASE fsb;

# Update server.env with your credentials
# Then run:
npm i
npm run push
npm run seed
```

### Development
```bash
# Run both client and server concurrently
npm run dev

# Run client only (Vite dev server on port 3000)
npm run dev:client

# Run server only (Fastify server on port 2022)
npm run dev:server
```

### Build & Deploy
```bash
# Build everything for production
npm run build

# Build individual workspaces
npm run build:backend    # Builds drizzle, zod, and server
npm run build:frontend   # Builds backend + client
npm run build:server
npm run build:client

# Start production servers
npm run start            # Runs both client and server
npm run start:client     # Vite preview server
npm run start:server     # Node.js server
```

### Testing
```bash
# Run E2E tests with Playwright (app must be running)
npm run test
```

### Linting
```bash
# Lint server code
npm run lint -w server

# Lint client code
npm run lint -w client
```

### Database Management
```bash
# Push schema changes to database
npm run push

# Seed database
npm run seed

# Docker database commands
docker-compose up -d           # Start database
docker-compose down            # Stop database
docker-compose down -v         # Stop and remove volumes (deletes data)
docker-compose logs postgres   # View database logs
```

## Workspace Structure

The project uses npm workspaces with the following packages:

- **client/** - React 19 frontend with Vite, React Router v7, Tailwind v4
- **server/** - Fastify backend with tRPC
- **packages/drizzle/** - Database schema, migrations, and ORM setup
- **packages/zod/** - Shared Zod validation schemas (referred to as `@fsb/shared`)
- **tests-e2e/** - Playwright E2E tests

## Architecture

### tRPC Setup

The project uses tRPC for end-to-end type-safe APIs:

- **Server-side**:
  - `server/src/trpc.ts` - tRPC initialization with context typing
  - `server/src/context.ts` - Context creation with DB connection, auth session, and user
  - `server/src/router/index.ts` - Main router that merges all sub-routers
  - Sub-routers in `server/src/router/`: `userRouter`, `sessionRouter`, `healthRouter`, `gameRouter`, `messageRouter`

- **Client-side**:
  - `client/src/lib/trpc.ts` - tRPC client setup
  - `client/src/App.tsx` - tRPC provider configuration with httpBatchLink and httpSubscriptionLink

- **Procedures**:
  - `publicProcedure` - No authentication required
  - `protectedProcedure` - Requires authenticated user
  - `adminProcedure` - Requires admin role

### Authentication

Uses Better Auth library with email/password authentication:

- **Server**: `server/src/lib/auth.ts` configures Better Auth with Drizzle adapter
- **Client**: `client/src/lib/auth-client.ts` creates auth client
- **Auth routes**: Handled via Fastify route at `/api/auth/*` in `server/src/index.ts`
- **Session management**: Context middleware in `server/src/context.ts` checks auth session and loads user

### Database

- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: Defined in `packages/drizzle/src/db/schema.ts`
- **Tables**: `user`, `session`, `account`, `verification` (Better Auth tables)
- **Connection**: Database instance created in `server/src/context.ts` and passed via tRPC context
- **Type safety**: Drizzle generates TypeScript types from schema

### State Management

- **Server state**: TanStack Query (React Query) via tRPC
- **Client state**: Zustand (e.g., `client/src/store/useThemeStore.ts` for theme)

### Environment Configuration

- **Server**: `server.env` at project root
  - `DATABASE_URL` - Postgres connection string (default for Docker: `postgresql://fsb_user:fsb_password@localhost:5432/fsb`)
  - `SSL_MODE` - SSL mode for database (leave empty for local development)
  - `PORT` - Server port (default: 2022)
  - `CLIENT_URL` - Client URL for CORS (default: http://localhost:3000)
  - `BETTER_AUTH_SECRET` - Secret for Better Auth sessions
  - `NODE_ENV` - Environment mode (development/production)

- **Client**: `client/client.env`
  - `VITE_URL_BACKEND` - Backend URL (default: http://localhost:2022)

### Docker Setup

The project includes a `docker-compose.yml` for easy PostgreSQL setup:
- **Container**: `fsb-postgres`
- **User**: `fsb_user`
- **Password**: `fsb_password`
- **Database**: `fsb`
- **Port**: 5432 (mapped to host)
- **Volume**: `postgres_data` (persists data between restarts)

### Key Architectural Patterns

1. **Monorepo with workspaces**: Shared code is in packages, client and server are separate workspaces
2. **End-to-end type safety**: Types flow from Drizzle schema → tRPC procedures → React components
3. **Context injection**: DB, auth session, and user are injected via tRPC context
4. **Router composition**: tRPC routers are composed in `server/src/router/index.ts`
5. **Credential handling**: Cookies are used for auth with `credentials: 'include'` in fetch

## Important Notes

- Server must be built before client (client imports types from `../../server/src/router`)
- Database must be running and `fsb` database created before running `npm run push`
- For production: uncomment `# .env` in `.gitignore` to protect credentials
- The stack is designed for web apps, not traditional websites (not SEO-friendly)
- Frontend builds to static files that can be deployed to S3 or similar
