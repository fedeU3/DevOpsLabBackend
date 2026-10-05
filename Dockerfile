# Se construye desde la raiz del repo, que es el contexto que ve COPY:
#   docker build -t clerkiva-backend .
# Lo que no entra en la imagen esta en el .dockerignore de la raiz.

# ---------- Etapa 1: build ----------
# Imagen con Node 22 sobre Debian. Aca se instala todo (incluidas las devDependencies)
# y se compila el TypeScript. Nada de esta etapa llega a la imagen final salvo lo que
# se copie explicitamente con COPY --from=build.
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Primero solo los manifiestos: si no cambian, Docker reusa la capa de npm ci de la
# build anterior y no reinstala las dependencias cada vez que se toca el codigo.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Deja en node_modules solo las dependencias de produccion
RUN npm prune --omit=dev

# ---------- Etapa 2: runtime ----------
# Imagen limpia: sin codigo fuente, sin TypeScript, sin devDependencies.
FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# La imagen de Node trae el usuario "node"; correr como root no hace falta
USER node

# Solo documenta el puerto. La app escucha en process.env.PORT (3001 en el .env)
EXPOSE 3001

CMD ["node", "dist/main.js"]
