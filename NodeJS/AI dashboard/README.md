<div align="center">

<br />

# ⚡ AetherForge AI
### Enterprise-Grade MERN Stack Intelligence Dashboard

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State_Management-FFB800?style=for-the-badge" />
</p>

<p>
  <strong>AetherForge AI</strong> is a full-stack, production-ready MERN dashboard featuring AI-driven natural language querying, granular RBAC security, live telemetry, visual automation builders, and an advanced data import/export matrix — all wrapped in a stunning glassmorphic UI with full Light & Dark mode support.
</p>

<br />

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Feature Showcase](#-feature-showcase)
- [API Endpoints](#-api-endpoints)
- [Scripts Reference](#-scripts-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

AetherForge AI is organized into four feature pillars:

### 🤖 AI & Automation
| Feature | Description |
|---|---|
| **AI Copilot** | Natural language database querying — ask in plain English, get instant SQL-like results |
| **Smart Scaffold** | Automated view generation from database schema analysis |
| **Auto-CRUD** | Instant database interface creation with permission enforcement |
| **Action Flows** | Visual multi-step automation builder with live trigger simulation |
| **Bulk Engine** | Mass data updates with subset targeting (all / pending / low-revenue) |

### 📊 Analytics & Data
| Feature | Description |
|---|---|
| **Flex Board** | Drag-and-drop widget dashboard with persistent layout ordering |
| **Live Pulse** | Real-time CPU/RAM telemetry with animated progress rings and a console event stream |
| **Query Studio** | Custom report and chart builder powered by Recharts area graphs |
| **Data Forge** | Advanced CSV/JSON import-export matrix with auto field-mapping |
| **Global Search** | Instant omni-search across all client records and application sections |

### 🔒 Security & Governance
| Feature | Description |
|---|---|
| **Matrix Auth** | Granular role-based access control (RBAC) with live permission toggles |
| **Black Box** | Immutable user audit logging with cryptographic timestamps |
| **Session Guard** | Device tracking and one-click remote logout |
| **Sign-In Shield** | Multi-factor (MFA) and SSO enforcement toggles |
| **Masking Engine** | Automatic PII data blurring for names, emails, and revenue values |

### 🎨 User Experience
| Feature | Description |
|---|---|
| **Ghost Mode** | Impersonate Editor / Viewer / Guest roles for permission debugging |
| **Split View** | Side-by-side comparison of any two client records with AI churn prediction |
| **Light / Dark Mode** | Full glassmorphic dark mode and clean modern light mode, both persisted across refresh |
| **Quick Login** | One-click role-based quick login profiles (Admin, Editor, Viewer, Guest) |
| **Session Persistence** | User authentication and theme preference survive page refreshes via localStorage |

---

## 🛠 Tech Stack

### Frontend (`/client`)
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework with modern hooks |
| Tailwind CSS | v4 | Utility-first CSS with Dark mode |
| Vite | 7 | Lightning-fast build tool (rolldown) |
| Zustand | Latest | Lightweight global state management |
| Recharts | Latest | Responsive chart library (Area, XAxis, YAxis) |
| React Router DOM | v7 | Client-side routing and navigation guards |
| Lucide React | Latest | Premium SVG icon library |
| Sonner | Latest | Beautiful toast notification system |

### Backend (`/server`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | JavaScript runtime |
| Express | v5 | REST API server |
| MongoDB | Atlas / Local | Primary NoSQL database |
| Mongoose | v9 | ODM schema modeling |
| CORS | Latest | Cross-origin request support |
| Dotenv | Latest | Environment variable management |
| Nodemon | Latest | Hot-reload development server |

---

## 📁 Project Structure

```
AI dashboard/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AISidebar.jsx        # AI Copilot sliding panel
│   │   │   ├── GhostBanner.jsx      # Ghost Mode active warning banner
│   │   │   ├── GlobalSearch.jsx     # Omni-search modal overlay
│   │   │   ├── InboxHub.jsx         # Notification inbox panel
│   │   │   ├── Logo.jsx             # Animated AetherForge logo
│   │   │   └── Sidebar.jsx          # Navigation sidebar with RBAC lock icons
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Auth page with quick-select profiles & MFA
│   │   │   ├── Overview.jsx         # Flex Board drag-and-drop widget dashboard
│   │   │   ├── Clients.jsx          # Client Engine: CRUD, Bulk Engine, Split View
│   │   │   ├── AIPlayground.jsx     # AI Copilot + Query Studio + Action Flows
│   │   │   ├── ActionFlows.jsx      # Visual automation builder
│   │   │   ├── QueryStudio.jsx      # Custom report and chart builder
│   │   │   ├── Security.jsx         # Matrix Auth, Audit Logger, Session Guard
│   │   │   ├── DataForge.jsx        # CSV/JSON import & export matrix
│   │   │   └── Settings.jsx         # Theme, masking, ghost mode, environment
│   │   ├── store/
│   │   │   └── uiStore.js           # Zustand global store (auth, RBAC, clients...)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility helpers
│   │   ├── App.jsx                  # Router, layout shell, theme sync
│   │   └── main.jsx                 # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Express backend
│   ├── models/
│   │   └── Schemas.js               # Mongoose schemas (User, Client, AuditLog)
│   ├── routes/
│   │   └── api.js                   # All REST API route handlers
│   ├── server.js                    # Express entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** v20 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- **MongoDB** — Either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud) or local installation

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aetherforge-ai.git
cd aetherforge-ai
```

---

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aetherforge
PORT=5000
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 3. Setup the Client

Open a new terminal:

```bash
cd client
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 4. Open the App

Navigate to **http://localhost:5173** in your browser. Use the Quick Select Login to authenticate as any role.

| Profile | Role | Capabilities |
|---|---|---|
| Aayush | Admin | Full access — all features enabled |
| Sarah | Editor | Read + Write, no Delete or System |
| Mike | Viewer | Read-only access |
| Guest | Guest | Minimal read access |

---

## ⚙️ Environment Variables

### `/server/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string (Atlas or local) |
| `PORT` | ❌ | Server port (default: `5000`) |

> **Offline Mode**: If the server is unreachable, AetherForge automatically falls back to an offline in-memory mode, so the full UI remains functional for demo and development purposes.

---

## 🎯 Feature Showcase

### 🔐 Authentication & Sessions
- Single-click quick login profiles
- MFA toggle enforcement
- Session persists across page refreshes (localStorage)
- Ghost Mode — impersonate any role without re-authenticating

### 📊 Live Telemetry (Live Pulse)
- Real-time CPU & RAM usage with animated SVG progress rings
- Scrolling console event stream refreshed every 3 seconds
- Recharts area graph with dynamic revenue data seeded from the database

### 👥 Client Engine (CRUD)
- Full Create / Read / Update / Delete with MongoDB persistence
- **Bulk Engine** — mass-activate, mass-cancel, or inflate revenue by +15%
- **Split View** — select any 2 rows and compare side-by-side with AI churn predictions
- **PII Masking** — blur names, emails, and revenue values in one toggle

### 🔑 Matrix Auth (RBAC)
- Role permission matrix (Read / Write / Delete / System / Export)
- One-click preset loaders: **Strict Lock**, **Permissive Open**, **Compliance Standard**
- All permission updates immediately sync to the UI and enforce route-level guards

### 📥 Data Forge (Import / Export)
- Paste raw JSON arrays and auto-detect headers
- Flexible field mapper — connect any header key to name, email, status, revenue
- Load enterprise template presets instantly
- Export full database as **CSV** or **JSON** with one click

### 🔍 Black Box Audit Logger
- Immutable timestamped log of every admin action (login, CRUD, RBAC changes, logouts)
- Searchable and filterable by actor name, action type, or log content
- Shows device location and IP for each event

---

## 📡 API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate and create user session |
| `POST` | `/api/auth/logout` | Terminate session and write audit log |
| `GET` | `/api/clients` | Fetch all client records |
| `POST` | `/api/clients` | Create a new client record |
| `PUT` | `/api/clients/:id` | Update an existing client record |
| `DELETE` | `/api/clients/:id` | Delete a client record |
| `GET` | `/api/audit-logs` | Retrieve the immutable audit log |
| `POST` | `/api/audit-logs` | Write a new audit log entry |
| `GET` | `/api/sessions` | Get active device sessions |

---

## 📜 Scripts Reference

### Client (`/client`)
```bash
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production bundle (outputs to /dist)
npm run preview    # Preview the production build locally
```

### Server (`/server`)
```bash
npm run dev        # Start with nodemon (hot reload)
npm start          # Start without nodemon (production)
```

---

## 🧩 Key Architecture Decisions

- **Zustand over Redux** — Lighter, simpler global state with no boilerplate. All state (auth, RBAC, clients, audit logs) lives in a single `uiStore.js` with fine-grained selectors.
- **Offline Fallback** — Every API call wraps a try/catch so the app gracefully degrades to in-memory state when the server is offline. Ideal for demos.
- **CSS-first Tailwind v4** — No `tailwind.config.js` needed. Theme tokens are declared directly in CSS using the `@theme` block.
- **localStorage Persistence** — Auth session (`aetherforge_user`) and theme (`aetherforge_theme`) survive full page refreshes without requiring a backend session system.
- **Role-Based Route Guards** — The `Layout` component in `App.jsx` intercepts every route and redirects unauthenticated users to `/login` before rendering any page.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code:
- Uses standard Tailwind CSS utility classes (no custom non-standard shades)
- Includes both `dark:` and light mode class pairs for any new UI elements
- Respects the existing Zustand store patterns in `uiStore.js`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using the MERN Stack + React + Tailwind CSS

**[⬆ Back to Top](#-aetherforge-ai)**

</div>
