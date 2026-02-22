# 🔍 Diagnostic complet - Connexion Google

## 📋 Étape 1 : Vérifier que le serveur fonctionne

### Test 1 : Accès au site

1. Ouvrez `http://localhost:3001` dans votre navigateur
2. **Résultat attendu** : Page d'accueil Snappix
3. **Si erreur** : Le serveur n'est pas démarré → Voir `DEMARRER_SERVEUR.md`

### Test 2 : Vérifier les variables d'environnement

1. Ouvrez `http://localhost:3001/api/test-google-env` dans votre navigateur
2. **Vous devriez voir** un JSON avec :
   ```json
   {
     "hasGoogleClientId": true,
     "hasGoogleClientSecret": true,
     "hasNextAuthUrl": true,
     "nextAuthUrl": "http://localhost:3001",
     ...
   }
   ```
3. **Si `false`** : Les variables d'environnement manquent dans `.env.local`

### Test 3 : Vérifier NextAuth

1. Ouvrez `http://localhost:3001/api/auth/providers` dans votre navigateur
2. **Vous devriez voir** un JSON avec les providers :
   ```json
   {
     "google": { ... },
     "credentials": { ... }
   }
   ```
3. **Si `google` manque** : Problème de configuration Google OAuth

## 📋 Étape 2 : Tester l'authentification email/password

**Avant de tester Google, testons que l'authentification de base fonctionne :**

1. Allez sur `http://localhost:3001/signup`
2. Créez un compte avec email et mot de passe
3. Connectez-vous avec ces identifiants
4. **Résultat attendu** : Redirection vers `/dashboard`

**Si ça fonctionne** : Le problème vient spécifiquement de Google OAuth
**Si ça ne fonctionne pas** : Le problème est plus général (base de données, serveur, etc.)

## 📋 Étape 3 : Vérifier Google Cloud Console

### Checklist Google Cloud

1. **Projet créé** ✅
2. **Google+ API activée** ✅
3. **OAuth consent screen configuré** ✅
4. **OAuth Client ID créé** ✅
5. **Authorized JavaScript origins** :
   - ✅ `http://localhost:3001` (exactement, http pas https)
6. **Authorized redirect URIs** :
   - ✅ `http://localhost:3001/api/auth/callback/google` (exactement)

### Erreurs courantes à éviter

- ❌ `http://localhost:3000/...` (mauvais port)
- ❌ `https://localhost:3001/...` (https au lieu de http)
- ❌ Trailing slash : `http://localhost:3001/api/auth/callback/google/` (ne pas mettre de `/` à la fin)
- ❌ Espaces avant/après l'URL
- ❌ URL en majuscules

## 📋 Étape 4 : Vérifier les logs du serveur

**Regardez le terminal où tourne `npm run dev`** :

1. **Quand vous cliquez sur "Continuer avec Google"**, regardez les logs
2. **Cherchez les erreurs** qui commencent par :
   - `[NextAuth]`
   - `GoogleProvider`
   - `Error:`
   - `OAuth`

3. **Partagez ces erreurs** pour que je puisse vous aider

## 📋 Étape 5 : Tester avec NextAuth debug

### Activer le mode debug

Ajoutez dans `saas/.env.local` :

```env
NEXTAUTH_DEBUG=true
```

**Redémarrez le serveur** et regardez les logs détaillés.

## 📋 Étape 6 : Solutions alternatives

### Solution A : Désactiver temporairement Google

Pour isoler le problème, commentez GoogleProvider dans `saas/lib/auth.ts` :

```typescript
providers: [
  // GoogleProvider({
  //   clientId: process.env.GOOGLE_CLIENT_ID!,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  // }),
  CredentialsProvider({
    // ...
  }),
],
```

**Testez** : Si l'authentification email/password fonctionne, le problème vient de Google.

### Solution B : Créer un nouveau projet Google Cloud

Si la configuration actuelle ne fonctionne pas :

1. Créez un **nouveau projet** dans Google Cloud Console
2. Configurez-le avec le port **3001**
3. Utilisez les **nouveaux** Client ID et Secret

### Solution C : Utiliser uniquement email/password

Si Google OAuth pose trop de problèmes, vous pouvez utiliser uniquement l'authentification email/password pour l'instant et configurer Google plus tard.

## 🐛 Erreurs spécifiques et solutions

### "redirect_uri_mismatch"

**Cause** : L'URI dans Google Cloud Console ne correspond pas exactement

**Solution** :
1. Copiez exactement : `http://localhost:3001/api/auth/callback/google`
2. Collez dans Google Cloud Console > OAuth Client > Authorized redirect URIs
3. Vérifiez qu'il n'y a pas d'espaces
4. Sauvegardez et attendez 1-2 minutes

### "Invalid client"

**Cause** : Client ID ou Secret incorrect

**Solution** :
1. Vérifiez `GOOGLE_CLIENT_ID` dans `.env.local`
2. Vérifiez `GOOGLE_CLIENT_SECRET` dans `.env.local`
3. Redémarrez le serveur après modification

### "ERR_CONNECTION_REFUSED"

**Cause** : Serveur non démarré

**Solution** :
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### L'utilisateur n'est pas créé après connexion Google

**Cause** : Problème avec Prisma ou la base de données

**Solution** :
1. Vérifiez les logs du serveur pour les erreurs Prisma
2. Vérifiez que `DATABASE_URL` est correct
3. Testez Prisma : `npx prisma studio`

## 📝 Informations à me partager

Pour que je puisse vous aider efficacement, partagez :

1. **Les logs du serveur** quand vous cliquez sur "Continuer avec Google"
2. **Le résultat de** `http://localhost:3001/api/test-google-env`
3. **Le résultat de** `http://localhost:3001/api/auth/providers`
4. **L'erreur exacte** que vous voyez dans le navigateur
5. **Est-ce que l'authentification email/password fonctionne ?**

---

**Faites ces tests et partagez les résultats !** 🎯



















