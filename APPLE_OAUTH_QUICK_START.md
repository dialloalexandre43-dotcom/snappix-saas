# 🍎 Apple OAuth - Démarrage rapide

## ⚡ Résumé en 3 étapes

### 1. Configuration Apple Developer (15-20 min)

1. **Créer un Service ID** dans [Apple Developer Portal](https://developer.apple.com/account)
   - Identifier : `com.votredomaine.snappix`
   - Activer "Sign In with Apple"
   - Configurer Return URL : `http://localhost:3001/api/auth/callback/apple`

2. **Créer une Key**
   - Télécharger le fichier `.p8`
   - Noter le Key ID

3. **Noter votre Team ID**
   - En haut à droite du portal Apple Developer

### 2. Générer le secret (2 min)

```bash
cd saas
npm install jsonwebtoken
```

Modifiez `saas/scripts/generate-apple-secret.js` avec vos valeurs, puis :
```bash
node scripts/generate-apple-secret.js
```

Copiez le secret généré.

### 3. Ajouter dans `.env.local`

```env
APPLE_ID=com.votredomaine.snappix
APPLE_SECRET=eyJraWQiOiJ... (le secret généré)
```

Redémarrez le serveur et testez !

---

## 📚 Guide complet

Voir `APPLE_OAUTH_GUIDE_SIMPLE.md` pour les détails complets.

---

## ⚠️ Important

- **Compte développeur Apple requis** (99$/an)
- **Secret expire dans 6 mois** (à régénérer)
- **Pour la production** : Mettre à jour les Return URLs avec votre domaine



















