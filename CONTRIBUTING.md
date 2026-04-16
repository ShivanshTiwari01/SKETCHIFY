# Contributing to Sketchify

Thank you for your interest in contributing to Sketchify! Whether you're fixing a bug, proposing a feature, or improving documentation — every contribution matters.

Please take a moment to read this guide before submitting anything.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Review Process](#review-process)

---

## Code of Conduct

By participating in this project you agree to treat all contributors with respect. Harassment, trolling, or discriminatory behaviour will not be tolerated.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:

   ```sh
   git clone https://github.com/<your-username>/sketchify.git
   cd sketchify
   ```

3. **Add the upstream remote** so you can keep your fork in sync:

   ```sh
   git remote add upstream https://github.com/original-owner/sketchify.git
   ```

4. Follow the [Development Setup](#development-setup) steps below.

---

## How to Contribute

### Reporting Bugs

Before filing a bug report, search existing [Issues](../../issues) to avoid duplicates.

When opening an issue, include:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected vs. actual behaviour
- Environment details (OS, Node version, browser if applicable)
- Any relevant logs or screenshots

### Suggesting Features

Open a [Feature Request issue](../../issues/new) and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### Submitting a Pull Request

1. **Sync your fork** before starting work:

   ```sh
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a focused branch** from `main`:

   ```sh
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-123-short-description
   ```

3. **Make your changes** following the [Coding Guidelines](#coding-guidelines).

4. **Verify everything passes** locally:

   ```sh
   pnpm lint
   pnpm check-types
   pnpm build
   ```

5. **Commit** using the [Conventional Commits](#commit-message-convention) format.

6. **Push** your branch and open a Pull Request against `main`:

   ```sh
   git push origin feat/your-feature-name
   ```

7. Fill in the PR template — describe what changed and why, link any related issues.

> **One concern per PR.** Keep changes small and focused so reviews are fast.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 10: `npm install -g pnpm`
- A running [PostgreSQL](https://www.postgresql.org/) instance

### Steps

```sh
# Install all dependencies
pnpm install

# Set up environment variables (see README for required vars)
cp packages/db/.env.example packages/db/.env
cp apps/http-backend/.env.example apps/http-backend/.env
cp apps/ws-backend/.env.example apps/ws-backend/.env

# Run database migrations
pnpm --filter @repo/db exec prisma migrate dev

# Start all services in watch mode
pnpm dev
```

| Service   | Default URL           |
| --------- | --------------------- |
| Frontend  | http://localhost:4003 |
| HTTP API  | http://localhost:4001 |
| WebSocket | ws://localhost:4002   |

---

## Project Structure

```
sketchify/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── http-backend/     # Express REST API
│   └── ws-backend/       # WebSocket server
└── packages/
    ├── db/               # Prisma schema & generated client
    ├── common/           # Shared Zod schemas & TypeScript types
    ├── backend-common/   # Shared backend config & utilities
    ├── ui/               # Shared React component library
    ├── eslint-config/    # Shared ESLint configurations
    └── typescript-config/ # Shared tsconfig bases
```

When contributing to a specific area, work inside the corresponding app or package. Shared logic belongs in the relevant `packages/` directory.

---

## Coding Guidelines

- **Language**: All code must be written in **TypeScript**. Avoid `any` where possible.
- **Validation**: Use **Zod** for all runtime schema validation. Add new schemas to `packages/common/src/types.ts`.
- **Style**: Code is formatted with **Prettier** — run `pnpm format` before committing.
- **Linting**: Must pass `pnpm lint` with zero errors.
- **No unused code**: Remove `console.log` statements and commented-out code before opening a PR.
- **Tests**: If you add a new feature, include tests where applicable (test setup coming soon).
- **Security**: Do not hardcode secrets. Use environment variables and follow the existing `.env` pattern.

---

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short summary>
```

### Types

| Type       | When to use                                            |
| ---------- | ------------------------------------------------------ |
| `feat`     | A new feature                                          |
| `fix`      | A bug fix                                              |
| `docs`     | Documentation changes only                             |
| `style`    | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code restructuring without changing behaviour          |
| `perf`     | Performance improvements                               |
| `test`     | Adding or updating tests                               |
| `chore`    | Build process, dependency updates, tooling             |

### Examples

```
feat(ws-backend): broadcast canvas events to all room members
fix(http-backend): return 409 when username already exists
docs: update API reference in README
chore(deps): upgrade prisma to 6.x
```

---

## Review Process

1. A maintainer will review your PR within a reasonable timeframe.
2. Feedback will be left as inline comments — please respond or resolve each one.
3. Once approved and all checks pass, a maintainer will merge your PR.
4. Squash merges are preferred to keep the git history clean.

---

Thank you for helping make Sketchify better! 🎨
