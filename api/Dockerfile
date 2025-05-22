FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache mysql-client

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Exposition du port 4001
EXPOSE 4001

# Script d'attente et d'initialisation de la base de données
COPY ./bin/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Démarrage de l'API
CMD ["npm", "start"] 