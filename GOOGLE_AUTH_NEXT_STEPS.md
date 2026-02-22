# 🔐 Prochaines étapes - Authentification Google

## ✅ Ce qui est déjà fait

1. ✅ Code modifié pour supporter Google OAuth
2. ✅ Boutons "Continuer avec Google" ajoutés sur login/signup
3. ✅ Base de données mise à jour (colonnes `name`, `image`, `passwordHash` optionnel)
4. ✅ NextAuth configuré pour Google

---

## 📋 Prochaines étapes (dans l'ordre)

### Étape 1 : Configurer Google OAuth (OBLIGATOIRE)

Vous devez créer un projet Google Cloud et obtenir les identifiants.

#### 1.1 Créer un projet Google Cloud

1. Allez sur https://console.cloud.google.com/
2. Créez un compte ou connectez-vous
3. Cliquez sur le sélecteur de projet → **"Nouveau projet"**
4. Nommez-le (ex: "SaaS Image Generator")
5. Cliquez sur **"Créer"**

#### 1.2 Activer l'API

1. Menu latéral : **"APIs & Services"** > **"Library"**
2. Recherchez **"Google+ API"** ou **"Google Identity"**
3. Cliquez sur **"Enable"**

#### 1.3 Créer les identifiants OAuth

1. **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"**
3. Sélectionnez **"OAuth client ID"**

4. **Si c'est la première fois**, configurez l'écran de consentement :
   - **User Type** : External
   - **App name** : SaaS Image Generator
   - **User support email** : Votre email
   - **Developer contact** : Votre email
   - Cliquez sur **"Save and Continue"** pour chaque étape

5. Créez l'OAuth Client ID :
   - **Application type** : Web application
   - **Name** : SaaS Image Generator Web
   - **Authorized JavaScript origins** :
     ```
     http://localhost:3000
     https://votre-domaine.vercel.app
     ```
   - **Authorized redirect URIs** :
     ```
     http://localhost:3000/api/auth/callback/google
     https://votre-domaine.vercel.app/api/auth/callback/google
     ```
   - Cliquez sur **"Create"**

6. **Copiez le Client ID et le Client Secret** (vous en aurez besoin !)

---

### Étape 2 : Ajouter les variables d'environnement

#### 2.1 En local (fichier `.env.local`)

Créez ou modifiez `saas/.env.local` :

```env
DATABASE_URL=postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
GOOGLE_CLIENT_ID=votre-client-id-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-google
```

**Remplacez** :
- `votre-client-id-google.apps.googleusercontent.com` par votre Client ID
- `votre-client-secret-google` par votre Client Secret

#### 2.2 Sur Vercel (pour la production)

1. Allez sur https://vercel.com → votre projet
2. **Settings** > **Environment Variables**
3. Ajoutez :
   - **Name** : `GOOGLE_CLIENT_ID`
   - **Value** : Votre Client ID
4. Ajoutez :
   - **Name** : `GOOGLE_CLIENT_SECRET`
   - **Value** : Votre Client Secret
5. Cliquez sur **"Save"**
6. **Redéployez** votre application

---

### Étape 3 : Tester en local

1. **Redémarrez votre serveur** :
```bash
cd saas
npm run dev
```

2. Allez sur http://localhost:3000/login

3. Cliquez sur **"Continuer avec Google"**

4. Connectez-vous avec votre compte Google

5. Vous devriez être redirigé vers `/dashboard`

---

### Étape 4 : Tester en production

1. **Déployez sur Vercel** (si pas déjà fait)

2. **Mettez à jour les URIs dans Google Cloud** :
   - Allez dans Google Cloud Console
   - **Credentials** > votre OAuth Client
   - Ajoutez votre URL Vercel dans les **Authorized redirect URIs** :
     ```
     https://votre-domaine.vercel.app/api/auth/callback/google
     ```

3. **Testez** sur votre site en production

---

## 🔄 Comment ça fonctionne

### Flux d'authentification Google

1. **Utilisateur clique sur "Continuer avec Google"**
   - Le bouton appelle `signIn('google')`

2. **Redirection vers Google**
   - NextAuth redirige vers Google pour l'authentification

3. **Google authentifie l'utilisateur**
   - L'utilisateur se connecte avec son compte Google
   - Google renvoie les informations (email, nom, photo)

4. **Callback NextAuth**
   - NextAuth reçoit les infos de Google
   - Le callback `signIn` vérifie si l'utilisateur existe dans la DB
   - Si non, il crée automatiquement un compte
   - Si oui, il met à jour les infos (nom, photo)

5. **Création de session**
   - NextAuth crée une session JWT
   - L'utilisateur est redirigé vers `/dashboard`

### Différences avec email/password

- **Email/Password** : L'utilisateur doit créer un compte manuellement
- **Google** : Le compte est créé automatiquement lors de la première connexion
- **Google** : Pas de mot de passe stocké (`passwordHash` = null)
- **Google** : Nom et photo de profil automatiquement récupérés

---

## ✅ Checklist finale

- [ ] Projet Google Cloud créé
- [ ] API Google+ activée
- [ ] OAuth Client ID créé
- [ ] URIs de redirection configurées (localhost + production)
- [ ] Variables d'environnement ajoutées (`.env.local` + Vercel)
- [ ] Base de données mise à jour (SQL exécuté)
- [ ] Test en local réussi
- [ ] Test en production réussi

---

## 🐛 Dépannage

### Erreur : "redirect_uri_mismatch"

**Solution** : Vérifiez que l'URI dans Google Cloud correspond exactement à :
- `http://localhost:3000/api/auth/callback/google` (dev)
- `https://votre-domaine.vercel.app/api/auth/callback/google` (prod)

### Erreur : "access_denied"

**Solution** : 
- Vérifiez que l'écran de consentement est configuré
- Si en mode test, ajoutez votre email dans "Test users"

### Le bouton Google ne fonctionne pas

**Solution** :
- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont dans `.env.local`
- Redémarrez le serveur (`npm run dev`)
- Vérifiez la console du navigateur pour les erreurs

---

## 📝 Notes importantes

- **Première connexion Google** : Crée automatiquement un compte
- **Connexions suivantes** : Connecte directement l'utilisateur existant
- **Comptes Google** : N'ont pas de mot de passe (normal)
- **Même email** : Un utilisateur peut se connecter avec email/password ET Google (même compte)

---

**Une fois les identifiants Google configurés, tout fonctionnera automatiquement ! 🚀**





















