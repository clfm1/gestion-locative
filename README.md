# 🏠 Gestion Locative - Application Full-Stack

Application moderne de gestion immobilière avec interface responsive, système de notes et agenda intégré.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

## ✨ Fonctionnalités

### 📊 Gestion locative complète
- **Biens immobiliers** - Gestion avec photos et détails complets
- **Locataires** - Profils et contacts
- **Locations** - Association biens-locataires avec plusieurs locataires par bien
- **Organisations** - Regroupement de biens par entités
- **Frais** - Suivi des paiements et charges

### 📝 Organisation personnelle
- **Bloc-notes** - Notes colorées avec système d'épinglage (6 couleurs)
- **Agenda** - Calendrier mensuel avec vue liste (6 types d'événements)

### 🎨 Personnalisation
- **7 thèmes de couleurs** - Interface personnalisable
- **2 modes d'affichage** - Clair / Sombre
- **8 couleurs de cartes** - Customisation des blocs

### 📱 Design responsive
- **Menu burger mobile** - Navigation adaptative
- **Optimisé mobile/tablette/desktop**
- **PWA-ready** - Installable sur mobile

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/VOTRE_USERNAME/gestion-locative.git
cd gestion-locative
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos variables
npx prisma migrate dev
npm run dev
```

3. **Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Éditer .env avec l'URL du backend
npm run dev
```

4. **Ouvrir l'application**
```
http://localhost:3000
```

## 🏗️ Stack technique

### Backend
- **Node.js** + **Express** - Serveur API RESTful
- **TypeScript** - Typage statique
- **Prisma** - ORM moderne
- **PostgreSQL** - Base de données (SQLite en dev)
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hashing des mots de passe

### Frontend
- **React 18** - Interface utilisateur
- **TypeScript** - Type safety
- **Vite** - Build tool rapide
- **Tailwind CSS** - Styling utilitaire
- **React Query** - Gestion des données serveur
- **Zustand** - State management
- **React Router** - Navigation

## 📦 Structure du projet

```
gestion-locative/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Modèles de données
│   │   └── migrations/      # Migrations SQL
│   ├── src/
│   │   ├── routes/          # Endpoints API
│   │   ├── middleware/      # Auth middleware
│   │   └── index.ts         # Serveur principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages de l'app
│   │   ├── store/           # State management
│   │   └── lib/             # Utilitaires
│   └── package.json
└── README.md
```

## 🌐 Déploiement

### Render (recommandé)

Guides complets fournis :
- **Guide rapide** : `DEPLOIEMENT_RENDER_RAPIDE.md` (30 min)
- **Guide détaillé** : `DEPLOIEMENT_RENDER.md` (1h)

### Étapes résumées

1. **PostgreSQL** sur Render (gratuit)
2. **Backend** Web Service
3. **Frontend** Static Site

Coût : **Gratuit** pour commencer, ~14€/mois en production

## 📱 Responsive Design

L'application est optimisée pour tous les écrans :
- 📱 Mobile (< 640px) - Menu burger, layout adapté
- 📱 Tablette (640-1024px) - 2 colonnes
- 💻 Desktop (> 1024px) - Menu horizontal, 3-4 colonnes

Voir `RESPONSIVE_MOBILE.md` pour plus de détails.

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation des données backend
- ✅ CORS configuré
- ✅ Variables d'environnement sécurisées

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `RECAPITULATIF_FINAL.md` | Vue d'ensemble complète |
| `DEPLOIEMENT_RENDER.md` | Guide de déploiement détaillé |
| `RESPONSIVE_MOBILE.md` | Informations responsive design |
| `BLOC_NOTES_ET_AGENDA.md` | Features Notes et Agenda |
| `TEST_MOBILE_RAPIDE.md` | Guide de test mobile |

## 🎯 Roadmap

### Actuellement disponible ✅
- Gestion complète des biens, locataires, locations
- Système de notes colorées avec épinglage
- Calendrier avec types d'événements
- Personnalisation complète (thèmes, couleurs)
- Design responsive mobile/desktop

### Améliorations futures 🚧
- [ ] Export PDF des contrats et factures
- [ ] Notifications par email
- [ ] Statistiques avancées et graphiques
- [ ] Multi-langue (i18n)
- [ ] PWA complète avec mode offline
- [ ] Intégration paiements en ligne

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous license MIT. Voir `LICENSE` pour plus d'informations.

## 👤 Auteur

**Votre Nom**
- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Render](https://render.com/)

## 📊 Statistiques

- **9 modèles** de données
- **40+ endpoints** API
- **10 pages** React
- **100%** responsive
- **7 thèmes** de couleurs
- **TypeScript** partout

---

**⭐ Si ce projet vous a aidé, n'hésitez pas à mettre une étoile !**

[🚀 Voir la démo en ligne](https://votre-app.onrender.com) (après déploiement)
