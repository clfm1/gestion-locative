# 🚀 Déploiement Render - Guide rapide

## 📦 Étapes rapides (30 minutes)

### 1️⃣ Pousser sur GitHub (5 min)

```bash
# Dans C:\Users\calof\Desktop\test
git init
git add .
git commit -m "Initial commit"

# Créez un repo sur github.com puis :
git remote add origin https://github.com/VOTRE_USERNAME/gestion-locative.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Créer la base PostgreSQL (5 min)

1. https://dashboard.render.com → **New +** → **PostgreSQL**
2. Name : `gestion-locative-db`
3. Plan : **Free**
4. **Create Database**
5. Copiez l'**"Internal Database URL"** (commence par `postgresql://`)

---

### 3️⃣ Déployer le Backend (10 min)

1. Render → **New +** → **Web Service**
2. Connectez GitHub → Sélectionnez votre repo
3. Config :
   - Name : `gestion-locative-backend`
   - Root Directory : `backend`
   - Build : `npm install && npm run build && npx prisma migrate deploy`
   - Start : `npm start`
   - Plan : **Free**

4. **Environment Variables** :
   ```
   DATABASE_URL = [Collez l'URL PostgreSQL]
   JWT_SECRET = [Clé aléatoire 64 caractères]
   NODE_ENV = production
   ```

5. **Create Web Service**

6. Attendez 5-10 min

7. Testez : `https://VOTRE-BACKEND.onrender.com/api/health`

---

### 4️⃣ Déployer le Frontend (10 min)

1. **Sur votre machine**, créez `frontend/.env` :
   ```
   VITE_API_URL=https://VOTRE-BACKEND.onrender.com/api
   ```

2. Commitez :
   ```bash
   git add .
   git commit -m "Add production config"
   git push
   ```

3. Render → **New +** → **Static Site**
4. Sélectionnez votre repo
5. Config :
   - Name : `gestion-locative-frontend`
   - Root Directory : `frontend`
   - Build : `npm install && npm run build`
   - Publish : `dist`
   - Plan : **Free**

6. **Environment Variables** :
   ```
   VITE_API_URL = https://VOTRE-BACKEND.onrender.com/api
   ```

7. **Create Static Site**

8. Attendez 5-10 min

---

### 5️⃣ C'est en ligne ! 🎉

Ouvrez : `https://VOTRE-FRONTEND.onrender.com`

---

## ⚠️ Important

- **Premier chargement** : Attendez 30-60 sec (plan gratuit)
- **Backend s'endort** après 15 min d'inactivité
- **HTTPS** activé automatiquement ✅

---

## 🔄 Mettre à jour

```bash
git add .
git commit -m "Mise à jour"
git push
```

Render redéploie automatiquement ! ✨

---

## 📚 Guide complet

Voir **DEPLOIEMENT_RENDER.md** pour plus de détails.
