# ==============================================================================
# ServicePro OS — Admin & Staff Web Portal Production Dockerfile
# Multi-stage minimal Nginx Alpine container
# ==============================================================================

# Stage 1: Build React 19 + Vite Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy web source files
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Minimal Nginx Web Server
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled SPA dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
