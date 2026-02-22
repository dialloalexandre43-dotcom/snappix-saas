# 🍎 Configuration Apple OAuth - Guide étape par étape

## ✅ Ce qui est déjà fait

- ✅ Code Apple OAuth intégré dans `saas/lib/auth.ts`
- ✅ Boutons Apple ajoutés sur les pages login/signup
- ✅ Script de génération de secret créé (`saas/scripts/generate-apple-secret.js`)

## 📋 Ce que vous devez faire

### Étape 1 : Apple Developer Portal (15-20 min)

#### 1.1 Créer un Service ID

1. Allez sur https://developer.apple.com/account
2. Connectez-vous avec votre compte développeur Apple (99$/an requis)
3. Allez dans **"Certificates, Identifiers & Profiles"**
4. Cliquez sur **"Identifiers"** dans le menu latéral
5. Cliquez sur le **"+"** en haut à droite
6. Sélectionnez **"Services IDs"**
7. Cliquez sur **"Continue"**
8. Remplissez :
   - **Description** : `Snappix`
   - **Identifier** : `com.votredomaine.snappix` (remplacez `votredomaine` par votre domaine ou nom)
9. Cochez **"Sign In with Apple"**
10. Cliquez sur **"Continue"** puis **"Register"**

#### 1.2 Configurer Sign In with Apple

1. Cliquez sur le Service ID que vous venez de créer
2. Cochez **"Sign In with Apple"**
3. Cliquez sur **"Configure"**
4. **Primary App ID** : Sélectionnez votre App ID (ou créez-en un si nécessaire)
5. **Website URLs** :
   - **Domains and Subdomains** : `localhost` (pour le développement)
   - **Return URLs** : `http://localhost:3001/api/auth/callback/apple`
6. Cliquez sur **"Save"**
7. Cliquez sur **"Continue"** puis **"Save"**

#### 1.3 Créer une Key

1. Dans **"Certificates, Identifiers & Profiles"**, allez dans **"Keys"**
2. Cliquez sur le **"+"** en haut à droite
3. Remplissez :
   - **Key Name** : `Snappix Key`
   - Cochez **"Sign In with Apple"**
4. Cliquez sur **"Continue"** puis **"Register"**
5. **⚠️ IMPORTANT** : Téléchargez la clé (fichier `.p8`) - **vous ne pourrez plus la télécharger après !**
6. **Notez le Key ID** affiché (ex: `XYZ789ABC1`)

#### 1.4 Obtenir votre Team ID

1. En haut à droite de Apple Developer Portal, cliquez sur votre nom
2. Votre **Team ID** est affiché (format: `ABC123DEF4`)
3. **Notez-le** quelque part

---

### Étape 2 : Générer le Client Secret (5 min)

#### 2.1 Installer jsonwebtoken

```bash
cd "C:\Users\aferr\Desktop\saas image\saas"
npm install jsonwebtoken
```

#### 2.2 Placer votre fichier .p8

1. Placez le fichier `.p8` que vous avez téléchargé dans `saas/scripts/`
2. Renommez-le si nécessaire (ex: `AuthKey_ABC123.p8`)

#### 2.3 Modifier le script

Ouvrez `saas/scripts/generate-apple-secret.js` et modifiez ces lignes :

```javascript
const TEAM_ID = 'VOTRE_TEAM_ID'; // Remplacez par votre Team ID (ex: ABC123DEF4)
const CLIENT_ID = 'com.votredomaine.snappix'; // Remplacez par votre Service ID
const KEY_ID = 'VOTRE_KEY_ID'; // Remplacez par votre Key ID (ex: XYZ789ABC1)
const PRIVATE_KEY_PATH = path.join(__dirname, 'AuthKey_KEYID.p8'); // Modifiez le nom du fichier si nécessaire
```

**Exemple** :
```javascript
const TEAM_ID = 'ABC123DEF4';
const CLIENT_ID = 'com.snappix.app';
const KEY_ID = 'XYZ789ABC1';
const PRIVATE_KEY_PATH = path.join(__dirname, 'AuthKey_XYZ789ABC1.p8');
```

#### 2.4 Exécuter le script

```bash
node scripts/generate-apple-secret.js
```

Le script affichera le secret généré. **Copiez-le** !

---

### Étape 3 : Ajouter les variables d'environnement

Ouvrez `saas/.env.local` et ajoutez :

```env
APPLE_ID=com.votredomaine.snappix
APPLE_SECRET=eyJraWQiOiJ... (le secret généré à l'étape 2.4)
```

**Important** :
- `APPLE_ID` = Votre Service ID (celui créé à l'étape 1.1)
- `APPLE_SECRET` = Le JWT généré (valide 6 mois)

---

### Étape 4 : Redémarrer le serveur

```bash
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

---

### Étape 5 : Tester

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

### Pour la production

Quand vous déployez sur Vercel :
1. Mettez à jour les Return URLs dans Apple Developer Portal avec votre domaine de production
2. Ajoutez les variables d'environnement dans Vercel
3. Régénérez le secret si nécessaire

---

## 📝 Checklist

- [ ] Compte développeur Apple actif (99$/an)
- [ ] Service ID créé
- [ ] Sign In with Apple configuré
- [ ] Return URL configurée : `http://localhost:3001/api/auth/callback/apple`
- [ ] Key créée et téléchargée (.p8)
- [ ] Team ID noté
- [ ] Key ID noté
- [ ] Fichier .p8 placé dans `saas/scripts/`
- [ ] Script `generate-apple-secret.js` modifié avec vos valeurs
- [ ] `jsonwebtoken` installé (`npm install jsonwebtoken`)
- [ ] Secret généré avec succès
- [ ] Variables d'environnement ajoutées dans `.env.local`
- [ ] Serveur redémarré
- [ ] Test réussi sur `http://localhost:3001/login`

---

## 🆘 Dépannage

### Erreur : "Invalid client secret"
- Vérifiez que `APPLE_SECRET` est correctement copié (pas d'espaces avant/après)
- Vérifiez que le secret n'a pas expiré (6 mois max)

### Erreur : "Invalid redirect URI"
- Vérifiez que les Return URLs dans Apple Developer Portal correspondent exactement à `http://localhost:3001/api/auth/callback/apple`
- Pas de trailing slash, pas d'espaces

### Erreur : "Service ID not found"
- Vérifiez que `APPLE_ID` correspond exactement à votre Service ID
- Vérifiez que le Service ID est bien activé dans Apple Developer Portal

### Erreur lors de l'exécution du script
- Vérifiez que le fichier .p8 est bien dans `saas/scripts/`
- Vérifiez que le chemin dans `PRIVATE_KEY_PATH` correspond au nom de votre fichier
- Vérifiez que `jsonwebtoken` est installé

---

**Une fois terminé, Apple OAuth sera fonctionnel ! 🎉**



















