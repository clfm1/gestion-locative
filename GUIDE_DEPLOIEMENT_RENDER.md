# Guide de déploiement sur Render

## Prérequis
- Compte GitHub (pour héberger le code)
- Compte Render (gratuit) : https://render.com

## Étape 1 : Préparer le code

### 1.1 Configurer le frontend pour la production
Créer un fichier `.env.production` dans le dossier `frontend` :
```
VITE_API_URL=https://loca16-backend.onrender.com
```

### 1.2 Vérifier que le backend utilise PostgreSQL
Le fichier `backend/prisma/schema.prisma` doit avoir :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Étape 2 : Pousser le code sur GitHub

```bash
# Initialiser git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Prêt pour le déploiement sur Render"

# Créer un nouveau repository sur GitHub et pousser
git remote add origin https://github.com/VOTRE-USERNAME/loca16.git
git branch -M main
git push -u origin main
```

## Étape 3 : Créer la base de données PostgreSQL sur Render

1. Aller sur https://dashboard.render.com
2. Cliquer sur "New +" → "PostgreSQL"
3. Configurer :
   - **Name** : `loca16-db`
   - **Database** : `loca16`
   - **User** : `loca16user`
   - **Region** : Frankfurt (ou le plus proche de vous)
   - **Plan** : Free
4. Cliquer sur "Create Database"
5. **IMPORTANT** : Noter la "Internal Database URL" (commence par `postgresql://`)

## Étape 4 : Déployer le Backend

1. Sur le dashboard Render, cliquer sur "New +" → "Web Service"
2. Connecter votre repository GitHub
3. Configurer :
   - **Name** : `loca16-backend`
   - **Region** : Frankfurt
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : 
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command** : 
     ```
     npx prisma migrate deploy && npm start
     ```
   - **Plan** : Free

4. Ajouter les variables d'environnement :
   - `DATABASE_URL` : Coller l'Internal Database URL de l'étape 3
   - `JWT_SECRET` : Générer une clé aléatoire sécurisée (ex: `openssl rand -hex 32`)
   - `PORT` : `3001`
   - `NODE_ENV` : `production`

5. Cliquer sur "Create Web Service"

6. Attendre que le déploiement se termine (5-10 min)

7. **IMPORTANT** : Noter l'URL du backend (ex: `https://loca16-backend.onrender.com`)

## Étape 5 : Déployer le Frontend

1. Sur le dashboard Render, cliquer sur "New +" → "Static Site"
2. Connecter votre repository GitHub
3. Configurer :
   - **Name** : `loca16-frontend`
   - **Region** : Frankfurt
   - **Branch** : `main`
   - **Root Directory** : `frontend`
   - **Build Command** : 
     ```
     npm install && npm run build
     ```
   - **Publish Directory** : `dist`

4. Ajouter la variable d'environnement :
   - `VITE_API_URL` : L'URL du backend de l'étape 4 (ex: `https://loca16-backend.onrender.com`)

5. Cliquer sur "Create Static Site"

6. Attendre que le déploiement se termine (3-5 min)

7. **TERMINÉ !** Votre application est en ligne !

## Étape 6 : Configurer CORS (si nécessaire)

Si vous avez des erreurs CORS, vérifier que dans `backend/src/index.ts` :
```typescript
app.use(cors({
  origin: 'https://loca16-frontend.onrender.com', // Remplacer par l'URL de votre frontend
  credentials: true
}))
```

## URLs finales

Après déploiement, vous aurez :
- **Frontend** : `https://loca16-frontend.onrender.com`
- **Backend** : `https://loca16-backend.onrender.com`
- **Base de données** : Géré automatiquement par Render

## Notes importantes

### Plan gratuit Render
- Le backend se met en veille après 15 min d'inactivité
- Premier chargement peut prendre 30-60 secondes après la mise en veille
- 750h gratuites par mois
- Base de données limitée à 1GB

### Mises à jour
Pour déployer une nouvelle version :
```bash
git add .
git commit -m "Mise à jour"
git push
```
Render redéploiera automatiquement !

## Dépannage

### Le backend ne démarre pas
- Vérifier que la variable `DATABASE_URL` est bien configurée
- Vérifier les logs dans le dashboard Render
- S'assurer que les migrations Prisma se sont exécutées

### Le frontend ne se connecte pas au backend
- Vérifier que `VITE_API_URL` pointe vers la bonne URL du backend
- Vérifier la configuration CORS dans le backend

### Erreur de base de données
- Vérifier que PostgreSQL est bien configuré dans `schema.prisma`
- Relancer les migrations : `npx prisma migrate deploy`

## Alternative : Déploiement avec render.yaml

Si vous voulez déployer automatiquement tout avec un seul fichier, utilisez le fichier `render.yaml` à la racine du projet :

1. Sur Render dashboard, cliquer sur "New +" → "Blueprint"
2. Connecter votre repository GitHub
3. Render détectera automatiquement le fichier `render.yaml`
4. Cliquer sur "Apply"

Tout sera créé automatiquement (backend, frontend, base de données) !
