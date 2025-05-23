# TodoEat 🍽️

Application de gestion de listes de courses avec interface moderne et responsive.

## ✨ Fonctionnalités

- 📝 **Gestion de listes de courses** - Ajout, modification, suppression d'articles
- ✅ **Suivi des achats** - Cocher les articles achetés
- 📋 **Templates** - Sauvegarder et réutiliser des listes
- 👨‍🍳 **Recettes** - Ajouter automatiquement les ingrédients à votre liste
- 📱 **Responsive Design** - Interface optimisée mobile et desktop
- 🔐 **Authentification** - Protection par mot de passe
- 📄 **Export PDF** - Générer une liste de courses imprimable

## 🚀 Démarrage rapide avec Docker

### Prérequis
- Docker Desktop installé
- Docker Compose inclus

### Méthode 1: Scripts automatiques

**Windows:**
```bash
start-docker.bat
```

**Linux/Mac:**
```bash
./start-docker.sh
```

### Méthode 2: Commandes manuelles

```bash
# Créer le fichier .env
echo "VITE_API_URL=http://localhost:4001
VITE_AUTH_PASSWORD=test123
MYSQL_ROOT_PASSWORD=root123
MYSQL_PASSWORD=todoeat123
DB_PASSWORD=todoeat123" > .env

# Démarrer l'application
docker-compose up --build

# En arrière-plan
docker-compose up --build -d
```

### Accès à l'application

- **Application**: http://localhost:5173
- **API**: http://localhost:4001
- **Base de données**: localhost:3306
- **Mot de passe**: `test123`

## 🛠️ Développement local

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🎨 Système de Design

L'application utilise un système de design moderne basé sur:

- **Tailwind CSS** avec configuration personnalisée
- **Composants réutilisables** (Button, Input, Card, Modal)
- **Palette de couleurs cohérente** avec tons verts
- **Typography responsive** avec la police Inter
- **Animations fluides** et micro-interactions

Voir [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) pour plus de détails.

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints optimisés** (xs, sm, md, lg, xl, 2xl)
- **Navigation adaptative** (hamburger menu sur mobile)
- **Touch-friendly** interfaces
- **Performance optimisée** sur tous les appareils

## 🔧 Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et dev server
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **React Router** pour la navigation

### Backend & Base de données
- **Node.js** avec Express (API)
- **MariaDB** pour la persistance
- **Docker** pour la containerisation

### DevOps
- **Docker & Docker Compose**
- **Nginx** pour la production
- **Health checks** et monitoring
- **Multi-stage builds** optimisés

## 📋 Commandes Docker utiles

```bash
# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart frontend

# Arrêter l'application
docker-compose down

# Supprimer les données (ATTENTION)
docker-compose down -v

# Reconstruire sans cache
docker-compose build --no-cache
```

## 🔍 Troubleshooting

### Port déjà utilisé
Modifiez le port dans `docker-compose.yml`:
```yaml
ports:
  - "3000:5173"  # Utilise le port 3000
```

### Problème de build
```bash
docker-compose build --no-cache
docker system prune -a
```

### Réinitialiser la base de données
```bash
docker-compose down -v
docker-compose up mariadb -d
# Attendre que MariaDB soit prêt
docker-compose up api frontend
```

## 📄 Documentation

- [Configuration Docker](./DOCKER_SETUP.md)
- [Système de Design](./DESIGN_SYSTEM.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour simplifier vos courses alimentaires** 