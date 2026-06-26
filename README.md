# 🌍 Developer Connect

Une plateforme communautaire moderne conçue pour connecter, valoriser et propulser les talents technologiques africains (Développeurs, Concepteurs, Product Managers, etc.). Découvrez des profils inspirants, explorez des projets innovants et participez à des événements passionnants.

---

## 🚀 Fonctionnalités Principales

- **Découverte de Profils** : Explorez les talents technologiques d'Afrique par ville, pays et compétences.
- **Vitrine de Projets** : Découvrez les projets construits par la communauté locale.
- **Gestion des Événements** : Participez à des webinaires, formations sur l'IA, meetups JavaScript et hackathons.
- **Espace Administrateur** : Un panneau d'administration sécurisé pour gérer les profils, valider les projets et publier de nouveaux événements.
- **Simulation d'Authentification Intégrée** : Un système robuste de simulation d'authentification sociale (Google, GitHub, LinkedIn) pour tester et prévisualiser l'application.

---

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- Un gestionnaire de paquets comme **npm** (inclus avec Node.js), **yarn** ou **pnpm**

---

## 📦 Installation Locale

Suivez ces étapes simples pour faire fonctionner l'application sur votre machine :

### 1. Télécharger ou Cloner le Projet
Si vous avez exporté le projet depuis AI Studio :
- Extrayez l'archive ZIP dans le dossier de votre choix.

Si vous utilisez Git :
```bash
git clone <url-du-depot>
cd developer-connect
```

### 2. Installer les Dépendances
Dans le répertoire racine du projet, lancez la commande suivante :
```bash
npm install
```

### 3. Configurer l'Environnement
Copiez le fichier `.env.example` pour créer votre propre fichier `.env` :
```bash
cp .env.example .env
```
Ouvrez le fichier `.env` nouvellement créé et configurez vos variables (par exemple, votre clé API Gemini si vous souhaitez activer des fonctionnalités d'IA) :
```env
GEMINI_API_KEY="votre_cle_api_gemini_ici"
APP_URL="http://localhost:3000"
```

### 4. Lancer le Serveur de Développement
Pour lancer l'application en mode développement local :
```bash
npm run dev
```
L'application sera accessible à l'adresse suivante :
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🏗️ Production & Déploiement

### Compiler le Projet
Pour créer une version optimisée pour la production :
```bash
npm run build
```
Cette commande compile le client frontend avec Vite et produit un fichier serveur optimisé dans `dist/server.cjs` à l'aide d'Esbuild.

### Démarrer en Production
Pour lancer le serveur de production compilé :
```bash
npm run start
```

---

## 📂 Structure du Projet

```text
├── src/                  # Code source de l'application
│   ├── components/       # Composants d'interface (Landing, Dashboard, Auth, Admin...)
│   ├── context/          # Contexte de l'application (Gestion d'état global et persistence)
│   ├── i18n.ts           # Fichier d'internationalisation (Français / Anglais)
│   ├── data.ts           # Données initiales et structures
│   ├── types.ts          # Définitions des types TypeScript
│   └── main.tsx          # Point d'entrée React
├── server.ts             # Serveur Express principal (avec middleware d'intégration Vite)
├── package.json          # Dépendances et scripts de build
├── vite.config.ts        # Configuration du bundler Vite
└── .env.example          # Exemple de fichier de configuration d'environnement
```
