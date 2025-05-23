FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache mysql-client netcat-openbsd

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Exposition du port 4001
EXPOSE 4001

# Démarrage de l'API
CMD ["npm", "start"] 