# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig*.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Inject API base URL at build time (可通过 docker-compose build arg 覆盖)
ARG VITE_API_BASE_URL=http://localhost:3001
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ── Serve stage ───────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
