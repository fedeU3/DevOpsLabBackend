# DevOpsLabBackend

[![CI Pipeline](https://github.com/fedeU3/DevOpsLabBackend/actions/workflows/ci.yml/badge.svg)](https://github.com/fedeU3/DevOpsLabBackend/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DevOpsLabBackend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DevOpsLabBackend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DevOpsLabBackend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DevOpsLabBackend)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> A backend engineering sandbox for experimenting with modern DevOps tooling, CI/CD pipelines, static analysis, and development workflow automation. Built on NestJS and TypeScript — the application logic is intentionally minimal; the infrastructure and tooling are the product.

---

## Overview

**DevOpsLabBackend** is a controlled laboratory environment designed to explore, validate, and iterate on DevOps practices in a real backend codebase. Rather than being a feature-driven application, this repository treats the engineering workflow itself as the subject of experimentation.

The stack is kept deliberately simple so that the focus remains on the surrounding infrastructure: how code is linted, tested, analyzed, containerized, and deployed — not what the code does at runtime.

This is the kind of repository you build when you want to answer questions like:

- *How does SonarQube behave when integrated into a GitHub Actions pipeline?*
- *What does a clean ESLint + Prettier configuration look like on a TypeScript monolayer?*
- *How do you structure a Docker workflow for local development vs. CI environments?*

---

## Purpose

This repository exists to serve as a **living reference implementation** for backend DevOps practices. Specific objectives:

- Evaluate and iterate on CI/CD pipeline design using GitHub Actions
- Integrate and tune static code analysis with SonarQube (SonarCloud)
- Establish an opinionated ESLint configuration tailored for NestJS + TypeScript projects
- Validate Dockerization strategies for backend services
- Experiment with test coverage enforcement and quality gate thresholds
- Document reusable workflow patterns that can be ported to production repositories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (LTS) |
| Framework | NestJS 10 |
| Language | TypeScript 5 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Static Analysis | SonarQube / SonarCloud |
| Linting | ESLint (typescript-eslint) |
| Formatting | Prettier |
| Testing | Jest + Supertest |
| Package Manager | npm |

---

## Features

**CI/CD Pipeline**
- Automated lint, build, and test execution on every push and pull request
- Quality gate enforcement via SonarCloud integration
- Coverage reports uploaded to SonarCloud on each pipeline run
- Branch protection rules enforced through status checks

**Static Analysis & Code Quality**
- SonarQube project configured with custom quality gate thresholds
- ESLint ruleset tuned for strict TypeScript and NestJS patterns
- Prettier enforced in CI — formatting deviations break the build
- Pre-commit hooks via Husky to catch issues before they reach the pipeline

**Containerization**
- Multi-stage Dockerfile optimized for image size
- `docker-compose.yml` for local development parity
- Environment variable management via `.env` with `.env.example` template

**Testing**
- Unit test suite with Jest
- E2E test scaffold with Supertest
- Coverage threshold enforced via Jest configuration
- Coverage output wired into SonarCloud analysis

---

## Installation

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Docker and Docker Compose (optional, for containerized setup)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/fedeU3/DevOpsLabBackend.git
cd DevOpsLabBackend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start in development mode
npm run start:dev
```

### Docker Setup

```bash
# Build and start with Docker Compose
docker compose up --build

# Run in detached mode
docker compose up -d

# Tear down
docker compose down
```

---

## Usage

Once running, the API is available at `http://localhost:3000`.

The application exposes a minimal set of endpoints designed to give the CI/CD pipeline and quality tools something real to analyze, lint, and test — without introducing unnecessary business complexity.

```bash
# Health check
curl http://localhost:3000/health

# API base
curl http://localhost:3000/api
```

Swagger documentation (if enabled):

```
http://localhost:3000/api/docs
```

---

## Available Scripts

```bash
# Development
npm run start           # Start in production mode
npm run start:dev       # Start with watch mode (hot reload)
npm run start:debug     # Start with debug mode enabled

# Build
npm run build           # Compile TypeScript to dist/

# Code Quality
npm run lint            # Run ESLint across the codebase
npm run lint:fix        # Run ESLint with auto-fix
npm run format          # Apply Prettier formatting
npm run format:check    # Check formatting without applying changes

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage report
npm run test:e2e        # Run end-to-end tests
```

---

## CI/CD and Quality Workflows

The pipeline is defined in `.github/workflows/` and is structured around three primary concerns:

### Pipeline Stages

```
Push / Pull Request
        │
        ▼
┌───────────────┐
│   Lint + Format│  ← ESLint, Prettier check
└───────┬───────┘
        │
        ▼
┌───────────────┐
│     Build     │  ← tsc compilation
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Test + Cover │  ← Jest, coverage report
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ SonarCloud    │  ← Static analysis, quality gate
│ Analysis      │
└───────────────┘
```

### Quality Gate Configuration

SonarCloud is configured to enforce the following thresholds (adjustable via `sonar-project.properties`):

| Metric | Threshold |
|---|---|
| Coverage on new code | ≥ 80% |
| Duplicated lines on new code | ≤ 3% |
| Maintainability rating | A |
| Reliability rating | A |
| Security rating | A |

### Workflow Files

| File | Purpose |
|---|---|
| `.github/workflows/ci.yml` | Main CI pipeline (lint → build → test → analyze) |
| `sonar-project.properties` | SonarCloud project configuration |
| `.eslintrc.js` | ESLint ruleset |
| `.prettierrc` | Prettier configuration |
| `jest.config.ts` | Jest and coverage configuration |

---

## Future Experiments

Planned iterations and areas of exploration:

- [ ] **Semantic Release** — Automate versioning and changelog generation from conventional commits
- [ ] **OWASP Dependency Check** — Integrate vulnerability scanning into the CI pipeline
- [ ] **Trivy** — Container image scanning in the Docker build stage
- [ ] **Kubernetes manifests** — Deploy the service to a local k8s cluster (minikube / kind)
- [ ] **Helm chart** — Package the application for Helm-based deployments
- [ ] **OpenTelemetry** — Instrument the app with distributed tracing
- [ ] **GitHub Environments** — Introduce staging/production environment gates in the pipeline
- [ ] **Renovate Bot** — Automate dependency updates via pull requests
- [ ] **Commitlint** — Enforce conventional commit format in CI

---

## Repository Philosophy

This repository operates on a few core principles:

**Tooling over features.** The application's runtime behavior is secondary. What matters here is how the codebase is built, validated, and shipped.

**Reproducibility.** Any developer cloning this repository should be able to bring up a fully working local environment and passing CI pipeline with minimal configuration.

**Incremental complexity.** Each experiment is introduced in isolation so its impact can be measured clearly. No big-bang changes.

**Documentation as a deliverable.** Workflow decisions are documented here — not just in code comments. The README is part of the engineering artifact.

---

## Project Structure

```
DevOpsLabBackend/
├── .github/
│   └── workflows/          # GitHub Actions pipeline definitions
├── src/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts     # End-to-end test suite
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── sonar-project.properties
├── tsconfig.json
└── tsconfig.build.json
```

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

---

<p align="center">
  Built as an engineering laboratory — not a product. Contributions, suggestions, and forks are welcome.
</p>