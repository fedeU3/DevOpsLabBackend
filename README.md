# Clerkiva — Backend

API REST de Clerkiva, un sistema de gestión de turnos. Hecha con NestJS + TypeORM sobre PostgreSQL (Supabase), autenticación con JWT y despliegue automático a un VPS con Docker.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 (Express) |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL (Supabase) con TypeORM 0.3 |
| Autenticación | JWT (`@nestjs/jwt` + Passport) y contraseñas con bcrypt |
| Calidad | ESLint 9 + Prettier, SonarCloud |
| Runtime | Node.js 22 |
| Despliegue | Docker, GitHub Container Registry (GHCR) y VPS con Docker Compose |

## Módulos

| Módulo | Para qué sirve |
|---|---|
| `auth` | Login y datos del usuario logueado |
| `usuarios` | Alta y búsqueda de usuarios, cambio de contraseña |
| `servicios` | ABM de los servicios que se pueden reservar |
| `turnos` | ABM de turnos, horarios ocupados y resumen por franja horaria |
| `localidades` | Catálogo de localidades |
| `provincias` | Catálogo de provincias |
| `home` | Health check |

Cada módulo sigue la misma estructura:

```
src/<modulo>/
├── <modulo>.module.ts       # Registra controller, service y entidad
├── <modulo>.entity.ts       # Mapeo de la tabla con TypeORM
├── <modulo>.service.ts      # Lógica de negocio (Repository de TypeORM)
├── <modulo>.controller.ts   # Endpoints REST
└── dto/                     # Validación de los datos de entrada (class-validator)
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/home` | Health check: responde `{ ok: true }` |
| POST | `/auth/login` | Recibe `usuario` y `password`, devuelve `{ token }` |
| GET | `/auth` | Datos del usuario logueado (requiere `Authorization: Bearer <token>`) |
| GET | `/usuarios` | Lista de usuarios |
| GET | `/usuarios/name/:name` | Busca usuarios por nombre |
| POST | `/usuarios` | Crea un usuario |
| PATCH | `/usuarios/:id/password` | Cambia la contraseña (pide la actual) |
| GET | `/servicios` | Lista de servicios |
| GET | `/servicios/nombre/:nombre` | Busca servicios por nombre |
| GET | `/servicios/:id` | Un servicio |
| POST / PUT / PATCH / DELETE | `/servicios[/:id]` | Crear, reemplazar, modificar y borrar |
| GET | `/turnos?idServicio=` | Lista de turnos, opcionalmente filtrada por servicio |
| GET | `/turnos/ocupados/:idServicio?fecha=YYYY-MM-DD` | Horarios ya tomados de un servicio en una fecha |
| GET | `/turnos/resumen?desde=YYYY-MM-DD&hasta=YYYY-MM-DD` | Cantidad y total facturado por franja (Mañana, Tarde y Noche) |
| GET | `/turnos/:id` | Un turno |
| POST / PUT / PATCH / DELETE | `/turnos[/:id]` | Crear, reemplazar, modificar y borrar |
| GET | `/localidades` · `/localidades/name/:name` | Catálogo de localidades |
| GET | `/provincias` · `/provincias/name/:name` | Catálogo de provincias |

La especificación OpenAPI está en [`swagger api-plantilla backend.yaml`](swagger%20api-plantilla%20backend.yaml).

> Por ahora solo `GET /auth` exige token. El `RolesGuard` y el decorador `@Roles` están en `src/auth`, pero todavía no se aplican a ningún endpoint.

## Desarrollo local

### Requisitos

- Node.js 22 y npm
- Una base PostgreSQL. El proyecto usa Supabase.

### Variables de entorno

Crear un archivo `.env` en la raíz. No se commitea: está en `.gitignore`.

```env
DATABASE_URL=postgresql://usuario:password@host:5432/postgres
JWT_SECRET=un-secreto-largo-y-aleatorio
JWT_EXPIRE=1h      # opcional, por defecto 1h
PORT=3001          # opcional, por defecto 3000
```

### Base de datos

TypeORM **no** crea las tablas (`synchronize` está desactivado): tienen que existir en la base. Para cargar datos de prueba, ejecutar [`database/seed.sql`](database/seed.sql) en el SQL Editor de Supabase. El seed crea usuarios con la contraseña `Pass1234`, por ejemplo `admin`.

### Comandos

```bash
npm install          # instalar dependencias
npm run start:dev    # levantar con recarga automática
npm run build        # compilar a dist/
npm run start:prod   # correr lo compilado
npm run lint         # ESLint + Prettier (corrige lo que puede)
npm run format       # solo Prettier
npm test             # tests unitarios (Jest)
```

El formato lo define [`.prettierrc`](.prettierrc): comillas simples y coma final. El código usa saltos de línea LF ([`.gitattributes`](.gitattributes)).

## CI/CD

El pipeline está en [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml).

| Evento | Qué corre |
|---|---|
| Push a cualquier rama, o PR a `dev`, `preprod` o `prod` | **Lint** y **SonarCloud** |
| Push a `preprod` | Lint + Sonar → **build de la imagen** → **deploy a staging** |
| Push a `prod` | Lint + Sonar → **build de la imagen** → **deploy a producción** |

### Flujo de ramas

```
main ──merge──► preprod ──merge──► prod
                (staging)          (producción)
```

### Build

Construye la imagen con el [`Dockerfile`](Dockerfile) (multi-stage: compila en una etapa y la imagen final solo tiene `dist/` y las dependencias de producción) y la sube a GHCR con dos tags:

- `ghcr.io/fedeu3/clerkiva-backend:<rama>`: la que usa el VPS.
- `ghcr.io/fedeu3/clerkiva-backend:<sha>`: queda guardada para volver a una versión anterior.

### Deploy

Se conecta por SSH al VPS, copia [`compose.yml`](compose.yml) y el `.env` del ambiente a `/opt/clerkiva/staging` o `/opt/clerkiva/production`, descarga la imagen nueva y recrea solo el contenedor del backend. El backend no se publica afuera del VPS: lo alcanza el nginx del frontend por la red interna de Compose.

### Configuración en GitHub

**Secretos del repositorio** (Settings → Secrets and variables → Actions):

| Secreto | Valor |
|---|---|
| `SONAR_TOKEN` | Token de SonarCloud |
| `SONAR_ORG` | Key de la organización en SonarCloud |
| `SONAR_PROJECT_KEY` | Key del proyecto en SonarCloud |

**Por ambiente** (Settings → Environments → `staging` y `production`):

| Nombre | Tipo | Valor |
|---|---|---|
| `VPS_HOST` | Secreto | IP o dominio del VPS |
| `VPS_USER` | Secreto | Usuario SSH |
| `VPS_SSH_KEY` | Secreto | Clave privada SSH completa |
| `VPS_KNOWN_HOSTS` | Secreto | Salida de `ssh-keyscan <VPS_HOST>` |
| `ENV_FILE` | Secreto | Contenido del `.env` de la app para ese ambiente |
| `HTTP_PORT` | Variable | Puerto del frontend en el VPS (distinto en cada ambiente) |

Para pedir aprobación manual antes de desplegar a producción: Settings → Environments → `production` → **Required reviewers**.

### Claves SSH

Hay dos tipos de clave, con usos distintos:

- **Clave del deploy:** la usa GitHub Actions. Se genera **una sola vez**: la privada va al secreto `VPS_SSH_KEY` y la pública al VPS.
- **Claves personales:** una **por cada máquina** desde la que se entra al VPS. No se copian claves privadas entre máquinas: si se pierde una, se borra solo su línea de `authorized_keys`.

Generar un par de claves (sin passphrase para la del deploy, con passphrase para las personales):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/<nombre> -C "<descripcion>"
cat ~/.ssh/<nombre>.pub    # clave pública: la que se copia al VPS
```

Autorizar una clave pública nueva en el VPS, desde una máquina que ya tiene acceso:

```bash
ssh-copy-id -i ~/.ssh/<nombre>.pub <usuario>@<IP_DEL_VPS>
```

O, ya dentro del VPS, agregar la línea de la clave pública al final de `~/.ssh/authorized_keys`.

Valor del secreto `VPS_KNOWN_HOSTS`:

```bash
ssh-keyscan <IP_DEL_VPS>
```

## Licencia

Privado — UNLICENSED.
