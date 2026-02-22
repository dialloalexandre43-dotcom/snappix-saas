# 🆕 Créer un nouveau projet Google OAuth - Guide étape par étape

## 📋 Étapes complètes

### Étape 1 : Accéder à Google Cloud Console

1. Allez sur https://console.cloud.google.com/
2. Connectez-vous avec votre compte Google
3. Si c'est votre première fois, acceptez les conditions d'utilisation

---

### Étape 2 : Créer un nouveau projet

1. En haut de la page, cliquez sur le **sélecteur de projet** (à côté de "Google Cloud")
2. Cliquez sur **"Nouveau projet"** (ou "New Project")
3. Remplissez le formulaire :
   - **Nom du projet** : `SaaS Image Generator` (ou un nom de votre choix)
   - **Organisation** : Laissez par défaut (si vous avez une organisation)
4. Cliquez sur **"Créer"** (ou "Create")
5. Attendez quelques secondes que le projet soit créé
6. **Sélectionnez le projet** dans le sélecteur en haut

---

### Étape 3 : Activer l'API Google Identity

1. Dans le menu latéral gauche, allez dans **"APIs & Services"** (APIs et services)
2. Cliquez sur **"Library"** (Bibliothèque)
3. Dans la barre de recherche, tapez : **"Google Identity"** ou **"Google+ API"**
4. Cliquez sur **"Google Identity"** ou **"Google+ API"**
5. Cliquez sur le bouton **"Enable"** (Activer) en bleu
6. Attendez quelques secondes que l'API soit activée

---

### Étape 4 : Configurer l'écran de consentement OAuth

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"OAuth consent screen"** (Écran de consentement OAuth)
2. Sélectionnez **"External"** (Externe) pour permettre à tous les utilisateurs Google de se connecter
3. Cliquez sur **"Create"** (Créer)

4. **Étape 1 - App information** :
   - **App name** : `SaaS Image Generator` (ou votre nom)
   - **User support email** : Sélectionnez votre email dans la liste
   - **App logo** : (Optionnel) Vous pouvez uploader un logo
   - **App domain** : (Optionnel) Laissez vide pour l'instant
   - **Application home page** : `http://localhost:3001` (ou votre URL de production)
   - **Application privacy policy link** : (Optionnel) Laissez vide
   - **Application terms of service link** : (Optionnel) Laissez vide
   - **Authorized domains** : (Optionnel) Laissez vide
   - Cliquez sur **"Save and Continue"**

5. **Étape 2 - Scopes** :
   - Cliquez sur **"Add or Remove Scopes"**
   - Cochez ces scopes :
     - `.../auth/userinfo.email` (Email de l'utilisateur)
     - `.../auth/userinfo.profile` (Informations de profil)
   - Cliquez sur **"Update"**
   - Cliquez sur **"Save and Continue"**

6. **Étape 3 - Test users** :
   - Si vous êtes en mode "Testing", ajoutez votre email dans **"Test users"**
   - Cliquez sur **"Add Users"**
   - Entrez votre email
   - Cliquez sur **"Add"**
   - Cliquez sur **"Save and Continue"**

7. **Étape 4 - Summary** :
   - Vérifiez les informations
   - Cliquez sur **"Back to Dashboard"**

---

### Étape 5 : Créer les identifiants OAuth

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Credentials"** (Identifiants)
2. En haut de la page, cliquez sur **"+ CREATE CREDENTIALS"** (Créer des identifiants)
3. Sélectionnez **"OAuth client ID"**

4. Remplissez le formulaire :
   - **Application type** : Sélectionnez **"Web application"**
   - **Name** : `SaaS Image Generator Web Client` (ou un nom de votre choix)

5. **Authorized JavaScript origins** :
   - Cliquez sur **"+ ADD URI"**
   - Ajoutez : `http://localhost:3001`
   - Cliquez sur **"+ ADD URI"** à nouveau
   - Ajoutez votre URL de production (ex: `https://votre-domaine.vercel.app`)
   - Si vous n'avez pas encore de domaine, vous pouvez l'ajouter plus tard

6. **Authorized redirect URIs** :
   - Cliquez sur **"+ ADD URI"**
   - Ajoutez : `http://localhost:3001/api/auth/callback/google`
   - Cliquez sur **"+ ADD URI"** à nouveau
   - Ajoutez : `https://votre-domaine.vercel.app/api/auth/callback/google`
   - (Remplacez par votre vrai domaine quand vous l'aurez)

7. Cliquez sur **"Create"** (Créer)

8. **IMPORTANT** : Une popup s'affiche avec :
   - **Your Client ID** : Copiez cette valeur (elle ressemble à : `xxxxx.apps.googleusercontent.com`)
   - **Your Client Secret** : Copiez cette valeur (une longue chaîne de caractères)

   ⚠️ **Copiez ces deux valeurs maintenant !** Vous ne pourrez plus voir le Client Secret après.

---

### Étape 6 : Ajouter les identifiants dans votre projet

1. Ouvrez ou créez le fichier `saas/.env.local`

2. Ajoutez ces lignes :

```env
DATABASE_URL=postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
GOOGLE_CLIENT_ID=votre-client-id-copié.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-copié
```

3. Remplacez :
   - `votre-client-id-copié.apps.googleusercontent.com` par votre **Client ID**
   - `votre-client-secret-copié` par votre **Client Secret**

4. Sauvegardez le fichier

---

### Étape 7 : Tester

1. Assurez-vous que la base de données est à jour (SQL exécuté dans Supabase)

2. Démarrez votre serveur :
```bash
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

3. Allez sur **http://localhost:3001/login**

4. Cliquez sur **"Continuer avec Google"**

5. Connectez-vous avec votre compte Google

6. Vous devriez être redirigé vers `/dashboard`

---

## ✅ Checklist

- [ ] Projet Google Cloud créé
- [ ] API Google Identity activée
- [ ] Écran de consentement OAuth configuré
- [ ] OAuth Client ID créé
- [ ] Client ID et Client Secret copiés
- [ ] URIs de redirection configurées (localhost:3001 + production)
- [ ] Variables ajoutées dans `.env.local`
- [ ] Test réussi

---

## 🐛 Dépannage

### Erreur : "redirect_uri_mismatch"
**Solution** : Vérifiez que l'URI dans Google Cloud est exactement :
- `http://localhost:3001/api/auth/callback/google`

### Erreur : "access_denied"
**Solution** : 
- Vérifiez que votre email est dans "Test users" (si en mode Testing)
- Vérifiez que l'écran de consentement est configuré

### Le Client Secret n'est plus visible
**Solution** : Vous devez créer un nouveau Client ID ou réinitialiser le secret dans Google Cloud Console

---

## 📝 Notes importantes

- **Mode Testing** : Pendant le développement, votre app est en mode "Testing". Seuls les utilisateurs dans "Test users" peuvent se connecter.
- **Mode Production** : Pour que tous les utilisateurs puissent se connecter, vous devrez soumettre votre app pour vérification Google (optionnel pour la plupart des cas).
- **Client Secret** : Ne le partagez jamais publiquement. Gardez-le secret.

---

**Une fois ces étapes terminées, l'authentification Google fonctionnera ! 🚀**





















