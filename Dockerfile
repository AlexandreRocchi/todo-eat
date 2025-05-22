FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Création d'un fichier .env pour les variables d'environnement
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:4001}

# Construction de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers de build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port 5173
EXPOSE 5173

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"] 