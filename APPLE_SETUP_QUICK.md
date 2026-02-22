# 🍎 Configuration Apple Sign In - Guide rapide

## ⚠️ Important

Apple Sign In nécessite :
- **Un compte développeur Apple** (99$/an) - OBLIGATOIRE
- Configuration plus complexe que Google

---

## 📋 Étapes rapides

### 1. Créer un Service ID dans Apple Developer

1. Allez sur https://developer.apple.com/account
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Créez un **Service ID** (ex: `com.votredomaine.saas`)
4. Activez **"Sign In with Apple"**
5. Configurez les Return URLs :
   - `http://localhost:3001/api/auth/callback/apple`
   - `https://votre-domaine.vercel.app/api/auth/callback/apple`

### 2. Créer une Key

1. **Keys** → Créez une nouvelle key
2. Cochez **"Sign In with Apple"**
3. **Téléchargez la clé .p8** (vous ne pourrez plus la télécharger après !)
4. Notez le **Key ID**

### 3. Obtenir votre Team ID

En haut à droite de Apple Developer Portal → Votre **Team ID** est affiché

### 4. Générer le Client Secret (JWT)

Créez un fichier `generate-apple-secret.js` :

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const teamId = 'VOTRE_TEAM_ID';
const clientId = 'com.votredomaine.saas'; // Votre Service ID
const keyId = 'VOTRE_KEY_ID';
const privateKey = fs.readFileSync('AuthKey_KEYID.p8');

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

Exécutez :
```bash
npm install jsonwebtoken
node generate-apple-secret.js
```

### 5. Ajouter dans `.env.local`

```env
APPLE_ID=com.votredomaine.saas
APPLE_SECRET=eyJraWQiOiJ... (le JWT généré)
```

---

## ✅ C'est tout !

Le code est déjà configuré. Il suffit d'ajouter les variables d'environnement.

---

**Note** : Le secret expire après 6 mois. Vous devrez le régénérer.




















