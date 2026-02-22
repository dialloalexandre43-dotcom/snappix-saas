# 🍎 Configuration Apple Sign In - Guide complet

## 📋 Prérequis

- Un compte développeur Apple (99$/an) - **OBLIGATOIRE**
- Un identifiant Apple Developer
- Accès à [Apple Developer Portal](https://developer.apple.com/)

---

## 🎯 Étapes de configuration

### Étape 1 : Créer un Service ID

1. Allez sur https://developer.apple.com/account
2. Connectez-vous avec votre compte développeur
3. Allez dans **"Certificates, Identifiers & Profiles"**
4. Cliquez sur **"Identifiers"** dans le menu latéral
5. Cliquez sur le **"+"** en haut à droite
6. Sélectionnez **"Services IDs"**
7. Cliquez sur **"Continue"**
8. Remplissez :
   - **Description** : `SaaS Image Generator`
   - **Identifier** : `com.votredomaine.saas-image-generator` (format: com.votredomaine.appname)
9. Cochez **"Sign In with Apple"**
10. Cliquez sur **"Continue"** puis **"Register"**

---

### Étape 2 : Configurer Sign In with Apple

1. Cliquez sur le Service ID que vous venez de créer
2. Cochez **"Sign In with Apple"**
3. Cliquez sur **"Configure"**
4. **Primary App ID** : Sélectionnez votre App ID (ou créez-en un si nécessaire)
5. **Website URLs** :
   - **Domains and Subdomains** : `votre-domaine.com` (ou `localhost` pour le dev)
   - **Return URLs** :
     - Dev : `http://localhost:3001/api/auth/callback/apple`
     - Prod : `https://votre-domaine.vercel.app/api/auth/callback/apple`
6. Cliquez sur **"Save"**
7. Cliquez sur **"Continue"** puis **"Save"**

---

### Étape 3 : Créer une Key

1. Dans **"Certificates, Identifiers & Profiles"**, allez dans **"Keys"**
2. Cliquez sur le **"+"** en haut à droite
3. Remplissez :
   - **Key Name** : `SaaS Image Generator Key`
   - Cochez **"Sign In with Apple"**
4. Cliquez sur **"Continue"** puis **"Register"**
5. **IMPORTANT** : Téléchargez la clé (fichier `.p8`) - vous ne pourrez plus la télécharger après !
6. Notez le **Key ID** affiché

---

### Étape 4 : Obtenir votre Team ID

1. En haut à droite de Apple Developer Portal, cliquez sur votre nom
2. Votre **Team ID** est affiché (format: `ABC123DEF4`)

---

### Étape 5 : Générer le Client Secret

Apple nécessite un JWT (JSON Web Token) comme secret. Vous devez le générer.

#### Option A : Utiliser un script Node.js (recommandé)

Créez un fichier `generate-apple-secret.js` :

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const teamId = 'VOTRE_TEAM_ID';
const clientId = 'com.votredomaine.saas-image-generator'; // Votre Service ID
const keyId = 'VOTRE_KEY_ID';
const privateKey = fs.readFileSync('path/to/AuthKey_KEYID.p8');

const token = jwt.sign(
  {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 mois
    aud: 'https://appleid.apple.com',
    sub: clientId,
  },
  privateKey,
  {
    algorithm: 'ES256',
    keyid: keyId,
  }
);

console.log(token);
```

Puis exécutez :
```bash
npm install jsonwebtoken
node generate-apple-secret.js
```

#### Option B : Utiliser un service en ligne

- https://appleid.apple.com/signinwithapple/button (générateur de bouton, pas de secret)
- Utilisez plutôt l'Option A

---

### Étape 6 : Ajouter les variables d'environnement

Dans `saas/.env.local`, ajoutez :

```env
APPLE_ID=com.votredomaine.saas-image-generator
APPLE_SECRET=eyJraWQiOiJ... (votre JWT généré)
APPLE_TEAM_ID=ABC123DEF4
APPLE_KEY_ID=XYZ789ABC1
```

**Important** :
- `APPLE_ID` = Votre Service ID
- `APPLE_SECRET` = Le JWT généré (valide 6 mois, à régénérer après)
- `APPLE_TEAM_ID` = Votre Team ID
- `APPLE_KEY_ID` = Votre Key ID

---

### Étape 7 : Mettre à jour NextAuth

Le code est déjà configuré ! Il suffit d'ajouter les variables d'environnement.

---

## ⚠️ Notes importantes

### Expiration du secret

Le JWT Apple expire après **6 mois**. Vous devrez le régénérer :
1. Régénérez le JWT avec le même script
2. Mettez à jour `APPLE_SECRET` dans `.env.local`
3. Redéployez sur Vercel

### Limitations

- **Compte développeur requis** : 99$/an
- **Secret à régénérer** : Tous les 6 mois
- **Configuration complexe** : Plus complexe que Google OAuth

---

## 🧪 Tester

1. Redémarrez votre serveur :
```bash
cd saas
npm run dev
```

2. Allez sur http://localhost:3001/login
3. Cliquez sur **"Continuer avec Apple"**
4. Connectez-vous avec votre compte Apple

---

## 📝 Checklist

- [ ] Compte développeur Apple actif
- [ ] Service ID créé
- [ ] Sign In with Apple configuré
- [ ] Key créée et téléchargée (.p8)
- [ ] Team ID noté
- [ ] Key ID noté
- [ ] JWT (Client Secret) généré
- [ ] Variables d'environnement ajoutées
- [ ] Test réussi

---

## 🔄 Alternative : Utiliser un service tiers

Si la configuration Apple est trop complexe, vous pouvez utiliser :
- **Auth0** (supporte Apple)
- **Firebase Auth** (supporte Apple)
- **Clerk** (supporte Apple)

Ces services gèrent la complexité d'Apple pour vous.

---

**Configuration terminée ! 🎉**




















