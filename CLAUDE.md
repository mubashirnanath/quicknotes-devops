# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

QuickNotes is a full-stack notes application with three separate workspaces:

- **`backend/`** — Express + TypeScript REST API, runs locally on port 3001
- **`frontend/`** — Next.js 15 app, runs locally on port 3000
- **`infra/`** — AWS CDK stack (TypeScript) that deploys the backend as a Lambda + API Gateway, with a MySQL EC2 instance in a VPC

## Commands

All commands must be run from within the respective subdirectory.

### Backend
```bash
npm run dev        # nodemon dev server (port 3001)
npm run build      # compile TypeScript to dist/
npm run start      # run compiled dist/server.js
npm run db:sync    # force-recreate Sequelize tables (destructive)
```

### Frontend
```bash
npm run dev        # Next.js dev server (port 3000)
npm run build      # production build
npm run lint       # ESLint
npm run type-check # TypeScript check (tsc --noEmit)
```

### Infra (AWS CDK)
```bash
npm run build      # compile TypeScript
npm run test       # Jest unit tests
npx cdk synth      # synthesize CloudFormation template
npx cdk diff       # compare with deployed stack
npx cdk deploy     # deploy to AWS
```

## Architecture

### Backend

The Express app (`src/app.ts`) is dual-mode: it runs as a plain HTTP server locally (`src/server.ts`) and as an AWS Lambda function in production (`src/lambda.ts` via `serverless-http`).

Request flow: `routes/` → `middleware/validate.ts` (Zod) → `controllers/` → `services/` → `repositories/` → Sequelize models

Key patterns:
- **ORM**: Sequelize with MySQL (`src/config/database.ts`). The `db:sync` script calls `syncDatabase(true)` which force-drops and recreates all tables.
- **Auth**: JWT via `src/utils/jwtHelper.ts`; `src/middleware/auth.ts` attaches the user to `AuthenticatedRequest`.
- **Validation**: Zod schemas in `src/validators/`; applied via `src/middleware/validate.ts`.
- **Errors**: `AppError` class + centralized `errorHandler` middleware; `responseHelper` for consistent response shapes.
- **Env**: All env vars loaded once in `src/config/env.ts` and exported as a typed `env` object.

### Frontend

Next.js 15 App Router with route groups:
- `app/(auth)/` — login and register pages (public)
- `app/(dashboard)/notes/` — main notes view (protected)
- `middleware.ts` — redirects unauthenticated users away from dashboard routes

State and data flow:
- **Server state**: TanStack Query (`lib/queryClient.ts`) via hooks in `hooks/useNotes.ts` and `hooks/useAuth.ts`
- **Client state**: Zustand auth store (`store/authStore.ts`) holds JWT token and user
- **API calls**: Axios instance in `lib/apiClient.ts` (injects `Authorization` header from store)
- **Forms**: react-hook-form + Zod (`lib/validators.ts`) via `@hookform/resolvers`

### Infrastructure (AWS CDK)

`infra/lib/infra-stack.ts` defines a single stack:
- VPC with public + private subnets (1 NAT gateway)
- EC2 t3.micro (Ubuntu 24.04) running MySQL in the private subnet, managed via SSM
- Lambda (`NodejsFunction`) bundled with esbuild, targeting the backend's `src/lambda.ts` entry point
- API Gateway (proxy integration) fronting the Lambda
- Secrets Manager secret `quicknotes/prod` holds `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`

The CDK `bundling` config explicitly includes `sequelize` and `mysql2` as native node modules (not bundled by esbuild).

## Local Setup Notes

- Backend requires a `backend/.env` file with `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV`
- Frontend requires `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- MySQL database named `quicknotes` must exist before running `db:sync`
- The README's project structure references a `prisma/` directory, but the backend actually uses Sequelize — ignore references to Prisma
