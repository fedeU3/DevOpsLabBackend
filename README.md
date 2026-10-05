# NestJS Backend Template

<p align="left">
  <img src="https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=flat-square&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-0.3.20-FE0803?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-30.x-C21325?style=flat-square&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-9.x_flat_config-4B32C3?style=flat-square&logo=eslint&logoColor=white" />
</p>

A production-oriented NestJS backend template demonstrating a feature-based modular architecture for a business management domain — covering orders, inventory, purchasing, invoicing, and customer/supplier management across ~20 fully-scaffolded TypeORM-mapped modules.

---

## Overview

This repository is a **reference implementation and scaffold** for building scalable REST APIs with NestJS. It serves as a working template that enforces a strict, consistent layer separation across every domain module:

```
Entity (TypeORM) → DTO (class-based) → Service (Repository pattern) → Controller (REST) → Module
```

Every feature module is self-contained, independently importable, and follows the same structural contract — making the codebase trivially extensible and easy to onboard onto.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | NestJS (Express platform) | 11.0.1 |
| Language | TypeScript | 5.7.3 |
| ORM | TypeORM + @nestjs/typeorm | 0.3.20 / 11.0.0 |
| Runtime | Node.js | 22.x |
| HTTP | @nestjs/platform-express | 11.0.1 |
| Reactive | RxJS | 7.8.1 |
| Testing | Jest + ts-jest + Supertest | 30.x / 29.x / 7.x |
| Linting | ESLint 9 flat config + typescript-eslint | 9.18.0 / 8.20.0 |
| Formatting | Prettier | 3.4.2 |

**TypeScript compiler options of note:**
- `module`: `nodenext` + `moduleResolution: nodenext` (ESM-compatible resolution)
- `target`: `ES2023`
- `emitDecoratorMetadata: true` + `experimentalDecorators: true` (required for TypeORM/DI)
- `strictNullChecks: true`

---

## Architecture

### Feature Module Structure

Every domain module follows an identical file layout:

```
src/{feature}/
├── {feature}.module.ts       # NestJS module — wires the slice together
├── {feature}.entity.ts       # TypeORM entity with column decorators
├── {feature}.service.ts      # Business logic — injects Repository<Entity>
├── {feature}.controller.ts   # REST controller — routes to service methods
├── {feature}.controller.spec.ts  # Unit test for controller
└── DTO/
    └── Create{Feature}DTO.ts # Input validation shape for POST endpoints
```

### Service Pattern

All services follow the TypeORM Repository pattern via NestJS DI:

```typescript
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly CustomersRepository: Repository<CustomersEntity>,
  ) {}

  getAll() {
    return this.CustomersRepository.find();
  }

  getByName(nombre: string) {
    return this.CustomersRepository.find({
      where: { nombre: ILike(`%${nombre}%`) },
    });
  }
}
```

---

## Domain Modules

The template covers a full business management domain split into ~20 feature slices:

| Module | Domain Responsibility |
|---|---|
| `customers` | Customer records and lookup |
| `employees` | Employee management |
| `employee_privileges` | Role-to-employee privilege mappings |
| `privileges` | Privilege/role definitions |
| `orders` | Order lifecycle management |
| `order_details` | Line items per order |
| `order_status` | Order status catalog |
| `order_details_status` | Status per order line item |
| `order_tax_status` | Tax status catalog for orders |
| `products` | Product catalog |
| `suppliers` | Supplier records |
| `shippers` | Shipping provider records |
| `invoices` | Invoice generation and tracking |
| `inventory_transactions` | Stock movement records |
| `inventory_transactions_types` | Transaction type catalog |
| `purchase_orders` | Purchase order management |
| `purchase_order_details` | Line items per purchase order |
| `purchase_order_status` | Purchase order status catalog |
| `sales_reports` | Sales reporting aggregation |
| `strings` | Localization / string table |
| `ejemplo` | Minimal reference module (scaffold example) |

---

## Getting Started

### Prerequisites

- Node.js 18+ (22.x recommended)
- npm 10+
- A compatible SQL database (PostgreSQL recommended — TypeORM entities use `bytea` column type)

### Installation

```bash
npm install
```

### Database Configuration

Configure your database connection in your environment. TypeORM is imported per-module — set the connection in `AppModule` using `TypeOrmModule.forRoot(...)` with your DB credentials:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true, // disable in production
})
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start` | Start in production mode (compiled) |
| `npm run start:dev` | Start with file-watch (hot reload) |
| `npm run start:debug` | Start with debugger attached + watch |
| `npm run start:prod` | Run compiled output from `dist/` |
| `npm run build` | Compile TypeScript via `nest build` |
| `npm run format` | Format all source files with Prettier |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:cov` | Run unit tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:debug` | Run tests with Node.js debugger attached |

Default port: `3000` (overridable via `PORT` environment variable)

---

## Project Structure

```
.
├── src/
│   ├── main.ts                    # Bootstrap — NestFactory.create + listen
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── customers/                 # Feature module (representative)
│   ├── employees/
│   ├── orders/
│   ├── order_details/
│   ├── order_status/
│   ├── products/
│   ├── suppliers/
│   ├── invoices/
│   ├── inventory_transactions/
│   ├── purchase_orders/
│   └── ...                        # ~20 domain modules total
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── tsconfig.json                  # nodenext + ES2023 + strict decorators
├── eslint.config.mjs              # ESLint 9 flat config
├── nest-cli.json
└── package.json
```

---

## Linting & Code Quality

ESLint is configured with the new **flat config** format (`eslint.config.mjs`) using `typescript-eslint` with `recommendedTypeChecked` rules and `eslint-plugin-prettier` for format enforcement. This means lint errors surface formatting violations directly alongside type-unsafe patterns.

```bash
npm run lint     # lint + autofix
npm run format   # prettier write pass
```

---

## License

Private — UNLICENSED.
