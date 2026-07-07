<h1 align="center">
  <br>
  🌊 Flowdesk
  <br>
</h1>

<h4 align="center">A Personal Productivity OS — Projects, Tasks, Notes, AI Assistant & Analytics in one sleek interface.</h4>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white">
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socket.io">
  <img alt="License" src="https://img.shields.io/badge/license-ISC-blue">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-api-overview">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗂 **Project Management** | Organize work into projects with status tracking |
| ✅ **Task Manager** | Full task CRUD with priority levels, due dates & drag-and-drop reordering |
| 📝 **Notes** | Rich markdown notes scoped to individual projects |
| 🤖 **AI Assistant** | Claude-powered productivity assistant (Anthropic API) |
| 📊 **Analytics Dashboard** | Weekly task distribution, overview stats & activity feed |
| 📅 **Calendar View** | Date-based task planning and visualization |
| 🎯 **Focus Mode** | Distraction-free work sessions |
| 🌙 **Dark / Light Theme** | Smooth, persistent theme toggle |
| 🔄 **Real-time Sync** | Socket.io-powered live updates across browser tabs |
| 🔐 **Auth System** | JWT-based authentication with access & refresh tokens |

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, TailwindCSS 4, Framer Motion, GSAP |
| **UI Components** | Radix UI, Lucide React, Recharts |
| **State & Data** | Zustand, TanStack Query v5 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **AI** | Anthropic Claude SDK |
| **Auth** | JWT (access + refresh tokens), bcryptjs |
| **Deployment** | Vercel (frontend), configurable backend host |

---

## 📁 Project Structure

```
flowdesk/
├── app/                        # React frontend (Vite + TypeScript)
│   └── src/
│       ├── api/                # Axios API client & request helpers
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level page components
│       │   ├── DashboardPage.tsx
│       │   ├── ProjectsPage.tsx
│       │   ├── TasksPage.tsx
│       │   ├── NotesPage.tsx
│       │   ├── AIAssistantPage.tsx
│       │   ├── AnalyticsPage.tsx
│       │   ├── CalendarPage.tsx
│       │   └── FocusPage.tsx
│       ├── store/              # Zustand state stores
│       ├── styles/             # Global styles
│       └── utils/              # Shared utilities
├── server/                     # Express backend
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Auth & error middleware
│   ├── models/                 # Mongoose schemas (User, Project, Task, Note)
│   ├── routes/                 # Express routers
│   ├── services/               # Business logic & external service integrations
│   └── index.js                # Server entry point
├── package.json                # Root monorepo scripts
└── vercel.json                 # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** — local instance or [MongoDB Atlas](https://cloud.mongodb.com)
- **Anthropic API Key** — for AI features ([get one here](https://console.anthropic.com/))

### 1. Clone the repository

```bash
git clone https://github.com/Tejas-v-krishna/flowdesk.git
cd flowdesk
```

### 2. Install dependencies

This is an npm workspace monorepo — a single install from the root handles everything:

```bash
npm install
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/flowdesk
JWT_SECRET=<64-char random string>
JWT_REFRESH_SECRET=<different 64-char random string>
ANTHROPIC_API_KEY=sk-ant-...
```

> **Tip:** Generate strong JWT secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Start the development servers

```bash
npm run dev
```

Both services start concurrently:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## ⚙️ Environment Variables

Full reference — see [`server/.env.example`](server/.env.example).

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | — | Secret for signing refresh tokens |
| `ANTHROPIC_API_KEY` | ✅ | — | Anthropic Claude API key |
| `PORT` | ❌ | `5000` | HTTP server port |
| `CLIENT_URL` | ❌ | `http://localhost:5173` | Frontend origin for CORS |
| `NODE_ENV` | ❌ | `development` | `development` or `production` |
| `REDIS_URL` | ❌ | — | Redis URL for optional caching / rate-limiting |

---

## 📜 Available Scripts

Run these from the **repository root**:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend concurrently |
| `npm run server` | Start backend only (with nodemon) |
| `npm run client` | Start frontend only (Vite dev server) |
| `npm run build` | Build the frontend for production |

Production-specific:

```bash
# Start the backend in production mode
cd server && npm start

# Preview the production frontend build
cd app && npm run preview
```

---

## ☁️ Deployment

### Vercel (Frontend + Serverless API)

The repository includes a [`vercel.json`](vercel.json) configured to:
- Serve the built frontend from `app/dist`
- Proxy all `/api/*` requests to the backend

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the repo root
vercel
```

Set the same environment variables listed above in your [Vercel project settings](https://vercel.com/docs/projects/environment-variables) before deploying.

### Standalone Backend

For a dedicated backend host (Railway, Render, Fly.io, etc.):

```bash
cd server
npm install --omit=dev
NODE_ENV=production npm start
```

Set `CLIENT_URL` to your deployed frontend URL so CORS allows the correct origin.

---

## 🔌 API Overview

All routes are prefixed with `/api`.

| Resource | Base Path | Description |
|----------|-----------|-------------|
| Auth | `/api/auth` | Register, login, logout, refresh token |
| Projects | `/api/projects` | CRUD for projects |
| Tasks | `/api/tasks` | CRUD for tasks, status & priority updates |
| Notes | `/api/notes` | CRUD for markdown notes |
| Analytics | `/api/analytics` | Aggregated stats & activity feed |
| AI | `/api/ai` | Claude-powered chat completions |

Protected routes require an `Authorization: Bearer <token>` header.

---

## 🔐 Security Notes

- All secrets live in `.env` files — **never committed to git** (`.gitignore` already excludes them)
- JWT access tokens are short-lived; refresh tokens enable seamless re-authentication
- Passwords are hashed with **bcryptjs** before storage
- CORS is locked to the configured `CLIENT_URL`

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a branch** for your feature or fix: `git checkout -b feat/your-feature`
3. **Commit** your changes with a descriptive message
4. **Push** to your fork and open a **Pull Request**

Please keep PRs focused and describe what problem they solve.

---

## 📄 License

ISC © [Tejas V Krishna](https://github.com/Tejas-v-krishna)
