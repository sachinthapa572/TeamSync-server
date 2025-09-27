# Teams Project Management SaaS – Server

This repository contains the backend API for a multi-tenant project management SaaS. The service powers workspaces, projects, and tasks while enforcing role-based permissions, session-based authentication, and Google OAuth. It is written in TypeScript, runs on the Bun runtime, and persists data in MongoDB.

## ✨ Features

- **Workspace & member management** – create workspaces, invite teammates, change roles, and view workspace analytics.
- **Project & task lifecycle** – CRUD for projects and tasks with filtering, pagination, priorities, due dates, and status tracking.
- **Authentication** – local email/password sign-in with secure sessions plus Google OAuth 2.0 single sign-on.
- **Role-based access control (RBAC)** – fine-grained permissions (Owner, Admin, Member) enforced through reusable guards.
- **Validation & error handling** – Zod-powered request validation, centralized async error handling, and structured HTTP responses.
- **Developer ergonomics** – Bun dev server with hot reload, TypeScript project references, and utilities for seeding default roles.

## 🧰 Tech Stack

- Bun runtime with TypeScript
- Express.js + Passport (local & Google strategies)
- MongoDB via Mongoose ODM
- Cookie-based sessions (`cookie-session`)
- Zod for validation
- Morgan for request logging

## 📁 Project Structure

```text
src/
  config/           # App, database, HTTP, and passport configuration
  controllers/      # Request handlers for auth, workspaces, projects, tasks, users
  enums/            # Shared enums for roles, errors, task lifecycle
  middlewares/      # Async wrapper, auth guards, error handler
  models/           # Mongoose schemas for accounts, users, members, projects, tasks
  routes/           # Express routers grouped by resource
  services/         # Business logic and persistence helpers
  utils/            # Helpers for env loading, hashing, permissions, UUIDs
  validation/       # Zod schemas for request bodies and params
  seeders/          # Database seed scripts (e.g., default roles)
index.ts            # Bootstrap file wiring middleware, routes, and database
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.1+ (installs dependencies and runs scripts)
- Node.js (optional, but Bun ships with a compatible runtime)
- MongoDB 6.x+ instance or connection string
- Google OAuth 2.0 client (for Google login) – optional but recommended

### Installation

1. **Clone** the repository and switch into the server directory.
2. Copy `.env.example` to `.env` (create one if it does not exist) and fill in the required values listed below.
3. Install dependencies:
   ```bash
   bun install
   ```

### Environment Variables

| Variable                       | Required | Default       | Description                                                   |
| ------------------------------ | -------- | ------------- | ------------------------------------------------------------- |
| `NODE_ENV`                     | No       | `development` | Runtime environment flag.                                     |
| `PORT`                         | No       | `3000`        | Port the HTTP server listens on.                              |
| `BASE_PATH`                    | No       | `/api/v1`     | Root prefix for all API routes.                               |
| `MONGO_URI`                    | Yes      | —             | MongoDB connection string.                                    |
| `SESSION_SECRET`               | Yes      | —             | Secret used to sign session cookies.                          |
| `SESSION_EXPIRES_IN`           | Yes      | —             | Session lifetime (e.g., `1d`).                                |
| `GOOGLE_CLIENT_ID`             | Yes\*    | —             | Google OAuth client ID. Optional if Google login is disabled. |
| `GOOGLE_CLIENT_SECRET`         | Yes\*    | —             | Google OAuth client secret.                                   |
| `GOOGLE_CALLBACK_URL`          | Yes\*    | —             | Backend callback URL registered with Google.                  |
| `FRONTEND_ORIGIN`              | No       | `localhost`   | Allowed origin for CORS and redirects.                        |
| `FRONTEND_GOOGLE_CALLBACK_URL` | Yes\*    | —             | Frontend route that handles Google login success/failure.     |

\* Required when enabling Google OAuth.

### Running the Server

- **Development (hot reload):**
  ```bash
  bun run dev
  ```
- **Type checking only:**
  ```bash
  bun run check
  ```
- **Production build & start:**
  ```bash
  bun run build
  bun run start
  ```

### Seed Default Roles

Populate the database with the Owner/Admin/Member roles before inviting users:

```bash
bun run seed
```

This script clears existing role documents and recreates them with the permissions defined in `src/utils/role-permission.ts`.

## 🔌 API Highlights

All routes are mounted under `BASE_PATH` (default `/api/v1`). Auth routes are public, while the rest require a valid session.

| Route                                             | Method(s)                | Description                                                              |
| ------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------ |
| `/auth/register`                                  | `POST`                   | Register a new account with email/password.                              |
| `/auth/login`                                     | `POST`                   | Local login using Passport local strategy.                               |
| `/auth/google`                                    | `GET`                    | Initiate Google OAuth flow; callback handled at `/auth/google/callback`. |
| `/workspace`                                      | `GET`, `POST`            | List user workspaces or create a new workspace.                          |
| `/workspace/:id`                                  | `GET`, `PATCH`, `DELETE` | Fetch, update, or delete a workspace (role-gated).                       |
| `/workspace/:id/members`                          | `GET`, `PATCH`           | View members, change roles, or remove members.                           |
| `/workspace/:workspaceId/project`                 | CRUD                     | Manage projects within a workspace.                                      |
| `/workspace/:workspaceId/project/:projectId/task` | CRUD                     | Manage tasks with filtering, pagination, and status updates.             |

Explore the `controllers/` and `routes/` directories for the complete REST surface.

## 🧪 Testing & Quality

This repository currently does not include automated tests. Use the `bun run check` script for TypeScript validation

## 📝 License

Released under the ISC License. See the `LICENSE` file or the `license` field in `package.json` for details.
