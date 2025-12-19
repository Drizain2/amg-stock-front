# 📦 Stock Management System - Frontend

Système de gestion de stock multi-entreprises développé avec Vue.js 3, TypeScript et Tailwind CSS.

## 🚀 Technologies

- **Vue.js 3** - Framework progressif JavaScript
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Pinia** - State management
- **Vue Router** - Routing
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **VeeValidate + Yup** - Validation de formulaires
- **Chart.js** - Graphiques
- **date-fns** - Manipulation de dates

## 📋 Prérequis

- Node.js >= 18.x
- npm >= 9.x ou yarn >= 1.22.x

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configuration de l'environnement

Créer un fichier `.env.development` à la racine :

```env
VITE_APP_TITLE=Stock Management System
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### 4. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Formatage du code
npm run format

# Vérification des types
npm run type-check
```

## 📁 Structure du projet

```
src/
├── assets/          # Ressources statiques (images, styles)
├── components/      # Composants réutilisables
├── composables/     # Composition API hooks
├── layouts/         # Layouts de l'application
├── router/          # Configuration du routing
├── services/        # Services API et utilitaires
├── stores/          # Pinia stores (state management)
├── types/           # Définitions TypeScript
├── utils/           # Fonctions utilitaires
├── views/           # Pages de l'application
├── App.vue          # Composant racine
└── main.ts          # Point d'entrée
```

## 🎨 Conventions de code

### Nomenclature des composants

- **PascalCase** pour les composants : `UserCard.vue`, `ProductList.vue`
- **camelCase** pour les composables : `useAuth.ts`, `useApi.ts`
- **kebab-case** pour les fichiers de configuration

### Structure d'un composant Vue

```vue
<script setup lang="ts">
// Imports
import { ref } from 'vue'

// Props & Emits
interface Props {
  title: string
}
const props = defineProps<Props>()

// State
const isLoading = ref(false)

// Methods
const handleClick = () => {
  // ...
}
</script>

<template>
  <div>
    <!-- Template -->
  </div>
</template>

<style scoped>
/* Styles scoped */
</style>
```

## 🔐 Authentification

Le système utilise Laravel Sanctum pour l'authentification :

1. L'utilisateur se connecte via `/auth/login`
2. Un token est retourné et stocké dans le localStorage
3. Le token est automatiquement ajouté aux headers des requêtes API

## 🌐 Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_APP_TITLE` | Titre de l'application | Stock Management |
| `VITE_API_BASE_URL` | URL de l'API backend | http://localhost:8000/api |
| `VITE_APP_ENV` | Environnement | development/production |

## 🧪 Tests (à venir)

```bash
# Tests unitaires
npm run test:unit

# Tests e2e
npm run test:e2e
```

## 📝 Bonnes pratiques

1. **Toujours typer vos composants et fonctions**
2. **Utiliser les composables pour la logique réutilisable**
3. **Privilégier Composition API à Options API**
4. **Garder les composants petits et focalisés**
5. **Utiliser Pinia pour l'état global**
6. **Documenter les fonctions complexes**

## 🤝 Contribution

1. Créer une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
2. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
3. Push vers la branche (`git push origin feature/AmazingFeature`)
4. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

Votre équipe de développement

## 🐛 Support

Pour tout problème ou question, ouvrir une issue sur GitHub.