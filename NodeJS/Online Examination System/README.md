## Online Examination System (MERN)

This repo is an npm-workspaces monorepo:

- `server/`: Express + MongoDB (Mongoose) + JWT + Socket.io
- `client/`: React (Vite) + Tailwind + GSAP + Lenis + Three.js

### Quickstart (backend)

1) Copy env file:

- `server/.env.example` → `server/.env`

2) Run MongoDB locally (or point `MONGODB_URI` to your cluster).

3) Start API:

```bash
npm run dev -w server
```

Health check: `GET /health`

### Core API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/questions` (Admin)
- `GET /api/questions` (Admin)
- `POST /api/exams` (Admin)
- `POST /api/exams/:id/publish` (Admin)
- `POST /api/exams/:id/start` (Student)
- `POST /api/exams/attempts/:attemptId/answer` (Student)
- `POST /api/exams/attempts/:attemptId/submit` (Student)

