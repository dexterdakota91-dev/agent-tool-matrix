# Contributing to Agent Tool Matrix (ATM)

Thank you for your interest in contributing to Agent Tool Matrix! This document provides guidelines and instructions for developers who want to contribute to the project.

## Architecture Overview

The application is built on a modern, serverless stack designed for performance and real-time integration:

* **Next.js App Router**: We use Next.js 16 (App Router) with React 19 for the frontend, state management, and API routes.
* **Prisma ORM with Neon Serverless Postgres**: The database layer uses Prisma ORM connected to Neon Serverless Postgres. We use `@neondatabase/serverless` using WebSocket/HTTP pooling for efficient database connections in serverless environments.
* **MCP Server Gateway**: A REST & MCP (Model Context Protocol) Server Engine exposes database-backed tools to external LLM clients over Server-Sent Events (SSE).

## Local Development Setup

Follow these steps to set up the project locally.

### 1. Prerequisites
* **Node.js (v18+)** must be installed.
* Ensure you are using `npm` for dependency management (do not use pnpm or yarn).

### 2. Environment Variables
Create a `.env` file in the root directory based on the following template:

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

### 3. Database Migrations & Seeding
To set up your database schema and populate it with initial data, run:

```bash
# Generate Prisma Client and sync schema
npx prisma db push

# Seed sample data (mock tools, connectors, and workflows)
node prisma/seed.mjs
```

### 4. Running the App
Start the local development server:

```bash
npm run dev
```

## Testing Standards

All features and optimizations should have accompanying tests and must pass the existing suite before a PR is opened.

### Running Playwright Tests
We use Playwright for E2E UI and API integration testing. Before running tests, ensure your database is set up and Playwright dependencies are installed:

```bash
npx prisma generate
npx playwright install --with-deps
```

Run all tests:
```bash
npx playwright test
```

### REST Endpoint Testing
The API test suite (`tests/api.spec.ts`) covers REST routing endpoints, invalid request constraints, Bearer authentication headers, and JSON-RPC schema parsing. When adding or modifying REST endpoints, update or add tests to ensure the behavior is properly covered.

## MCP Integration

The application functions as a Model Context Protocol (MCP) server. External LLMs (like Claude or Gemini) can connect over **Server-Sent Events (SSE)** to dynamically discover and run tools.

1. **Connection**: The client initiates an SSE connection to the MCP Server Router.
2. **Handshake**: The server validates authentication (via Bearer token) and establishes the session.
3. **Execution**: The external agent sends JSON-RPC commands over the connection to fetch tools or trigger executions, which the ATM backend fulfills by querying the database and invoking the requested workflow.
