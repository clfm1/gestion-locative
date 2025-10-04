# ⚠️ IMPORTANT - À FAIRE AVANT LE DÉPLOIEMENT

## 1. Créer les migrations Prisma

Le fichier `backend/.env` a été mis à jour pour PostgreSQL, mais vous devez avoir PostgreSQL installé localement pour créer les migrations.

### Option A : Installer PostgreSQL localement (recommandé)
1. Télécharger PostgreSQL : https://www.postgresql.org/download/
2. Installer et noter le mot de passe
3. Créer la base de données :
   ```bash
   psql -U postgres
   CREATE DATABASE loca16;
   \q
   ```
4. Vérifier le fichier `backend/.env` (le mot de passe doit correspondre)
5. Créer les migrations :
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### Option B : Utiliser Docker (alternatif)
```bash
# Lancer PostgreSQL avec Docker
docker run --name postgres-local -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=loca16 -p 5432:5432 -d postgres

# Créer les migrations
cd backend
npx prisma migrate dev --name init
```

### Option C : Créer les migrations directement sur Render
Si vous ne pouvez pas installer PostgreSQL localement, vous pouvez créer les migrations directement après avoir déployé sur Render :

1. Déployer le backend sur Render (voir DEPLOIEMENT_RAPIDE.md)
2. Une fois déployé, aller dans le dashboard du backend
3. Aller dans "Shell" (console)
4. Exécuter :
   ```bash
   npx prisma migrate dev --name init
   ```

## 2. Vérifier que les migrations sont créées

Vous devriez avoir un dossier `backend/prisma/migrations/` avec un sous-dossier contenant les fichiers SQL.

## 3. Commit et push

```bash
git add .
git commit -m "Configuration PostgreSQL et migrations"
git push
```

## 4. Procéder au déploiement

Suivre le guide dans `DEPLOIEMENT_RAPIDE.md`

---

## Notes importantes

- **SQLite vs PostgreSQL** : SQLite ne fonctionne pas bien sur Render, c'est pourquoi on utilise PostgreSQL
- **Migrations** : Prisma a besoin des fichiers de migration pour créer les tables dans la base de données
- **Variables d'environnement** : Ne jamais commit le fichier `.env` avec des vraies credentials

## Alternative : Déployer sans migrations locales

Si vous voulez déployer rapidement sans créer les migrations localement :

1. Déployez d'abord sur Render avec la base de données PostgreSQL
2. Le déploiement échouera probablement car il n'y a pas de migrations
3. Connectez-vous au shell Render et exécutez :
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Redémarrez le service

C'est moins propre mais ça fonctionne !
