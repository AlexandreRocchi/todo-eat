# TodoEat

Application de gestion de recettes et de courses.

## Démarrage avec Docker

Pour lancer l'application complète avec Docker :

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Pour voir les logs
docker-compose logs -f
```

L'application sera accessible à l'adresse suivante :
- Frontend: http://localhost:5173
- API: http://localhost:4001

## Développement local

Pour le développement local sans Docker :

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

## Structure du projet

- `src/` : Code source de l'application React
- `api/` : API backend
- `db/` : Fichiers de base de données 