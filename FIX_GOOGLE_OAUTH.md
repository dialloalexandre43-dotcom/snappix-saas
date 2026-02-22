# 🔧 Fix Google OAuth - Diagnostic ciblé

## ✅ Ce qui fonctionne
- ✅ Serveur Next.js démarré
- ✅ Authentification email/password fonctionne
- ✅ Base de données fonctionne

## ❌ Problème
- ❌ Connexion Google ne fonctionne pas

## 🔍 Diagnostic étape par étape

### Étape 1 : Vérifier les variables d'environnement

Ouvrez dans votre navigateur :
```
http://localhost:3001/api/test-google-env
```

**Résultat attendu** :
```json
{
  "hasGoogleClientId": true,
  "hasGoogleClientSecret": true,
  "hasNextAuthUrl": true,
  "nextAuthUrl": "http://localhost:3001",
  "googleClientIdPrefix": "12345678901234567890...",
  ...
}
```

**Si `hasGoogleClientId` ou `hasGoogleClientSecret` est `false`** :
- Les variables manquent dans `saas/.env.local`
- Ajoutez-les et redémarrez le serveur

### Étape 2 : Vérifier les providers NextAuth

Ouvrez dans votre navigateur :
```
http://localhost:3001/api/auth/providers
```

**Résultat attendu** :
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    ...
  },
  "credentials": { ... }
}
```

**Si `google` n'apparaît pas** :
- Problème de configuration GoogleProvider
- Vérifiez les variables d'environnement

### Étape 3 : Vérifier Google Cloud Console

**Checklist** :

1. **Authorized JavaScript origins** :
   - ✅ `http://localhost:3001` (exactement, http pas https)
   - ❌ Pas `http://localhost:3000`

2. **Authorized redirect URIs** :
   - ✅ `http://localhost:3001/api/auth/callback/google` (exactement)
   - ❌ Pas de trailing slash
   - ❌ Pas d'espaces

3. **OAuth consent screen** :
   - ✅ Configuré et publié (ou en mode test avec votre email ajouté)

### Étape 4 : Tester le callback NextAuth

Ouvrez dans votre navigateur :
```
http://localhost:3001/api/auth/signin
```

**Vous devriez voir** la page de connexion NextAuth par défaut avec le bouton Google.

**Si le bouton Google n'apparaît pas** : Problème de configuration

## 🐛 Erreurs courantes et solutions

### Erreur : "redirect_uri_mismatch"

**Cause** : L'URI dans Google Cloud Console ne correspond pas exactement

**Solution** :
1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > Credentials
3. Cliquez sur votre OAuth 2.0 Client ID
4. Vérifiez "Authorized redirect URIs" :
   - Doit être exactement : `http://localhost:3001/api/auth/callback/google`
   - Pas de `/` à la fin
   - Pas d'espaces
   - `http` pas `https`
   - Port `3001` pas `3000`
5. Sauvegardez et attendez 1-2 minutes

### Erreur : "Invalid client"

**Cause** : Client ID ou Secret incorrect

**Solution** :
1. Vérifiez `GOOGLE_CLIENT_ID` dans `saas/.env.local`
2. Vérifiez `GOOGLE_CLIENT_SECRET` dans `saas/.env.local`
3. Vérifiez qu'il n'y a pas d'espaces avant/après
4. Redémarrez le serveur après modification

### Erreur : "access_denied"

**Cause** : OAuth consent screen non configuré ou utilisateur non autorisé

**Solution** :
1. Allez dans Google Cloud Console > OAuth consent screen
2. Si en mode "Testing", ajoutez votre email dans "Test users"
3. Ou publiez l'app (si vous êtes prêt)

### Pas d'erreur mais redirection vers une page blanche

**Cause** : Problème avec le callback NextAuth

**Solution** :
1. Vérifiez les logs du serveur
2. Vérifiez que `NEXTAUTH_URL=http://localhost:3001` dans `.env.local`
3. Vérifiez que le callback dans `lib/auth.ts` fonctionne

## 🔧 Solution : Réinitialiser la configuration Google

Si rien ne fonctionne, créons une nouvelle configuration :

### 1. Créer un nouveau OAuth Client ID

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un **nouveau projet** ou utilisez l'existant
3. APIs & Services > Credentials
4. Créez un **nouveau** OAuth 2.0 Client ID :
   - **Application type** : Web application
   - **Name** : Snappix Dev (nouveau)
   - **Authorized JavaScript origins** : `http://localhost:3001`
   - **Authorized redirect URIs** : `http://localhost:3001/api/auth/callback/google`
5. **Copiez** le nouveau Client ID et Secret

### 2. Mettre à jour `.env.local`

Dans `saas/.env.local`, remplacez :

```env
GOOGLE_CLIENT_ID=le-nouveau-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=le-nouveau-client-secret
```

### 3. Redémarrer le serveur

```powershell
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### 4. Tester

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur "Continuer avec Google"
3. Ça devrait fonctionner maintenant

## 📋 Checklist finale

- [ ] Variables d'environnement dans `.env.local` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [ ] `NEXTAUTH_URL=http://localhost:3001` dans `.env.local`
- [ ] Serveur redémarré après modification des variables
- [ ] Google Cloud Console : Authorized redirect URI = `http://localhost:3001/api/auth/callback/google`
- [ ] Google Cloud Console : Port 3001 (pas 3000)
- [ ] OAuth consent screen configuré
- [ ] Test users ajoutés (si en mode test)

---

**Testez ces étapes et dites-moi ce que vous trouvez !** 🎯



















