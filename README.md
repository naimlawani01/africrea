# 🎨 Africréa - Plateforme de Formation Créative

Plateforme de gestion et suivi des étudiants créatifs pour Africréa - Graphisme, Animation 3D, Audiovisuel.

![Africréa Logo](../New%20logo%20Africreaa.png)

## ✨ Fonctionnalités

### 1. Organisation par Pôles Métiers
- Segmentation automatique par catégories (Graphisme, Animation 3D, Audiovisuel)
- Espaces de travail dédiés avec ressources spécifiques

### 2. Gestion des Défis Hebdomadaires
- Module de challenges techniques
- Dépôt de travaux (images, vidéos, rendus 3D)
- Corrections interactives avec feedback

### 3. Module Cinéma & Audiovisuel
- Vidéothèque d'observation avec guides d'analyse
- Accès aux projets professionnels
- Gestion du matériel (réservations)

### 4. Suivi de Progression et Portfolio
- Historique complet des travaux
- Génération automatique de portfolio
- Carnet de notes évolutif pour les administrateurs

### 5. Organisation du Présentiel
- Gestion des Masterclass et ateliers
- Système d'inscription aux événements

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Installer les dépendances**
```bash
cd africrea-platform
npm install
```

2. **Configurer la base de données**
```bash
npx prisma generate
npx prisma db push
```

3. **Alimenter la base de données avec des données de test**
```bash
npm run db:seed
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## 📧 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@africrea.com | admin123 |
| Formateur | jean.marc@africrea.com | trainer123 |
| Étudiant | student1@email.com | student123 |

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Style**: Tailwind CSS
- **Base de données**: SQLite + Prisma
- **Authentification**: NextAuth.js v5
- **Animations**: Framer Motion
- **Icônes**: Lucide React

## 📁 Structure du projet

```
africrea-platform/
├── prisma/
│   ├── schema.prisma     # Schéma de la BDD
│   └── seed.ts           # Données initiales
├── src/
│   ├── app/              # Pages et routes
│   │   ├── (auth)/       # Pages d'auth
│   │   ├── dashboard/    # Tableau de bord
│   │   └── api/          # API routes
│   ├── components/       # Composants réutilisables
│   ├── lib/              # Utilitaires
│   └── types/            # Types TypeScript
└── public/               # Assets statiques
```

## 🎨 Charte Graphique

- **Couleur principale**: `#27ad65` (Vert Africréa)
- **Couleur secondaire**: `#facc17` (Or/Jaune)
- **Police titre**: Playfair Display
- **Police corps**: Source Sans 3

## 📄 License

© 2024 Africréa. Tous droits réservés.

