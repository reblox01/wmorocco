# -------- Stage 1: Install dependencies -------- #
FROM node:18-alpine AS deps
WORKDIR /app

# Install build deps for native modules (e.g., bcrypt / sharp)
RUN apk add --no-cache --virtual .build-deps python3 make g++

# Copy manifest files and Prisma schema before installing packages so postinstall (Prisma generate) succeeds
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies (runs postinstall scripts)
RUN npm ci

# -------- Stage 2: Build application -------- #
FROM node:18-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copy installed node_modules from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source
COPY . .

# Generate Prisma client and build Next.js
RUN npx prisma generate && npm run build

# -------- Stage 3: Production image -------- #
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary artifacts from builder stage
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"] 