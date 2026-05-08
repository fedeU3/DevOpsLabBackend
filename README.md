# DevOpsLab — Backend

A NestJS REST API built as a DevOps experimentation platform. The core focus is the pipeline: multi-stage CI on GitHub Actions, SonarCloud quality gate enforcement, and a branch-per-environment promotion model. The API is the vehicle; the pipeline is the point.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node 20 |
| Framework | NestJS 11 |
| ORM | TypeORM 0.3.20 |
| Language | TypeScript 5.7 |
| Linter | ESLint 9 (`--max-warnings=0`) |
| Formatter | Prettier 3 |
| Static Analysis | SonarCloud |

---

## CI/CD Pipeline

Three jobs run on every push. PRs into `dev`, `preproduccion`, or `produccion` must pass all three before merge is allowed.

```
push → [lint] ─────┐
       [sonar] ────┤──→ [final ✅] → merge allowed
```

| Job | What it enforces |
|---|---|
| `lint` | ESLint with zero-warning policy — any warning fails the build |
| `sonar` | SonarCloud scan + Quality Gate — fails on any gate violation |
| `final` | Fan-in gate — explicitly fails if either upstream job failed |

Concurrency is configured with `cancel-in-progress: true` per ref. Stale runs are cancelled automatically when a new push arrives on the same branch.

---

## Branch Strategy

| Branch | Role |
|---|---|
| `main` | Source of truth |
| `dev` | Integration environment |
| `preproduccion` | Staging / QA gate |
| `produccion` | Production releases |

CI triggers on push to every branch. PR checks are enforced only for merges into `dev`, `preproduccion`, and `produccion`.

---

## API — Customers

Base path: `/customers`

| Method | Path | Description |
|---|---|---|
| `GET` | `/customers` | Return all records |
| `GET` | `/customers/name/:name` | Case-insensitive partial name search |
| `GET` | `/customers/type/:type` | Filter by type |
| `POST` | `/customers` | Create a customer *(in progress)* |
| `DELETE` | `/customers/:id` | Delete by ID |

---

## Getting Started

```bash
# Install dependencies
npm ci

# Development — watch mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Lint (enforces zero-warning policy)
npm run lint

# Format
npm run format
```

---

## Project Structure

```
src/
├── customers/
│   ├── DTO/                        # Input validation contracts
│   ├── customers.controller.ts     # Route handlers
│   ├── customers.entity.ts         # TypeORM entity
│   ├── customers.module.ts         # Feature module
│   └── customers.service.ts        # Business logic + DB layer
├── app.module.ts                   # Root module
└── main.ts                         # Bootstrap
.github/
└── workflows/
    └── ci.yml                      # Lint → SonarCloud → fan-in gate
```

---

## Status

Active lab. The CI pipeline is the primary artifact — the Customers module exists to give the pipeline something real to lint, analyze, and gate. Next: completing the CRUD and wiring the database connection.
