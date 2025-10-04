# ⚠️ IMPORTANT : Redémarrage du Backend requis

## Les nouvelles routes API ont été ajoutées !

Pour que la fonctionnalité d'association des locataires aux biens fonctionne, vous devez **redémarrer le serveur backend**.

## Comment redémarrer :

### Option 1 : Via le fichier .bat (Windows)
1. Fermez la fenêtre du backend actuel (Ctrl+C)
2. Double-cliquez sur `start-backend.bat`

### Option 2 : Via la ligne de commande
```bash
# Arrêtez le serveur actuel (Ctrl+C dans le terminal)
# Puis relancez-le :
cd backend
npm run dev
```

## Nouvelles routes ajoutées :
- `GET /api/biens/:id/locataires` - Liste les locataires d'un bien
- `POST /api/biens/:id/locataires` - Associe des locataires à un bien
- `DELETE /api/biens/:id/locataires/:locataireId` - Retire un locataire d'un bien

Une fois le backend redémarré, rafraîchissez également la page frontend.
