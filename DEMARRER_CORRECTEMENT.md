# 🚀 Guide : Démarrer correctement l'application

## ⚠️ PROBLÈME ACTUEL : Le backend ne tourne pas !

### 📋 **Étapes pour démarrer CORRECTEMENT :**

---

## 1️⃣ **Démarrer le BACKEND d'abord**

### Option A : Double-clic sur le fichier
```
📁 Naviguez vers : C:\Users\calof\Desktop\test
📄 Double-cliquez sur : start-backend.bat
```

### Option B : Terminal
```bash
# Ouvrez un terminal (CMD ou PowerShell)
cd C:\Users\calof\Desktop\test\backend
npm run dev
```

### ✅ **Vérification :**
Vous DEVEZ voir dans la console :
```
🚀 Serveur démarré sur http://localhost:3001
```

**⚠️ IMPORTANT : Laissez cette fenêtre OUVERTE !**

---

## 2️⃣ **Vérifier que le backend répond**

### Test manuel :
1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3001/api/health**
3. Vous devriez voir :
```json
{"status":"ok","message":"API de gestion locative"}
```

### OU utilisez le fichier de test :
```
📄 Double-cliquez sur : VERIFIER_BACKEND.bat
```

---

## 3️⃣ **Démarrer le FRONTEND ensuite**

### Option A : Double-clic sur le fichier
```
📁 Naviguez vers : C:\Users\calof\Desktop\test
📄 Double-cliquez sur : start-frontend.bat
```

### Option B : Terminal
```bash
# Ouvrez un NOUVEAU terminal (gardez le backend ouvert)
cd C:\Users\calof\Desktop\test\frontend
npm run dev
```

### ✅ **Vérification :**
Vous DEVEZ voir :
```
➜  Local:   http://localhost:3000/
```

---

## 4️⃣ **Ouvrir l'application**

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3000**
3. Connectez-vous

---

## 🔍 **Debugging : Si ça ne marche toujours pas**

### Vérifiez les ports utilisés :

#### Windows :
```cmd
netstat -ano | findstr :3001
netstat -ano | findstr :3000
```

Si vous voyez des lignes, les ports sont utilisés.

#### Pour tuer un processus sur un port :
```cmd
# Trouvez le PID dans la commande ci-dessus (dernière colonne)
taskkill /PID [numéro_du_PID] /F
```

### Exemple :
```
C:\> netstat -ano | findstr :3001
  TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12345

C:\> taskkill /PID 12345 /F
```

---

## 📊 **État actuel de votre système :**

### Ports configurés :
- **Backend** : Port **3001** (express)
- **Frontend** : Port **3000** (vite)
- **Proxy** : Le frontend redirige `/api` vers `http://localhost:3001`

### Architecture :
```
Navigateur (localhost:3000)
    ↓
Frontend Vite (port 3000)
    ↓ (proxy /api → localhost:3001)
Backend Express (port 3001)
    ↓
Database SQLite
```

---

## ✅ **Checklist finale :**

- [ ] Le backend est démarré (fenêtre ouverte avec le message "Serveur démarré")
- [ ] http://localhost:3001/api/health retourne `{"status":"ok"}`
- [ ] Le frontend est démarré (fenêtre ouverte)
- [ ] http://localhost:3000 charge l'application
- [ ] Vous êtes connecté
- [ ] La page Biens charge correctement

---

## 🆘 **Si vous voyez toujours des 404 :**

1. **Fermez TOUTES les fenêtres de terminal/console**
2. **Attendez 5 secondes**
3. **Redémarrez dans l'ordre** :
   - D'abord le backend
   - Puis le frontend
4. **Rafraîchissez le navigateur** (Ctrl+F5)

---

## 💡 **Astuce :**

Pour savoir si le backend tourne vraiment, regardez la fenêtre de console du backend.
Elle doit rester ouverte et afficher : **🚀 Serveur démarré sur http://localhost:3001**

Si cette fenêtre est fermée = Le backend ne tourne pas !
