FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/tsconfig/package.json ./packages/tsconfig/
RUN npm install --workspace=@golfbet/api --workspace=@golfbet/shared --include-workspace-root

# Copy source
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma Client
RUN cd apps/api && npx prisma generate

# Build
RUN npm run build --workspace=@golfbet/api

EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
