# Étape de build
FROM node:20-alpine as build

WORKDIR /app

# Installation des dépendances système pour les builds natives si nécessaire
RUN apk add --no-cache libc6-compat

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation de TOUTES les dépendances (dev + prod) pour le build
RUN npm ci --silent

# Copie du reste des fichiers du projet
COPY . .

# Variables d'environnement pour la build
ARG VITE_API_URL
ARG VITE_AUTH_PASSWORD
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:4001}
ENV VITE_AUTH_PASSWORD=${VITE_AUTH_PASSWORD}
ENV NODE_ENV=production

# Construction de l'application
RUN npm run build

# Vérification que le build s'est bien passé
RUN ls -la dist/

# Étape de production avec Nginx
FROM nginx:alpine

# Installation de curl pour le health check
RUN apk add --no-cache curl

# Suppression complète des configurations existantes
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers de build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration nginx simple et directe
RUN echo 'server { \
    listen 80 default_server; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /health { \
        return 200 "OK"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Vérification des fichiers
RUN ls -la /usr/share/nginx/html/
RUN cat /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"] 