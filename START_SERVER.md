# 🚀 Démarrer le serveur Next.js

## ⚠️ Problème : ERR_CONNECTION_REFUSED

Si vous voyez "ERR_CONNECTION_REFUSED" lors de la connexion Google, c'est que **le serveur Next.js n'est pas démarré**.

## ✅ Solution : Démarrer le serveur

### Étape 1 : Ouvrir un terminal

Ouvrez PowerShell ou un terminal dans le dossier du projet.

### Étape 2 : Aller dans le dossier saas

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
```

### Étape 3 : Démarrer le serveur

```powershell
npm run dev
```

Vous devriez voir :
```
▲ Next.js 14.x.x
- Local:        http://localhost:3001
- ready started server on 0.0.0.0:3001
```

### Étape 4 : Vérifier que le serveur fonctionne

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3001`
3. Vous devriez voir la page d'accueil de Snappix

### Étape 5 : Tester la connexion Google

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur "Continuer avec Google"
3. La connexion devrait fonctionner maintenant

## 🔧 Configuration importante

### Port utilisé : 3001

Le serveur utilise le **port 3001** (pas 3000) pour éviter les conflits.

### Vérifier la configuration Google OAuth

Dans Google Cloud Console, vérifiez que les **Authorized redirect URIs** sont configurés pour le port 3001 :

- ✅ `http://localhost:3001/api/auth/callback/google`
- ❌ `http://localhost:3000/api/auth/callback/google` (ancien port)

### Variables d'environnement

Vérifiez que dans `saas/.env.local`, vous avez :

```env
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
DATABASE_URL=votre-url-database
NEXTAUTH_SECRET=votre-secret
```

## 🐛 Si le serveur ne démarre pas

### Erreur : "Port 3001 already in use"

**Solution** : Un autre processus utilise le port 3001
```powershell
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus (remplacez PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Erreur : "Cannot find module"

**Solution** : Réinstaller les dépendances
```powershell
cd saas
npm install
```

### Erreur : "Database connection failed"

**Solution** : Vérifiez votre `DATABASE_URL` dans `.env.local`

## 📝 Note importante

**Gardez le terminal ouvert** pendant que vous utilisez l'application. Si vous fermez le terminal, le serveur s'arrêtera et vous verrez à nouveau "ERR_CONNECTION_REFUSED".

---

**Une fois le serveur démarré, la connexion Google devrait fonctionner !** ✅



















