# Flowdesk 🌊

> **A Personal Productivity OS** — Projects, Tasks, Notes, AI Assistant & Analytics in one sleek interface.

![Tech Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20MongoDB-blueviolet)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## ✨ Features

- 🗂 **Project Management** — Organize work into projects with status tracking
- ✅ **Task Manager** — Full task CRUD with priority, due dates & drag-and-drop
- 📝 **Notes** — Rich markdown notes tied to projects
- 🤖 **AI Assistant** — Claude-powered productivity assistant (Anthropic API)
- 📊 **Analytics Dashboard** — Weekly distribution, task overview & activity feed
- 📅 **Calendar View** — Date-based task planning
- 🎯 **Focus Mode** — Distraction-free work sessions
- 🌙 **Dark/Light Theme** — Smooth theme toggle
- 🔄 **Real-time Sync** — Socket.io powered live updates across tabs
- 🔐 **Auth System** — JWT-based authentication with refresh tokens

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS 4, Framer Motion, GSAP |
| State | Zustand, TanStack Query |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |
| AI | Anthropic Claude SDK |
| Auth | JWT (access + refresh tokens) |

---

## 📁 Project Structure

```
Flowdesk/
├── app/                   # React frontend (Vite)
│   └── src/
│       ├── api/           # Axios API client
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route-level page components
│       ├── store/         # Zustand state stores
│       └── styles/        # Global styles
├── server/                # Express backend
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # Auth & error middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── services/          # Business logic / external services
│   └── utils/             # Shared utilities
└── package.json           # Root monorepo scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [Atlas](https://cloud.mongodb.com))
- **Anthropic API Key** (for AI features) — [get one here](https://console.anthropic.com/)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/flowdesk.git
cd flowdesk
```

### 2. Install dependencies

```bash
# Install root deps
npm install

# Install server deps
cd server && npm install && cd ..

# Install frontend deps
cd app && npm install && cd ..
```

### 3. Configure environment variables

```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env and fill in:
#   - MONGODB_URI
#   - JWT_SECRET  (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
#   - JWT_REFRESH_SECRET
#   - ANTHROPIC_API_KEY
```

### 4. Start the development servers

```bash
# Starts both frontend and backend concurrently
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## ⚙️ Environment Variables

See [`server/.env.example`](server/.env.example) for all required variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic Claude API key |
| `PORT` | ❌ | Server port (default: 5000) |
| `CLIENT_URL` | ❌ | Frontend URL for CORS (default: http://localhost:5173) |
| `REDIS_URL` | ❌ | Redis URL for optional caching |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `cd server && npm start` | Production server start |
| `cd app && npm run build` | Build frontend for production |

---

## 🔐 Security Notes

- All secrets are stored in `.env` files which are **never committed to git**
- JWT tokens use separate secrets for access and refresh tokens
- Passwords are hashed with `bcryptjs`
- CORS is configured to only allow the specified `CLIENT_URL`

---

## 📄 License

ISC © [Tejas V Krishna](https://github.com/tejaskrishna2018)
