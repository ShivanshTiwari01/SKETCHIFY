<div align="center">

# ✏️ Sketchify

**A real-time collaborative whiteboard — draw, design, and brainstorm together.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Overview

Sketchify is an open-source, real-time collaborative whiteboard inspired by [Excalidraw](https://excalidraw.com/). Multiple users can join the same room and sketch, annotate, and brainstorm together — changes are broadcast instantly via WebSockets so every participant stays in sync.

## Features

- **Real-time collaboration** — WebSocket-powered live sync across all connected clients
- **Room-based sessions** — create or join named rooms; each room has its own isolated canvas
- **User authentication** — secure JWT-based signup & signin with bcrypt password hashing
- **Persistent storage** — canvas state and chat messages saved to PostgreSQL via Prisma
- **Monorepo architecture** — shared types, DB client, and UI components across all apps
- **Fully typed** — end-to-end TypeScript with Zod schema validation

## Tech Stack

| Layer      | Technology                                                                        |
| ---------- | --------------------------------------------------------------------------------- |
| Frontend   | [Next.js 16](https://nextjs.org/)                                                 |
| HTTP API   | [Express.js](https://expressjs.com/)                                              |
| Real-time  | [ws](https://github.com/websockets/ws) (WebSocket)                                |
| Database   | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)  |
| Auth       | [JWT](https://jwt.io/) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js)     |
| Validation | [Zod](https://zod.dev/)                                                           |
| Monorepo   | [Turborepo](https://turbo.build/) + [pnpm Workspaces](https://pnpm.io/workspaces) |
| Language   | [TypeScript](https://www.typescriptlang.org/)                                     |

## Project Structure

```
sketchify/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── http-backend/     # Express REST API  (port 4020)
│   └── ws-backend/       # WebSocket server  (port 8080)
└── packages/
    ├── db/               # Prisma schema & generated client (@repo/db)
    ├── common/           # Shared Zod schemas & TypeScript types (@repo/common)
    ├── backend-common/   # Shared backend config & utilities (@repo/backend-common)
    ├── ui/               # Shared React component library (@repo/ui)
    ├── eslint-config/    # Shared ESLint configurations
    └── typescript-config/ # Shared tsconfig bases
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 10 — `npm install -g pnpm`
- A running [PostgreSQL](https://www.postgresql.org/) instance

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-username/sketchify.git
   cd sketchify
   ```

2. **Install dependencies**

   ```sh
   pnpm install
   ```

3. **Configure environment variables**

   Copy the example env files and fill in your values:

   ```sh
   # packages/db
   cp packages/db/.env.example packages/db/.env

   # apps/http-backend
   cp apps/http-backend/.env.example apps/http-backend/.env

   # apps/ws-backend
   cp apps/ws-backend/.env.example apps/ws-backend/.env
   ```

   Minimum required variables:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sketchify"
   JWT_SECRET="your-super-secret-key"
   ```

4. **Run database migrations**

   ```sh
   pnpm --filter @repo/db exec prisma migrate dev
   ```

5. **Start all services in development mode**

   ```sh
   pnpm dev
   ```

   | Service   | URL                   |
   | --------- | --------------------- |
   | Frontend  | http://localhost:3000 |
   | HTTP API  | http://localhost:4020 |
   | WebSocket | ws://localhost:8080   |

### Build for Production

```sh
pnpm build
```

## API Reference

### Authentication

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| `POST` | `/api/signup` | Register a new user       |
| `POST` | `/api/signin` | Sign in and receive a JWT |

### Rooms

| Method | Endpoint    | Auth         | Description                  |
| ------ | ----------- | ------------ | ---------------------------- |
| `POST` | `/api/room` | Bearer token | Create a new whiteboard room |

### WebSocket

Connect to `ws://localhost:8080?token=<JWT>` to join a room and receive real-time canvas events.

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start all apps in watch mode   |
| `pnpm build`       | Build all apps and packages    |
| `pnpm lint`        | Lint all workspaces            |
| `pnpm format`      | Format all files with Prettier |
| `pnpm check-types` | Run TypeScript type checks     |

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before opening a pull request.

## License

This project is licensed under the [MIT License](./LICENSE).
pnpm dlx turbo build
pnpm exec turbo build

````

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
````

Without global `turbo`:

```sh
npx turbo build --filter=docs
pnpm exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
