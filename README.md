# SKETCHIFY

A real-time collaborative drawing application built with a monorepo architecture using Turborepo where users can draw together.

## Project Structure

This monorepo contains a full-stack collaborative drawing application with the following components:

### Apps and Packages

#### Applications

- `web`: A [Next.js](https://nextjs.org/) frontend application for the collaborative drawing interface
- `http-backend`: Express.js REST API server for authentication and room management
- `ws-backend`: WebSocket server for real-time collaboration features

#### Packages

- `@repo/ui`: Shared React component library used across applications
- `@repo/common`: Shared types and validation schemas using Zod
- `@repo/db`: Database package using [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL (schema, relations, and client)
- `@repo/backend-common`: Shared backend utilities and configuration
- `@repo/eslint-config`: ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: Shared TypeScript configurations

All packages and apps are 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has the following tools setup:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Zod](https://zod.dev/) for runtime type validation
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) for schema migrations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended package manager)
- PostgreSQL

### Installation

```sh
# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
JWT_SECRET=your_secret_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/sketchify
```

## Development

To develop all apps and packages, run the following command:

```sh
# With global turbo installed (recommended)
turbo dev

# Without global turbo, use pnpm
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```sh
# Run only the web app
turbo dev --filter=web

# Run only the backends
turbo dev --filter=http-backend --filter=ws-backend

# Using pnpm
pnpm exec turbo dev --filter=web
```

### Development Servers

- Web App: [http://localhost:3000](http://localhost:3000)
- HTTP Backend: [http://localhost:3001](http://localhost:3001)
- WebSocket Backend: [ws://localhost:8080](ws://localhost:8080)

## Build

To build all apps and packages:

```sh
# With global turbo installed (recommended)
turbo build

# Without global turbo
pnpm exec turbo build
```

Build a specific package:

```sh
turbo build --filter=web
pnpm exec turbo build --filter=http-backend
```

## Database

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL. The schema and client are defined in the `@repo/db` package.

### Schema

Defined in [`packages/db/src/schema.ts`](packages/db/src/schema.ts) with the following tables:

- **user** — stores user accounts (email, password, name, image)
- **room** — collaboration rooms linked to an admin user
- **chat** — messages linked to a room and user

Relations are defined using Drizzle's `relations()` API.

### Migrations

Use [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) to manage database migrations:

```sh
# Generate a migration from schema changes
pnpm --filter @repo/db exec drizzle-kit generate

# Apply migrations
pnpm --filter @repo/db exec drizzle-kit push
```

The Drizzle Kit config is at [`packages/db/drizzle.config.ts`](packages/db/drizzle.config.ts).

## API Endpoints

### HTTP Backend (`http-backend`)

- `POST /signup` - User registration
- `POST /signin` - User authentication
- `POST /room` - Create a new collaboration room

### WebSocket Backend (`ws-backend`)

- `ws://localhost:8080?token=<JWT_TOKEN>` - WebSocket connection for real-time collaboration

## Architecture

### Authentication Flow

1. Users sign up/sign in via the HTTP backend
2. JWT tokens are issued using [`JWT_SECRET`](packages/backend-common/src/index.ts)
3. WebSocket connections authenticate using JWT tokens in query parameters
4. The [`authentication`](apps/http-backend/src/middleware.ts) middleware verifies tokens for protected routes

### Type Safety

- Shared types are defined in [`@repo/common`](packages/common/src/types.ts) using Zod schemas
- [`UserSchema`](packages/common/src/types.ts), [`signinSchema`](packages/common/src/types.ts), and [`createRoomSchema`](packages/common/src/types.ts) ensure type safety across frontend and backend

## Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines:

```sh
# Authenticate with Vercel
turbo login

# Link your Turborepo to Remote Cache
turbo link
```

## Useful Links for reference

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [WebSocket Documentation](https://github.com/websockets/ws)
- [Zod Documentation](https://zod.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## License

MIT
