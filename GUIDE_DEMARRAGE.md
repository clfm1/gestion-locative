# 🚀 Guide de démarrage rapide

## Option 1 : Démarrage automatique (Windows)

### 1. Démarrer le backend
Double-cliquez sur `start-backend.bat`

Cela va :
- Installer les dépendances npm
- Générer les fichiers Prisma
- Créer la base de données SQLite
- Démarrer le serveur backend sur http://localhost:3001

### 2. Démarrer le frontend
Ouvrez un nouveau terminal et double-cliquez sur `start-frontend.bat`

Cela va :
- Installer les dépendances npm
- Démarrer le serveur de développement sur http://localhost:3000

### 3. Accéder à l'application
Ouvrez votre navigateur à http://localhost:3000

## Option 2 : Démarrage manuel

### Terminal 1 - Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Première utilisation

1. Créez un compte en cliquant sur "créer un compte"
2. Remplissez le formulaire d'inscription
3. Connectez-vous avec vos identifiants
4. Commencez par ajouter des biens immobiliers
5. Ajoutez des locataires
6. Créez des locations
7. Gérez les frais associés à chaque location

## 🔧 Résolution des problèmes

### Le backend ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules` et `package-lock.json`, puis réessayez

### Le frontend ne démarre pas
- Vérifiez que le port 3000 n'est pas déjà utilisé
- Essayez de supprimer `node_modules` et réinstaller

### Erreur de connexion à l'API
- Vérifiez que le backend est bien démarré sur le port 3001
- Vérifiez les logs du backend pour voir les erreurs

## 📞 Support

Pour toute question ou problème, consultez le fichier README.md
