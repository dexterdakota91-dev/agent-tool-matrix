# Agent Tool Matrix (ATM)

Agent Tool Matrix is a premium web dashboard, orchestration pipeline, and MCP/REST gateway for managing AI Agent tools, skills, and connector integrations. Built with Next.js, Prisma, and Neon Postgres, the application allows developers to discover tools, model workflows, simulate agent execution runs, and expose database-backed tools to external LLM clients over standard **Model Context Protocol (MCP)**.

---

## 🚀 Key Features

* **Visual Canvas**: Explore tools, prompts, and connectors with semantic search (supporting direct matches and tag-overlap relationships).
* **Pipeline Builder**: Arrange, configure, and re-order multiple tools into an execution pipeline, and register it as an automated workflow.
* **Live Execution Simulator**: Simulate multi-step pipeline executions with real-time log streaming and status indicator updates.
* **Identity & Access Tier Controls**: Toggle simulator identity between `Guest` and `Admin` to test validation restrictions.
* **Bearer Token Management**: Register, copy, and revoke database-backed, crypto-hashed API tokens for custom integrations.
* **REST & MCP Server Engine**: Integrates a complete, authenticated Model Context Protocol (MCP) server over Server-Sent Events (SSE) so external agents (like Claude or Gemini) can fetch database tools and run them dynamically.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React (icons), Framer Motion (smooth animations).
* **State Management**: Zustand (Canvas & search state) and custom React hooks.
* **Database & ORM**: Neon Serverless Postgres, Prisma ORM.
* **Serverless Driver**: `@neondatabase/serverless` using WebSocket/HTTP pooling.
* **E2E & Integration Testing**: Playwright Test Suite (Chromium).

---

## 📂 Project Structure

```
atm/
├── prisma/
│   ├── schema.prisma   # Prisma Database Model
│   ├── seed.mjs        # Database Seed definition
│   └── run_seed.ts     # Extensive mockup tooling data seed
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── mcp/     # MCP Server SSE Router (GET / POST)
│   │   │   ├── v1/      # Public REST API (Tools/Workflows)
│   │   │   └── tools/   # Search & Checkout APIs
│   │   ├── actions.ts   # Server Actions (unified getInitialData)
│   │   ├── layout.tsx
│   │   └── page.tsx     # App dashboard main views
│   ├── components/      # UI components (Canvas, Builder, Settings, Workflows)
│   ├── hooks/           # Custom simulation engine hook
│   ├── lib/             # Prisma client setup and Bearer Auth validation
│   └── store/           # Zustand state store
├── tests/
│   ├── api.spec.ts      # MCP and REST API E2E Integration Suite
│   └── e2e.spec.ts      # UI and User Flow E2E Suite
├── package.json
└── playwright.config.ts
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root `atm` directory:
```env
# Connection URL for Prisma (SSL and pooler enabled)
DATABASE_URL="postgresql://neondb_owner:<password>@<host>/neondb?sslmode=require&pgbouncer=true"

# Direct connection URL (unpooled)
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:<password>@<host>/neondb?sslmode=require"

# Neon Auth Configuration
NEON_AUTH_BASE_URL="https://<host>.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth"
NEON_AUTH_JWKS_URL="https://<host>.neonauth.c-3.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json"

# Local Static Developer Token (bypass token)
DEV_AGENT_TOKEN="dev_static_key_12345"
```

### 4. Database Setup & Seeding
Deploy migrations and seed the database with mock tools, connectors, and workflows:
```bash
# Generate Prisma Client
npx prisma generate

# Seed sample data
node prisma/seed.mjs
```

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing

The codebase includes an extensive suite of Playwright integration and E2E UI tests:

Run all tests:
```bash
npx playwright test
```

* **API & MCP Tests (`tests/api.spec.ts`)**: Validates REST routing endpoints, invalid request constraints, Bearer authentication headers, SSE connection handshakes, JSON-RPC schema parsing, and model/prompt variable interpolation.
* **UI E2E Tests (`tests/e2e.spec.ts`)**: Tests the homepage loading indicators, canvas tool lookup, workflow creation flow, execution simulation logs, and token generation/revocation controls.

---

## ⚡ Performance Optimizations

### Unified DB Request Pipeline
During development, standard concurrent Server Action calls triggered separate Webpack-compiled POST requests. Each initialized a separate `PrismaClient` with distinct Neon WebSocket handshakes, leading to pooling blocks.

This is optimized by routing initial loads through a single combined server action (`getInitialData` in `src/app/actions.ts`), reducing database round-trips from **3 to 1** and solving WebSocket connection queue delays.
