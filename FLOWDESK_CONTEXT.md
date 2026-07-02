# Flowdesk: Deep Context & Technical Architecture

Flowdesk is an advanced, high-aesthetic "Personal Productivity OS" designed for high-performance individuals. It moves beyond simple task management to provide a holistic environment for strategic alignment, cognitive optimization, and deep work execution.

---

## 🏗 Technical Architecture & State Management

### 1. Frontend Architecture (React 19 + Vite)
- **State Architecture**: Uses fragmented **Zustand** stores for localized performance:
    - `useAuthStore`: Handles JWT persistence, login/logout, and user session.
    - `useBrainStore`: Manages AI-generated insights, executive summaries, and knowledge nodes.
    - `useAppStore`: Controls global application state (loading screens, sidebar toggles).
    - `useThemeStore`: Synchronizes "Dark/Light" mode transitions with CSS variables.
- **Data Orchestration**: **TanStack Query (v5)** is used for all server-side data fetching, providing optimistic updates and cache invalidation via Socket.io events.
- **Real-Time Sync**: Integrated **Socket.io** client listens for `task_created`, `task_updated`, and `task_deleted` events to keep the UI in sync across multiple devices without manual refreshes.

### 2. Backend Infrastructure (Node.js + Express 5)
- **Streaming AI Implementation**: The `/api/ai/chat` endpoint utilizes server-sent events (SSE) to stream Claude's responses directly to the frontend.
- **Context Injection**: Every AI request automatically injects the user's active Projects and Tasks into the prompt, ensuring the AI has perfect situational awareness of the user's workflow.
- **RESTful Design**: Standardized controllers for Projects, Tasks, Notes, and Analytics, following the Model-Controller-Route pattern.

---

## 🧩 Comprehensive Module Breakdown

### 📊 Strategic Analytics & Biometrics
- **Productivity Velocity**: An AreaChart (Recharts) visualizing the "Performance Loop" (completed tasks over the last 7 days).
- **Project Portfolio**: A DonutChart mapping resource distribution across different project categories.
- **Focus Heatmap**: A color-coded grid (Focus Heat Colors: #0d0d0d to #42ff6b) tracking operational consistency and pattern tracking.
- **Operational Biometrics**: Detailed stats on cognitive load, focus momentum, and task success rates.

### 🧠 Brain AI (Mission Control)
- **Intelligence Layer**: Powered by Anthropic Claude.
- **Executive Briefing**: A synthesized summary of the user's current productive state and focus momentum.
- **Knowledge Graph**: A visual representation of knowledge nodes and their interconnections.
- **Strategic Insights**: AI-generated reports categorized into:
    - *Strategy*: Long-term positioning and objective alignment.
    - *Productivity*: Workflow optimization and efficiency tips.
    - *Rest/Connection*: Holistic performance management.

### 💳 Finance Pulse (Capital Matrix)
- **Key Metrics**: Tracks Total Assets, Monthly Burn, Total Revenue, and Runway.
- **Active Nodes**: Integrated (mock) Plaid and Stripe protocols for real-time financial tracking.
- **AI Advisory**: Context-aware financial tips (e.g., "Your SaaS burn increased by 4%, audit recommended").
- **Operation Ledger**: A detailed transaction history with categorization and search capabilities.

### 🎯 Goal Matrix (Strategic Alignment)
- **Objective Tracking**: Quarterly objectives with progress rings and priority levels.
- **Convergence Analysis**: AI-driven score (e.g., "Goal alignment is 84%") comparing actual output against stated objectives.
- **Recommended Actions**: Step-by-step TASKS suggested by the AI to achieve quarterly KPIs.

### ⏱ Focus HUD (Deep Work Protocol)
- **Modes**: Pomodoro (25/5), Short Break (5), Long Break (15).
- **Immersion**: High-contrast, distraction-free UI with progress rings and integrated ambient sound mixers.
- **OS Layer Integration**: Focus state is visible across the entire application via the sidebar widget.

---

## 🗄 Data Model Relationships

### Task Entity
- **Relationships**: Belongs to a `Project` and a `User`.
- **Properties**: Priority (Low to Urgent), Status (Todo to Done), Sub-tasks (Array of strings), and Order (for Kanban drag-and-drop).
- **Automation**: Automatic `completedAt` timestamping upon status transition to 'Done'.

### Project Entity
- **Relationships**: Contains multiple `Tasks` and `Notes`.
- **Properties**: Color-coding (Hex), TechStack (Array of tags), Resources (External links), and Status (Ongoing to Archived).

---

## 🎨 Design Philosophy & UX
- **Aesthetic**: "Premium Editorial" — utilizes glassmorphism, background refraction, and heavy typography (Inter/Black).
- **Interaction**:
    - **OmniCommand (CMD+K)**: A global action/navigation palette.
    - **Framer Motion**: Staggered children animations for a "living" UI.
    - **GSAP**: Used for high-complexity scroll-based reveal animations in specific sections.
- **UI Provider**: `AestheticContext` manages global visual tokens and refined layout spacing.
