# 🍎 Configuration Apple Sign In - Guide simple

## ⚠️ Prérequis

- **Compte développeur Apple** (99$/an) - OBLIGATOIRE
- Accès à [Apple Developer Portal](https://developer.apple.com/account)

---

## 📋 Étapes de configuration

### Étape 1 : Créer un Service ID

1. Allez sur https://developer.apple.com/account
2. Connectez-vous avec votre compte développeur
3. Allez dans **"Certificates, Identifiers & Profiles"**
4. Cliquez sur **"Identifiers"** dans le menu latéral
5. Cliquez sur le **"+"** en haut à droite
6. Sélectionnez **"Services IDs"**
7. Cliquez sur **"Continue"**
8. Remplissez :
   - **Description** : `Snappix`
   - **Identifier** : `com.votredomaine.snappix` (remplacez `votredomaine` par votre domaine)
9. Cochez **"Sign In with Apple"**
10. Cliquez sur **"Continue"** puis **"Register"**

### Étape 2 : Configurer Sign In with Apple

1. Cliquez sur le Service ID que vous venez de créer
2. Cochez **"Sign In with Apple"**
3. Cliquez sur **"Configure"**
4. **Primary App ID** : Sélectionnez votre App ID (ou créez-en un si nécessaire)
5. **Website URLs** :
   - **Domains and Subdomains** : 
     - Pour le dev : `localhost`
     - Pour la prod : `votre-domaine.com` (ou `votre-domaine.vercel.app`)
   - **Return URLs** :
     - Dev : `http://localhost:3001/api/auth/callback/apple`
     - Prod : `https://votre-domaine.com/api/auth/callback/apple` (ou `https://votre-domaine.vercel.app/api/auth/callback/apple`)
6. Cliquez sur **"Save"**
7. Cliquez sur **"Continue"** puis **"Save"**

### Étape 3 : Créer une Key

1. Dans **"Certificates, Identifiers & Profiles"**, allez dans **"Keys"**
2. Cliquez sur le **"+"** en haut à droite
3. Remplissez :
   - **Key Name** : `Snappix Key`
   - Cochez **"Sign In with Apple"**
4. Cliquez sur **"Continue"** puis **"Register"**
5. **⚠️ IMPORTANT** : Téléchargez la clé (fichier `.p8`) - **vous ne pourrez plus la télécharger après !**
6. Notez le **Key ID** affiché (ex: `XYZ789ABC1`)

### Étape 4 : Obtenir votre Team ID

1. En haut à droite de Apple Developer Portal, cliquez sur votre nom
2. Votre **Team ID** est affiché (format: `ABC123DEF4`)
3. **Notez-le** quelque part

### Étape 5 : Générer le Client Secret (JWT)

1. **Installez jsonwebtoken** :
   ```bash
   cd saas
   npm install jsonwebtoken
   ```

2. **Placez votre fichier .p8** dans `saas/scripts/`
   - Renommez-le si nécessaire (ex: `AuthKey_ABC123.p8`)

3. **Modifiez le script** `saas/scripts/generate-apple-secret.js` :
   - Remplacez `VOTRE_TEAM_ID` par votre Team ID
   - Remplacez `com.votredomaine.snappix` par votre Service ID
   - Remplacez `VOTRE_KEY_ID` par votre Key ID
   - Modifiez `PRIVATE_KEY_PATH` pour pointer vers votre fichier .p8

4. **Exécutez le script** :
   ```bash
   node scripts/generate-apple-secret.js
   ```

5. **Copiez le secret généré** (il sera affiché dans la console)

### Étape 6 : Ajouter les variables d'environnement

Dans `saas/.env.local`, ajoutez :

```env
APPLE_ID=com.votredomaine.snappix
APPLE_SECRET=eyJraWQiOiJ... (le JWT généré à l'étape 5)
```

**Important** :
- `APPLE_ID` = Votre Service ID (celui créé à l'étape 1)
- `APPLE_SECRET` = Le JWT généré (valide 6 mois)

### Étape 7 : Redémarrer le serveur

```bash
cd saas
npm run dev
```

### Étape 8 : Tester

1. Allez sur `http://localhost:3001/login`
2. Cliquez sur **"Continuer avec Apple"**
3. Connectez-vous avec votre compte Apple
4. Vous devriez être redirigé vers le dashboard

---

## ⚠️ Notes importantes

### Expiration du secret

Le JWT Apple expire après **6 mois**. Vous devrez le régénérer :
1. Réexécutez `node scripts/generate-apple-secret.js`
2. Mettez à jour `APPLE_SECRET` dans `.env.local`
3. Redémarrez le serveur

### Limitations

- **Compte développeur requis** : 99$/an
- **Secret à régénérer** : Tous les 6 mois
- **Configuration complexe** : Plus complexe que Google OAuth

### Pour la production

Quand vous déployez sur Vercel :
1. Mettez à jour les Return URLs dans Apple Developer Portal avec votre domaine de production
2. Ajoutez les variables d'environnement dans Vercel
3. Régénérez le secret si nécessaire

---

## 📝 Checklist

- [ ] Compte développeur Apple actif
- [ ] Service ID créé
- [ ] Sign In with Apple configuré
- [ ] Return URLs configurées (localhost:3001 pour dev)
- [ ] Key créée et téléchargée (.p8)
- [ ] Team ID noté
- [ ] Key ID noté
- [ ] JWT (Client Secret) généré
- [ ] Variables d'environnement ajoutées dans `.env.local`
- [ ] Serveur redémarré
- [ ] Test réussi

---

## 🆘 Dépannage

### Erreur : "Invalid client secret"
- Vérifiez que `APPLE_SECRET` est correctement copié (pas d'espaces)
- Vérifiez que le secret n'a pas expiré (6 mois max)

### Erreur : "Invalid redirect URI"
- Vérifiez que les Return URLs dans Apple Developer Portal correspondent exactement à `http://localhost:3001/api/auth/callback/apple`

### Erreur : "Service ID not found"
- Vérifiez que `APPLE_ID` correspond exactement à votre Service ID

---

**Configuration terminée ! 🎉**



















