# 🚀 Guide de déploiement complet

## 📋 Prochaines étapes

### 1. ✅ Publier l'extension Chrome
### 2. ✅ Déployer le SaaS sur Vercel avec votre domaine

---

## 📦 ÉTAPE 1 : Publier l'extension Chrome

### Prérequis
- Compte développeur Chrome Web Store (5$ USD, paiement unique)
- Extension testée et fonctionnelle
- Icônes et assets préparés

### 1.1 Préparer l'extension

#### Créer les icônes nécessaires
Vous devez créer des icônes dans plusieurs tailles :
- `icon-16.png` (16x16)
- `icon-48.png` (48x48)
- `icon-128.png` (128x128)

Placez-les dans le dossier `extension/`

#### Vérifier le manifest.json
```json
{
  "manifest_version": 3,
  "name": "Snappix",
  "version": "1.0.0",
  "description": "Générez des visuels produits professionnels depuis Amazon et AliExpress",
  ...
}
```

#### Mettre à jour l'URL API par défaut
Dans `extension/popup.js`, changez :
```javascript
const DEFAULT_API_URL = "https://votre-domaine.com"
```

### 1.2 Créer le compte développeur

1. Allez sur https://chrome.google.com/webstore/devconsole
2. Cliquez sur "Ajouter un nouvel élément"
3. Payez les 5$ USD (paiement unique)
4. Acceptez les conditions d'utilisation

### 1.3 Préparer le package

1. Créez un fichier ZIP de votre dossier `extension/`
   - **Important** : Le ZIP doit contenir les fichiers directement, pas le dossier `extension/`
   - Structure : `manifest.json`, `popup.html`, `popup.js`, etc. à la racine du ZIP

2. Vérifiez que tous les fichiers sont inclus :
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `popup.css`
   - `content.js`
   - `background.js`
   - `logo.png`
   - `styles/*.jpg` (toutes les images de styles)

### 1.4 Soumettre l'extension

1. Connectez-vous à https://chrome.google.com/webstore/devconsole
2. Cliquez sur "Nouvel élément"
3. Téléversez le fichier ZIP
4. Remplissez les informations :
   - **Nom** : Snappix
   - **Description** : Générez des visuels produits professionnels depuis Amazon et AliExpress
   - **Catégorie** : Productivité
   - **Langue** : Français
   - **Captures d'écran** : Ajoutez 1-5 captures d'écran
   - **Icône de la boutique** : 128x128px
   - **Image promotionnelle** : 440x280px (optionnel mais recommandé)

5. **Politique de confidentialité** : Créez une page sur votre site avec votre politique
   - URL : `https://votre-domaine.com/privacy`

6. Cliquez sur "Soumettre pour révision"
7. Attendez l'approbation (généralement 1-3 jours)

### 1.5 Après publication

- L'extension sera disponible sur le Chrome Web Store
- Les utilisateurs pourront l'installer en un clic
- Vous recevrez des notifications pour les mises à jour

---

## 🌐 ÉTAPE 2 : Déployer sur Vercel avec votre domaine

### Prérequis
- Compte Vercel (gratuit)
- Nom de domaine acheté
- Accès aux DNS de votre domaine

### 2.1 Préparer le projet

#### Variables d'environnement à configurer
Créez un fichier `.env.production` avec :

```env
# Database (Supabase, Neon, etc.)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-clé-secrète-générée"

# Fal.ai
FAL_AI_API_KEY="votre-clé-fal-ai"
FAL_AI_MODEL_ID="fal-ai/flux-pro/kontext"

# Stripe (MODE PRODUCTION)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_PRICE_ID_STARTER="price_..." # Price ID PRODUCTION
STRIPE_PRICE_ID_PRO="price_..." # Price ID PRODUCTION
STRIPE_WEBHOOK_SECRET="whsec_..." # Webhook secret PRODUCTION

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

#### Créer les produits Stripe en PRODUCTION

1. Allez sur https://dashboard.stripe.com/products (mode PRODUCTION)
2. Créez le produit "STARTER" :
   - Nom : Snappix Starter
   - Prix : 9€ / mois (récurrent)
   - Copiez le **Price ID** (commence par `price_`)
3. Créez le produit "PRO" :
   - Nom : Snappix Pro
   - Prix : 29€ / mois (récurrent)
   - Copiez le **Price ID**
4. Mettez à jour les variables d'environnement avec ces Price IDs

#### Configurer les webhooks Stripe en PRODUCTION

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Ajouter un point de terminaison"
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Webhook Signing Secret** (commence par `whsec_`)

### 2.2 Déployer sur Vercel

#### Option A : Via GitHub (recommandé)

1. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Configurez :
     - **Framework Preset** : Next.js
     - **Root Directory** : `saas` (si votre code Next.js est dans le dossier saas)
     - **Build Command** : `npm run build`
     - **Output Directory** : `.next`

3. **Ajouter les variables d'environnement**
   - Dans Vercel, allez dans Settings > Environment Variables
   - Ajoutez toutes les variables de `.env.production`
   - Sélectionnez "Production" pour toutes

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du déploiement

#### Option B : Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   cd saas
   vercel --prod
   ```

4. **Ajouter les variables d'environnement**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_URL production
   # ... pour chaque variable
   ```

### 2.3 Configurer votre domaine

1. **Dans Vercel**
   - Allez dans Settings > Domains
   - Ajoutez votre domaine : `votre-domaine.com`
   - Vercel vous donnera des enregistrements DNS à configurer

2. **Dans votre registrar DNS**
   - Ajoutez les enregistrements fournis par Vercel :
     - Type A : `76.76.21.21` (ou l'IP fournie par Vercel)
     - Type CNAME : `cname.vercel-dns.com` (pour www)
   - Attendez la propagation DNS (peut prendre jusqu'à 48h, généralement quelques minutes)

3. **Vérifier**
   - Vérifiez que `https://votre-domaine.com` fonctionne
   - Vérifiez que `https://www.votre-domaine.com` redirige vers votre domaine principal

### 2.4 Configurer HTTPS et SSL

Vercel configure automatiquement HTTPS/SSL pour votre domaine. Aucune action requise.

### 2.5 Mettre à jour les URLs

#### Dans le code
- Mettez à jour `NEXTAUTH_URL` avec votre domaine
- Mettez à jour l'URL par défaut dans l'extension

#### Dans Stripe
- Mettez à jour les webhooks avec votre domaine de production
- Vérifiez que les URLs de retour sont correctes

---

## ✅ Checklist de déploiement

### Extension Chrome
- [ ] Compte développeur Chrome créé (5$ payés)
- [ ] Icônes créées (16x16, 48x48, 128x128)
- [ ] Manifest.json vérifié
- [ ] URL API par défaut mise à jour
- [ ] Package ZIP créé
- [ ] Extension soumise sur Chrome Web Store
- [ ] Politique de confidentialité créée
- [ ] Extension approuvée et publiée

### Déploiement Vercel
- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Produits Stripe créés en PRODUCTION
- [ ] Webhooks Stripe configurés en PRODUCTION
- [ ] Domaine ajouté dans Vercel
- [ ] DNS configuré
- [ ] Site accessible sur votre domaine
- [ ] HTTPS/SSL fonctionnel
- [ ] Tests de connexion réussis
- [ ] Tests de paiement réussis (mode test puis production)

---

## 🧪 Tests après déploiement

### Tests essentiels
1. **Connexion/Inscription** : Vérifiez que l'authentification fonctionne
2. **Dashboard** : Vérifiez que les jobs s'affichent
3. **Extension** : Installez l'extension depuis le Chrome Web Store
4. **Génération d'images** : Testez la génération depuis l'extension
5. **Paiement** : Testez un paiement avec une carte de test Stripe
6. **Webhooks** : Vérifiez que les webhooks fonctionnent
7. **Changement de plan** : Testez via le Customer Portal

---

## 📝 Notes importantes

### Sécurité
- **Ne jamais** commiter les fichiers `.env` sur GitHub
- Utilisez des secrets différents pour production et développement
- Activez 2FA sur Vercel et Stripe

### Performance
- Vercel met en cache automatiquement
- Configurez les images pour utiliser Next.js Image Optimization
- Surveillez les performances dans le dashboard Vercel

### Monitoring
- Configurez des alertes Vercel pour les erreurs
- Surveillez les logs Stripe pour les échecs de paiement
- Utilisez Vercel Analytics pour suivre les performances

---

## 🆘 Dépannage

### Extension non approuvée
- Vérifiez que la politique de confidentialité est accessible
- Assurez-vous que toutes les permissions sont justifiées
- Répondez aux commentaires des reviewers

### Site Vercel ne fonctionne pas
- Vérifiez les logs dans Vercel Dashboard
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez la configuration DNS

### Webhooks Stripe ne fonctionnent pas
- Vérifiez l'URL du webhook dans Stripe
- Vérifiez le secret du webhook
- Vérifiez les logs dans Stripe Dashboard > Webhooks

---

## 🎉 Félicitations !

Une fois ces étapes terminées, votre SaaS sera :
- ✅ Accessible publiquement sur votre domaine
- ✅ Extension disponible sur Chrome Web Store
- ✅ Prêt à recevoir des utilisateurs et des paiements




