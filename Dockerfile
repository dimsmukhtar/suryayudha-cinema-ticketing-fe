# =========================
# STAGE 1 — BUILD
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build arguments (Vite env)
ARG VITE_API_BASE_URL
ARG VITE_MIDTRANS_CLIENT_KEY

# Set env for Vite build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MIDTRANS_CLIENT_KEY=$VITE_MIDTRANS_CLIENT_KEY

# Build app
RUN npm run build

# =========================
# STAGE 2 — PRODUCTION
# =========================
FROM nginx:stable AS production

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build result
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]