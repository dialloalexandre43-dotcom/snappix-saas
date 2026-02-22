# ✅ Vérification de la connexion Google

## 🔍 Checklist de vérification

### 1. Serveur démarré ✅

Le serveur Next.js doit être en cours d'exécution :

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

Le serveur doit être accessible sur : `http://localhost:3001`

### 2. Variables d'environnement

Vérifiez que dans `saas/.env.local`, vous avez :

```env
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
DATABASE_URL=votre-url-database
NEXTAUTH_SECRET=votre-secret
```

### 3. Configuration Google Cloud Console

Dans [Google Cloud Console](https://console.cloud.google.com/), vérifiez :

#### Authorized JavaScript origins :
- ✅ `http://localhost:3001`

#### Authorized redirect URIs :
- ✅ `http://localhost:3001/api/auth/callback/google`

**Important** : Le port doit être **3001**, pas 3000 !

### 4. Test de la connexion

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur "Continuer avec Google"
3. Vous devriez être redirigé vers Google pour vous connecter
4. Après connexion, vous devriez être redirigé vers `/dashboard`

## 🐛 Problèmes courants

### Erreur : "redirect_uri_mismatch"

**Cause** : L'URI de redirection dans Google Cloud Console ne correspond pas.

**Solution** :
1. Allez dans Google Cloud Console > APIs & Services > Credentials
2. Cliquez sur votre OAuth 2.0 Client ID
3. Vérifiez que "Authorized redirect URIs" contient exactement :
   ```
   http://localhost:3001/api/auth/callback/google
   ```
4. Sauvegardez

### Erreur : "ERR_CONNECTION_REFUSED"

**Cause** : Le serveur Next.js n'est pas démarré.

**Solution** :
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### Erreur : "Invalid client"

**Cause** : Les variables d'environnement `GOOGLE_CLIENT_ID` ou `GOOGLE_CLIENT_SECRET` sont incorrectes.

**Solution** :
1. Vérifiez les valeurs dans `saas/.env.local`
2. Redémarrez le serveur après modification

### L'utilisateur n'est pas créé dans la base de données

**Cause** : Problème avec Prisma ou la base de données.

**Solution** :
1. Vérifiez que `DATABASE_URL` est correct
2. Vérifiez les logs du serveur pour voir les erreurs
3. Assurez-vous que la base de données est accessible

## 📝 Étapes de test

1. **Démarrer le serveur** :
   ```powershell
   cd "C:\Users\aferr\Desktop\saas image\saas"
   npm run dev
   ```

2. **Vérifier que le serveur répond** :
   - Ouvrez `http://localhost:3001` dans votre navigateur
   - Vous devriez voir la page d'accueil

3. **Tester la connexion** :
   - Allez sur `http://localhost:3001/login`
   - Cliquez sur "Continuer avec Google"
   - Connectez-vous avec votre compte Google
   - Vous devriez être redirigé vers `/dashboard`

## 🔧 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs du serveur** :
   - Regardez la console où tourne `npm run dev`
   - Cherchez les erreurs liées à Google OAuth

2. **Vérifiez la console du navigateur** :
   - F12 > Console
   - Cherchez les erreurs

3. **Vérifiez les variables d'environnement** :
   - Assurez-vous que `.env.local` existe et contient les bonnes valeurs
   - Redémarrez le serveur après modification

---

**Dites-moi où vous en êtes et je vous aiderai à résoudre le problème !** 🎯



















