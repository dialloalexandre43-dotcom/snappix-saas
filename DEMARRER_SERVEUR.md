# 🚀 Démarrer le serveur Next.js

## ⚠️ Erreur : ERR_CONNECTION_REFUSED

Cette erreur signifie que **le serveur Next.js n'est pas démarré**.

## ✅ Solution : Démarrer le serveur

### Méthode 1 : Via PowerShell (recommandé)

1. **Ouvrez PowerShell** (ou un terminal)

2. **Naviguez vers le dossier saas** :
   ```powershell
   cd "C:\Users\aferr\Desktop\saas image\saas"
   ```

3. **Démarrez le serveur** :
   ```powershell
   npm run dev
   ```

4. **Vous devriez voir** :
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3001
   - ready started server on 0.0.0.0:3001
   ```

5. **Gardez ce terminal ouvert** pendant que vous utilisez l'application

### Méthode 2 : Via VS Code

1. **Ouvrez le terminal intégré** dans VS Code (`Ctrl + ù` ou `Terminal > New Terminal`)

2. **Naviguez vers le dossier saas** :
   ```powershell
   cd saas
   ```

3. **Démarrez le serveur** :
   ```powershell
   npm run dev
   ```

## 🔍 Vérifier que le serveur fonctionne

1. **Ouvrez votre navigateur**
2. **Allez sur** : `http://localhost:3001`
3. **Vous devriez voir** la page d'accueil de Snappix

## 🐛 Si le serveur ne démarre pas

### Erreur : "Cannot find module"

**Solution** : Installer les dépendances
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm install
```

### Erreur : "Port 3001 already in use"

**Solution** : Un autre processus utilise le port
```powershell
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus (remplacez <PID> par le numéro trouvé)
taskkill /PID <PID> /F
```

### Erreur : "Database connection failed"

**Solution** : Vérifiez votre `DATABASE_URL` dans `saas/.env.local`

## 📝 Note importante

**Le terminal doit rester ouvert** pendant que vous utilisez l'application. Si vous fermez le terminal, le serveur s'arrêtera et vous verrez à nouveau "ERR_CONNECTION_REFUSED".

## ✅ Une fois le serveur démarré

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur "Continuer avec Google"
3. La connexion devrait fonctionner !

---

**Démarrez le serveur et dites-moi si ça fonctionne !** 🎯



















