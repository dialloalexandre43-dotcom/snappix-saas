# 🔐 Configuration Google OAuth - Guide étape par étape

## ❌ Problème identifié

D'après le test, les variables d'environnement Google OAuth sont **manquantes** :
- ❌ `GOOGLE_CLIENT_ID` : MISSING
- ❌ `GOOGLE_CLIENT_SECRET` : MISSING
- ⚠️ `NEXTAUTH_URL` : `http://localhost:3000` (devrait être `3001`)

## ✅ Solution : Configurer Google OAuth

### Étape 1 : Créer/Modifier le fichier `.env.local`

1. **Allez dans le dossier** `saas/`
2. **Créez ou modifiez** le fichier `.env.local`
3. **Ajoutez ces lignes** :

```env
# Database (vous l'avez déjà)
DATABASE_URL="votre-url-database"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre-secret-existant"

# Google OAuth (À AJOUTER)
GOOGLE_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre-client-secret"
```

**Important** : Changez `NEXTAUTH_URL` de `3000` à `3001` !

### Étape 2 : Créer les credentials Google OAuth

Si vous n'avez pas encore créé les credentials Google :

#### 2.1. Aller sur Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez un projet existant

#### 2.2. Activer l'API

1. **APIs & Services** > **Library**
2. Recherchez **"Google+ API"** ou **"Google Identity"**
3. Cliquez sur **"Enable"**

#### 2.3. Configurer l'OAuth consent screen

1. **APIs & Services** > **OAuth consent screen**
2. Choisissez **External** (pour la plupart des cas)
3. Remplissez les informations :
   - **App name** : Snappix
   - **User support email** : Votre email
   - **Developer contact information** : Votre email
4. Cliquez sur **"Save and Continue"** pour chaque étape

#### 2.4. Créer l'OAuth Client ID

1. **APIs & Services** > **Credentials**
2. Cliquez sur **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Configurez :
   - **Application type** : Web application
   - **Name** : Snappix Dev
   - **Authorized JavaScript origins** :
     ```
     http://localhost:3001
     ```
   - **Authorized redirect URIs** :
     ```
     http://localhost:3001/api/auth/callback/google
     ```
4. Cliquez sur **"Create"**
5. **Copiez le Client ID et le Client Secret**

### Étape 3 : Ajouter les credentials dans `.env.local`

Dans `saas/.env.local`, remplacez :

```env
GOOGLE_CLIENT_ID="le-client-id-que-vous-avez-copié.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="le-client-secret-que-vous-avez-copié"
```

**Important** :
- Pas d'espaces avant/après les valeurs
- Pas de guillemets dans les valeurs (juste autour)
- Copiez exactement tel quel depuis Google Cloud Console

### Étape 4 : Corriger NEXTAUTH_URL

Dans `saas/.env.local`, assurez-vous que :

```env
NEXTAUTH_URL="http://localhost:3001"
```

**Pas** `3000` !

### Étape 5 : Redémarrer le serveur

1. **Arrêtez le serveur** (Ctrl+C dans le terminal)
2. **Redémarrez** :
   ```powershell
   cd "C:\Users\aferr\Desktop\saas image\saas"
   npm run dev
   ```

### Étape 6 : Vérifier la configuration

1. **Ouvrez** : `http://localhost:3001/api/test-google-env`
2. **Vous devriez voir** :
   ```json
   {
     "hasGoogleClientId": true,
     "hasGoogleClientSecret": true,
     "nextAuthUrl": "http://localhost:3001",
     ...
   }
   ```

### Étape 7 : Tester la connexion Google

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur "Continuer avec Google"
3. Ça devrait fonctionner maintenant !

## 🐛 Si vous avez déjà des credentials Google

Si vous avez déjà créé des credentials mais qu'ils ne fonctionnent pas :

### Vérifier le port dans Google Cloud Console

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur votre **OAuth 2.0 Client ID**
3. Vérifiez que **Authorized redirect URIs** contient :
   ```
   http://localhost:3001/api/auth/callback/google
   ```
4. **Pas** `3000` !
5. Si c'est `3000`, modifiez et sauvegardez

## 📋 Checklist finale

- [ ] Fichier `saas/.env.local` créé/modifié
- [ ] `GOOGLE_CLIENT_ID` ajouté dans `.env.local`
- [ ] `GOOGLE_CLIENT_SECRET` ajouté dans `.env.local`
- [ ] `NEXTAUTH_URL=http://localhost:3001` (port 3001)
- [ ] Credentials créés dans Google Cloud Console
- [ ] Authorized redirect URI = `http://localhost:3001/api/auth/callback/google` (port 3001)
- [ ] Serveur redémarré après modification
- [ ] Test `/api/test-google-env` montre `hasGoogleClientId: true`

---

**Suivez ces étapes et dites-moi où vous en êtes !** 🎯



















