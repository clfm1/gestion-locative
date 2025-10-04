# 🔍 Debug : Association Locataires → Biens

## Problème : Rien ne se passe quand j'ajoute un locataire

### ✅ Solution : Redémarrer le backend

**Les nouvelles routes API ont été ajoutées mais le serveur backend doit être redémarré pour les charger.**

## 📋 Étapes de résolution :

### 1️⃣ Arrêter le backend actuel
- Trouvez la fenêtre terminal/console qui exécute le backend
- Appuyez sur `Ctrl + C` pour arrêter le serveur
- OU fermez simplement la fenêtre

### 2️⃣ Redémarrer le backend
**Option A (Simple) :**
```
Double-cliquez sur : start-backend.bat
```

**Option B (Terminal) :**
```bash
cd backend
npm run dev
```

### 3️⃣ Vérifier que le backend démarre correctement
Vous devriez voir dans la console :
```
✓ Serveur démarré sur le port 3000
✓ Routes chargées
```

### 4️⃣ Rafraîchir le frontend
- Dans votre navigateur, appuyez sur `F5` ou `Ctrl + F5`

### 5️⃣ Tester à nouveau
1. Allez sur la page **Biens**
2. Cliquez sur **"👥 Gérer les locataires"** sur n'importe quel bien
3. Cochez un ou plusieurs locataires
4. Cliquez sur **"✅ Ajouter X locataire(s)"**

## 🔎 Comment vérifier si ça marche :

### Dans le navigateur (Console F12) :
Si vous ouvrez les outils de développement (F12), vous devriez voir :
```javascript
// Quand vous cliquez sur le bouton :
Ajout de locataires: { bienId: "...", locataireIds: [...] }

// Si erreur :
Erreur lors de l'ajout des locataires: [message d'erreur]
```

### Dans le backend (Console) :
Si erreur backend, vous verrez :
```
Error: [description de l'erreur]
```

## 🚨 Erreurs possibles :

### Erreur 404 "Not Found"
➡️ **Solution** : Le backend n'a pas été redémarré. Suivez les étapes ci-dessus.

### Erreur 400 "locataireIds requis"
➡️ **Solution** : Assurez-vous d'avoir sélectionné au moins un locataire (cochez les cases).

### Erreur 401 "Unauthorized"
➡️ **Solution** : Reconnectez-vous à l'application.

### Rien ne se passe (pas d'erreur)
➡️ **Solution** : 
1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet "Console" pour voir les logs
3. Regardez l'onglet "Network" pour voir si la requête est envoyée

## ✨ Nouvelles fonctionnalités disponibles :

Une fois le backend redémarré, vous pourrez :
- ✅ Voir tous les locataires associés à un bien
- ✅ Ajouter plusieurs locataires simultanément à un bien
- ✅ Retirer un locataire d'un bien
- ✅ Gérer autant de locataires que nécessaire par bien

## 💡 Conseil :
Si le problème persiste, vérifiez que :
- Le fichier `backend/src/routes/biens.ts` contient bien les nouvelles routes (lignes 143-305)
- Le backend s'exécute sans erreur
- Le frontend est bien connecté au backend (vérifiez l'URL dans `frontend/src/lib/api.ts`)
