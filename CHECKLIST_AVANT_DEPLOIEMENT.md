# ✅ Checklist avant déploiement

## 📋 Vérifications à faire AVANT de déployer

### 1. Fichiers modifiés

- [x] `backend/prisma/schema.prisma` - Provider changé en `postgresql`
- [x] `backend/package.json` - Scripts de build mis à jour
- [x] `frontend/src/lib/api.ts` - Utilise variable d'environnement
- [x] `.gitignore` créé
- [x] `backend/.env.example` créé
- [x] `frontend/.env.example` créé

### 2. Fichiers à NE PAS commiter

- [ ] `backend/.env` (contient DATABASE_URL local)
- [ ] `frontend/.env` (sera créé sur Render)
- [ ] `backend/prisma/dev.db` (base SQLite locale)
- [ ] `node_modules/` (trop gros)
- [ ] `dist/` et `build/` (générés automatiquement)

### 3. Vérifier le .gitignore

Ouvrez `.gitignore` et vérifiez que ces lignes sont présentes :
```
node_modules/
.env
.env.local
*.db
*.db-journal
dist/
build/
```

### 4. Test en local (optionnel)

**Avec SQLite** (actuel) :
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

Testez que tout fonctionne : Notes, Agenda, etc.

### 5. Préparer pour PostgreSQL

**Option A** : Déployer directement sur Render (recommandé)
- Render créera automatiquement la base PostgreSQL
- Les migrations s'exécuteront automatiquement

**Option B** : Tester PostgreSQL en local (avancé)
- Installer PostgreSQL sur votre machine
- Créer une base locale
- Tester les migrations

→ **Recommandation** : Option A (plus simple)

---

## 🚀 Commandes Git avant déploiement

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter tous les fichiers
git add .

# 3. Vérifier ce qui sera commité (vérifier qu'il n'y a pas .env)
git status

# 4. Commiter
git commit -m "Prêt pour déploiement Render avec PostgreSQL"

# 5. Initialiser repo si pas fait
git init
git branch -M main

# 6. Ajouter remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/gestion-locative.git

# 7. Pousser
git push -u origin main
```

---

## ⚠️ Erreurs communes à éviter

### ❌ Erreur 1 : Commiter .env
**Problème** : Variables sensibles exposées publiquement

**Solution** :
```bash
# Supprimer du commit si déjà commité
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove .env files"
```

### ❌ Erreur 2 : Oublier de changer DATABASE_URL sur Render
**Problème** : Backend cherche fichier SQLite qui n'existe pas

**Solution** : Ajouter variable `DATABASE_URL` avec l'URL PostgreSQL sur Render

### ❌ Erreur 3 : URL backend incorrecte dans le frontend
**Problème** : Frontend ne peut pas communiquer avec backend

**Solution** : Vérifier `VITE_API_URL` dans les variables d'environnement Render

### ❌ Erreur 4 : Build Command incorrect
**Problème** : Prisma Client pas généré

**Solution** : Utiliser `npm install && npm run build && npx prisma migrate deploy`

---

## 📊 Structure finale du projet

```
test/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       ← PostgreSQL configuré ✅
│   │   └── migrations/         ← Doit être commité ✅
│   ├── src/
│   ├── package.json           ← Scripts mis à jour ✅
│   ├── .env                   ← NE PAS COMMITER ❌
│   └── .env.example           ← Commiter ✅
├── frontend/
│   ├── src/
│   │   └── lib/
│   │       └── api.ts         ← Variable env configurée ✅
│   ├── package.json
│   ├── .env                   ← NE PAS COMMITER ❌
│   └── .env.example           ← Commiter ✅
├── .gitignore                 ← Créé ✅
├── DEPLOIEMENT_RENDER.md      ← Guide complet
└── DEPLOIEMENT_RENDER_RAPIDE.md ← Guide rapide
```

---

## ✅ Vous êtes prêt si...

- [ ] Le code est sur GitHub
- [ ] `.env` n'est PAS dans le repo
- [ ] `.gitignore` est configuré
- [ ] `schema.prisma` utilise `postgresql`
- [ ] `api.ts` utilise variable d'environnement
- [ ] `package.json` backend a les bons scripts

**Si tous les ✅ sont cochés → GO pour le déploiement !** 🚀

---

## 📚 Prochaines étapes

1. Suivez **DEPLOIEMENT_RENDER_RAPIDE.md** (30 min)
2. Ou **DEPLOIEMENT_RENDER.md** pour version détaillée (1h)

**Bon déploiement !** 🎉
