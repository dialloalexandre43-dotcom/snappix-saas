# 🔐 Configuration Google OAuth - Guide complet

## 📋 Étapes pour configurer l'authentification Google

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un compte ou connectez-vous
3. Cliquez sur le sélecteur de projet en haut
4. Cliquez sur **"Nouveau projet"**
5. Donnez un nom à votre projet (ex: "SaaS Image Generator")
6. Cliquez sur **"Créer"**

### Étape 2 : Activer l'API Google+

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Library"**
2. Recherchez **"Google+ API"** ou **"Google Identity"**
3. Cliquez sur **"Enable"** (Activer)

### Étape 3 : Créer les identifiants OAuth

1. Allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"** en haut
3. Sélectionnez **"OAuth client ID"**
4. Si c'est la première fois, configurez l'écran de consentement :
   - **User Type** : External (pour la plupart des cas)
   - Cliquez sur **"Create"**
   - Remplissez les informations :
     - **App name** : SaaS Image Generator
     - **User support email** : Votre email
     - **Developer contact information** : Votre email
   - Cliquez sur **"Save and Continue"**
   - Pour les scopes, cliquez sur **"Save and Continue"**
   - Ajoutez des test users si nécessaire, puis **"Save and Continue"**
   - Passez en revue et cliquez sur **"Back to Dashboard"**

5. Créez l'OAuth Client ID :
   - **Application type** : Web application
   - **Name** : SaaS Image Generator Web Client
   - **Authorized JavaScript origins** :
     - Pour le développement : `http://localhost:3001`
     - Pour la production : `https://votre-domaine.vercel.app`
   - **Authorized redirect URIs** :
     - Pour le développement : `http://localhost:3001/api/auth/callback/google`
     - Pour la production : `https://votre-domaine.vercel.app/api/auth/callback/google`
   - Cliquez sur **"Create"**

6. **Copiez le Client ID et le Client Secret** (vous en aurez besoin)

### Étape 4 : Configurer les variables d'environnement

#### En local (fichier `.env.local`)

Ajoutez ces lignes dans `saas/.env.local` :

```env
GOOGLE_CLIENT_ID=votre-client-id-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret-google
```

#### Sur Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur **"Settings"** > **"Environment Variables"**
3. Ajoutez :
   - **Name** : `GOOGLE_CLIENT_ID`
   - **Value** : Votre Client ID
4. Ajoutez :
   - **Name** : `GOOGLE_CLIENT_SECRET`
   - **Value** : Votre Client Secret
5. Cliquez sur **"Save"**
6. **Redéployez** votre application pour que les variables soient prises en compte

### Étape 5 : Mettre à jour la base de données

Exécutez cette commande pour mettre à jour le schéma Prisma :

```bash
cd saas
npx prisma generate
npx prisma db push
```

Cela ajoutera les champs `name` et `image` à la table User et rendra `passwordHash` optionnel.

### Étape 6 : Tester

1. Redémarrez votre serveur de développement :
```bash
cd saas
npm run dev
```

2. **Démarrez le serveur** (si ce n'est pas déjà fait) :
   ```bash
   cd saas
   npm run dev
   ```
   Le serveur sera accessible sur `http://localhost:3001`

3. Allez sur `http://localhost:3001/login`
4. Cliquez sur **"Continuer avec Google"**
5. Connectez-vous avec votre compte Google
6. Vous devriez être redirigé vers `/dashboard`

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter les secrets** :
   - Vérifiez que `.env.local` est dans `.gitignore`
   - Utilisez les variables d'environnement Vercel pour la production

2. **Restreindre les domaines autorisés** :
   - Dans Google Cloud Console, limitez les "Authorized JavaScript origins" à vos domaines uniquement
   - Ne mettez pas `*` ou des domaines génériques

3. **Utiliser HTTPS en production** :
   - Vercel fournit HTTPS automatiquement
   - Assurez-vous que votre URL de production utilise `https://`

---

## 🐛 Dépannage

### Erreur : "redirect_uri_mismatch"

**Solution** : Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à :
- Développement : `http://localhost:3001/api/auth/callback/google`
- Production : `https://votre-domaine.vercel.app/api/auth/callback/google`

### Erreur : "access_denied"

**Solution** : 
- Vérifiez que l'écran de consentement est configuré
- Si en mode test, ajoutez l'email de l'utilisateur dans "Test users"

### L'utilisateur n'est pas créé dans la base de données

**Solution** :
- Vérifiez les logs du serveur
- Vérifiez que le callback `signIn` dans `lib/auth.ts` fonctionne
- Vérifiez que Prisma peut écrire dans la base de données

---

## 📝 Notes importantes

- **Premier déploiement** : Après avoir configuré Google OAuth, vous devrez redéployer sur Vercel
- **Variables d'environnement** : Les variables doivent être ajoutées dans Vercel ET dans votre `.env.local` pour le développement
- **Base de données** : Les utilisateurs Google n'auront pas de `passwordHash` (c'est normal)

---

## ✅ Checklist

- [ ] Projet Google Cloud créé
- [ ] API Google+ activée
- [ ] OAuth Client ID créé
- [ ] URIs de redirection configurées (dev + prod)
- [ ] Variables d'environnement ajoutées (local + Vercel)
- [ ] Base de données mise à jour (`prisma db push`)
- [ ] Test en local réussi
- [ ] Test en production réussi

---

**Configuration terminée ! 🎉**



