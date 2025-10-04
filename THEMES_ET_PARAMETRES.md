# 🎨 Système de Thèmes et Paramètres

## ✨ Nouvelles fonctionnalités ajoutées

### 1. **Système de thèmes multi-couleurs** 🌈

7 thèmes de couleurs disponibles:
- 🔵 **Bleu Océan** (par défaut)
- 💜 **Violet Mystique**
- 🟢 **Vert Nature**
- 🟠 **Orange Soleil**
- 🌸 **Rose Douceur**
- 🔴 **Rouge Passion**
- 🔷 **Cyan Cristal**

Le thème sélectionné est **persisté** dans le localStorage et s'applique automatiquement à toute l'application.

### 2. **Animations de fond avancées** ✨

Nouvelles animations CSS disponibles:
- `animate-float` - Flottement doux
- `animate-pulse-slow` - Pulsation lente
- `animate-rotate` - Rotation continue
- `animate-gradient` - Gradient animé
- `bg-animated` - Fond avec points flottants
- `bg-circles` - Cercles flottants en arrière-plan

### 3. **Page Paramètres complète** ⚙️

Accessible via `/settings`, elle permet de:

#### Personnalisation du thème
- Visualisation de tous les thèmes disponibles
- Changement instantané avec prévisualisation
- Indication visuelle du thème actif

#### Gestion du profil
- Modification du prénom
- Modification du nom
- Changement d'email (avec vérification d'unicité)

#### Sécurité
- Changement de mot de passe sécurisé
- Vérification du mot de passe actuel
- Confirmation du nouveau mot de passe
- Minimum 6 caractères requis

### 4. **API Backend enrichie** 🔒

Nouvelles routes d'authentification:
- `PUT /api/auth/profile` - Mise à jour du profil
- `PUT /api/auth/password` - Changement de mot de passe

Sécurité:
- Vérification du mot de passe actuel
- Hash bcrypt des nouveaux mots de passe
- Validation avec Zod
- Protection par authentification JWT

## 📂 Structure des fichiers ajoutés/modifiés

### Frontend
```
frontend/src/
├── store/
│   └── themeStore.ts           # Store Zustand pour les thèmes
├── pages/
│   └── Settings.tsx            # Page de paramètres
├── components/
│   └── Layout.tsx              # Mis à jour pour le thème dynamique
├── index.css                   # Animations CSS ajoutées
└── App.tsx                     # Route Settings ajoutée
```

### Backend
```
backend/src/
└── routes/
    └── auth.ts                 # Routes profile/password ajoutées
```

## 🎯 Comment utiliser

### Changer de thème
1. Aller dans **Paramètres** (⚙️ dans le menu)
2. Section **Thème de couleur**
3. Cliquer sur le thème désiré
4. Le changement est immédiat et persistant

### Modifier son profil
1. Aller dans **Paramètres**
2. Section **Informations du profil**
3. Modifier les champs souhaités
4. Cliquer sur **💾 Enregistrer les modifications**

### Changer son mot de passe
1. Aller dans **Paramètres**
2. Section **Modifier le mot de passe**
3. Entrer le mot de passe actuel
4. Entrer et confirmer le nouveau mot de passe
5. Cliquer sur **🔑 Changer le mot de passe**

## 🎨 Utilisation du système de thèmes dans le code

### Importer le store
```typescript
import { useThemeStore } from '../store/themeStore'

const { getTheme } = useThemeStore()
const theme = getTheme()
```

### Appliquer les couleurs du thème
```tsx
// Gradient de fond
<div className={`bg-gradient-to-br ${theme.bgGradient}`}>

// Gradient de bouton
<button className={`bg-gradient-to-r ${theme.buttonGradient}`}>

// Texte avec gradient
<h1 className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>

// Couleur d'accentuation
<div className={`bg-${theme.light}`}>
```

## ✅ Fonctionnalités complétées

- [x] Store de thèmes avec Zustand
- [x] 7 thèmes de couleurs différents
- [x] Persistance du thème dans localStorage
- [x] Animations de fond avancées
- [x] Page Paramètres complète
- [x] Modification du profil utilisateur
- [x] Changement de mot de passe sécurisé
- [x] API backend pour profil/password
- [x] Validation et sécurité
- [x] Application du thème sur toute l'app
- [x] Navigation mise à jour

## 🚀 Démarrage

Aucune installation supplémentaire requise! 

Les dépendances suivantes (déjà installées) sont utilisées:
- `zustand` - State management
- `@tanstack/react-query` - Gestion des requêtes API
- `bcryptjs` - Hash des mots de passe
- `zod` - Validation des données

Lancez simplement:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Ou utilisez les fichiers `.bat` pour Windows.

## 🎉 Résultat

L'application dispose maintenant de:
- ✨ 7 thèmes magnifiques
- 🎨 Animations fluides et modernes
- ⚙️ Gestion complète du compte
- 🔒 Sécurité renforcée
- 🎯 UX améliorée
- 💾 Persistance des préférences

Profitez de votre application de gestion locative personnalisée! 🏠
