# Nova OS

A mobile OS simulator built with React and Node.js. Includes 13 native apps, real-time calls and messaging, and a simulated kernel with process management.

---

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Zustand, Socket.io-client  
**Backend:** Node.js, Express, Socket.io, Prisma, SQLite, Zod  
**DevOps:** Docker, Docker Compose

---

## Features

- 13 native apps: phone, messages, contacts, gallery, camera, music, browser, calculator, clock, notes, terminal, weather, settings
- Real-time messaging and WebRTC video/audio calls
- Simulated kernel: process management, RAM tracking, battery, network services
- Lock screen, home screen with widgets, and a swipe-up multitasking switcher
- Glassmorphic dark UI with gesture-based navigation
- Persistent storage via IndexedDB (client) and SQLite (server)
- Browser is limited to the university page

---

## Architecture

```
Frontend
  Shell (StatusBar, LockScreen, HomeScreen, AppSwitcher)
    └── Kernel
          ├── Zustand store  — global OS state
          ├── Event bus (Mitt) — decoupled system events
          ├── Services — clock, battery, network, calls, notifications
          └── Apps (lazy-loaded, self-contained modules)

Backend
  Express REST API + Socket.io gateways
    └── Prisma ORM → SQLite
```

---

## Key Decisions

- **Kernel as real OS daemons** — services (clock, battery, network) boot at startup and run independently
- **Mitt event bus** — keeps shell and kernel decoupled, no prop drilling or direct imports
- **Zustand + Immer** — clean, immutable global state without boilerplate
- **IndexedDB** — contacts, notes, files, and call logs persist offline on the client
- **WebRTC** — actual P2P calls with SDP negotiation and ICE candidate buffering, not faked
- **Docker Compose** — one command to run the full stack

---

## Getting Started

**With Docker (recommended):**
```bash
docker compose up
```
- Frontend → http://localhost:8080
- Backend → http://localhost:3000

**Without Docker:**
```bash
# backend
cd server && npm install && npx prisma migrate dev && npm run dev

# frontend (separate terminal)
npm install && npm run dev
```

---

## What I Learned

- Designing a real-time backend with Socket.io for both messaging and call signaling
- Implementing WebRTC from scratch: SDP offer/answer, ICE candidates, and handling race conditions with candidate buffering
- Using Prisma with SQLite and containerizing the full stack with Docker
