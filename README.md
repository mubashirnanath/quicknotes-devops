# QuickNotes

Full-stack notes application — Next.js 15 frontend, Express + Prisma backend, MySQL database.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, TanStack Query, Zustand |
| Backend | Node.js, Express, TypeScript, Sequelize ORM |
| Database | MySQL |
| Auth | JWT (bcrypt password hashing) |

---

## Prerequisites

- Node.js 18+
- MySQL 8.x running locally
- npm or yarn

---

## Local Setup

### 1. Create the database

```sql
CREATE DATABASE quicknotes;
```

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env
```

Edit `backend/.env`:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/quicknotes"
JWT_SECRET="any-long-random-string-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
```

```bash
# Sync database tables (creates tables via Sequelize)
npm run db:sync

# Start dev server (port 3001)
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
```

`frontend/.env.local` is pre-filled for local development:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
# Start dev server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user, returns JWT |
| POST | `/api/auth/login` | — | Login, returns JWT |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

### Notes

All notes routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes?page=1&limit=10&search=` | Paginated list with optional search |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Get single note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

**Response shape (paginated):**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

---

## Project Structure

```
quicknotes/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/          # env.ts, prisma.ts
│       ├── controllers/     # authController, notesController
│       ├── services/        # authService, notesService
│       ├── repositories/    # userRepository, noteRepository
│       ├── middleware/       # auth.ts, error.ts, validate.ts
│       ├── routes/          # authRoutes, notesRoutes
│       ├── validators/      # auth.ts, notes.ts (Zod)
│       ├── utils/           # AppError, responseHelper, jwtHelper, logger
│       ├── types/           # JwtPayload, AuthenticatedRequest
│       └── app.ts
└── frontend/
    ├── app/
    │   ├── (auth)/login + register
    │   ├── (dashboard)/notes
    │   ├── layout.tsx, providers.tsx
    │   └── middleware.ts     # route protection
    ├── components/
    │   ├── ui/               # Button, Input, Modal, Skeleton, Badge
    │   ├── auth/             # LoginForm, RegisterForm
    │   └── notes/            # NoteCard, NoteEditor, NotesList, SearchBar, Pagination, Sidebar
    ├── hooks/                # useNotes, useAuth, useDebounce
    ├── lib/                  # apiClient, validators
    ├── services/             # authService, notesService
    ├── store/                # authStore (zustand)
    ├── types/                # Note, User, ApiResponse
    └── utils/                # cn, formatDate
```

---

## Scripts

### Backend
```bash
npm run dev          # nodemon dev server (auto-syncs DB on start)
npm run build        # compile TypeScript
npm run start        # run compiled output
npm run db:sync      # force-recreate tables via Sequelize sync
```

### Frontend
```bash
npm run dev          # Next.js dev server
npm run build        # production build
npm run type-check   # TypeScript check
npm run lint         # ESLint
```
