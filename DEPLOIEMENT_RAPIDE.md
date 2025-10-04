# Déploiement rapide sur Render

## 🚀 Résumé en 5 étapes

### 1️⃣ Pousser sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE-USERNAME/loca16.git
git push -u origin main
```

### 2️⃣ Créer la base de données sur Render
1. Aller sur https://dashboard.render.com
2. New + → PostgreSQL
3. Name: `loca16-db`, Plan: Free
4. **Copier l'Internal Database URL**

### 3️⃣ Déployer le Backend
1. New + → Web Service
2. Connecter GitHub → Choisir votre repo
3. Configuration :
   - Name: `loca16-backend`
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npx prisma migrate deploy && npm start`
4. Variables d'environnement :
   - `DATABASE_URL` = L'URL de l'étape 2
   - `JWT_SECRET` = Une clé aléatoire (ex: `openssl rand -hex 32`)
   - `PORT` = `3001`
5. Create Web Service
6. **Copier l'URL du backend** (ex: https://loca16-backend.onrender.com)

### 4️⃣ Déployer le Frontend
1. New + → Static Site
2. Connecter GitHub → Choisir votre repo
3. Configuration :
   - Name: `loca16-frontend`
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
4. Variable d'environnement :
   - `VITE_API_URL` = URL du backend de l'étape 3 + `/api`
     (ex: `https://loca16-backend.onrender.com/api`)
5. Create Static Site

### 5️⃣ Tester !
Votre app est en ligne ! 🎉

---

## 📝 Avant de déployer

### Backend
✅ Le `schema.prisma` utilise PostgreSQL (déjà configuré)
✅ Les scripts package.json sont configurés (déjà fait)

### Frontend
✅ Créer le fichier `frontend/.env.production` avec l'URL du backend
✅ L'API utilise `import.meta.env.VITE_API_URL` (déjà configuré)

---

## 🔧 Commandes utiles

### Générer une clé JWT sécurisée
```bash
# Sur Linux/Mac
openssl rand -hex 32

# Sur Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Créer les migrations Prisma (EN LOCAL avant de déployer)
```bash
cd backend
npx prisma migrate dev --name init
```

### Vérifier la connexion à la DB
```bash
# Dans le backend sur Render
npx prisma studio
```

---

## ⚠️ Points importants

1. **Plan gratuit Render** :
   - Le backend se met en veille après 15 min d'inactivité
   - Premier chargement = 30-60s après la mise en veille
   - Base de données = 1GB max

2. **Mises à jour automatiques** :
   - Chaque `git push` redéploie automatiquement

3. **Variables d'environnement** :
   - Ne JAMAIS commit les fichiers `.env`
   - Configurer dans le dashboard Render

4. **URL finale** :
   - Frontend : `https://loca16-frontend.onrender.com`
   - Backend : `https://loca16-backend.onrender.com`

---

## 🐛 Problèmes courants

### Le backend ne démarre pas
→ Vérifier `DATABASE_URL` dans les variables d'environnement Render

### Le frontend affiche "Network Error"
→ Vérifier que `VITE_API_URL` pointe vers la bonne URL du backend

### Erreur de migrations
→ Les migrations Prisma doivent être créées EN LOCAL avant le déploiement :
```bash
cd backend
npx prisma migrate dev --name init
git add prisma/migrations
git commit -m "Add migrations"
git push
```

### CORS errors
→ Le backend accepte toutes les origines par défaut. Si vous voulez sécuriser :
```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://loca16-frontend.onrender.com',
  credentials: true
}))
```

---

## 📚 Documentation complète
Voir le fichier `GUIDE_DEPLOIEMENT_RENDER.md` pour plus de détails.
