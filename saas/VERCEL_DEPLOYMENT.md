# 🌐 Guide de déploiement Vercel

## 📋 Étapes de déploiement

### 1. Préparer le projet

#### Structure du projet
Assurez-vous que votre structure est correcte :
```
saas/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── package.json
└── next.config.js
```

#### Vérifier package.json
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

### 2. Variables d'environnement

#### Variables requises pour Vercel

Dans Vercel Dashboard > Settings > Environment Variables, ajoutez :

**Production :**
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=...
FAL_AI_API_KEY=...
FAL_AI_MODEL_ID=fal-ai/flux-pro/kontext
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Preview (optionnel) :**
Même variables mais avec des valeurs de test

### 3. Configuration Vercel

#### Build Settings
- **Framework Preset** : Next.js
- **Root Directory** : `saas` (si votre code est dans ce dossier)
- **Build Command** : `npm run build` (ou laissez vide, Vercel le détecte)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install`

#### Node.js Version
Vercel utilise automatiquement la version spécifiée dans `package.json` :
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 4. Déploiement

#### Option A : Via GitHub (recommandé)

1. **Pousser sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Ready for production"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

2. **Importer dans Vercel**
   - Allez sur https://vercel.com/new
   - Importez votre repository
   - Configurez les paramètres
   - Cliquez sur "Deploy"

#### Option B : Via Vercel CLI

```bash
npm i -g vercel
cd saas
vercel login
vercel --prod
```

### 5. Configuration du domaine

#### Dans Vercel
1. Allez dans Settings > Domains
2. Ajoutez votre domaine : `votre-domaine.com`
3. Vercel vous donnera des enregistrements DNS

#### Dans votre registrar DNS
Ajoutez les enregistrements fournis par Vercel :

**Pour le domaine principal :**
```
Type: A
Name: @
Value: 76.76.21.21 (ou l'IP fournie par Vercel)
```

**Pour www :**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Attendez la propagation DNS** (quelques minutes à 48h)

### 6. Configuration Stripe Production

#### Créer les produits
1. Allez sur https://dashboard.stripe.com/products (mode PRODUCTION)
2. Créez "Snappix Starter" : 9€/mois
3. Créez "Snappix Pro" : 29€/mois
4. Copiez les Price IDs (commencent par `price_`)

#### Configurer les webhooks
1. Allez sur https://dashboard.stripe.com/webhooks
2. Ajoutez un endpoint : `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copiez le Webhook Signing Secret

#### Mettre à jour les variables
Mettez à jour les variables d'environnement dans Vercel avec les valeurs de production.

### 7. Configuration Customer Portal Stripe

1. Allez sur https://dashboard.stripe.com/settings/billing/portal
2. Activez le Customer Portal
3. Configurez :
   - ✅ Permettre le changement de plan
   - ✅ Permettre l'annulation
   - ✅ Permettre la mise à jour de la carte
4. URL de retour : `https://votre-domaine.com/billing`

### 8. Tests post-déploiement

#### Tests essentiels
- [ ] Site accessible sur votre domaine
- [ ] HTTPS fonctionnel (automatique avec Vercel)
- [ ] Connexion/Inscription fonctionne
- [ ] Dashboard accessible
- [ ] Génération d'images fonctionne
- [ ] Paiement Stripe fonctionne (test puis production)
- [ ] Webhooks Stripe fonctionnent
- [ ] Customer Portal accessible

#### Tests de paiement
1. Testez avec une carte de test Stripe
2. Vérifiez que le webhook met à jour le plan
3. Testez le changement de plan via Customer Portal
4. Testez l'annulation (si activée)

### 9. Monitoring

#### Vercel Analytics
- Activez Vercel Analytics dans le dashboard
- Surveillez les performances
- Configurez des alertes pour les erreurs

#### Logs
- Vérifiez les logs dans Vercel Dashboard > Logs
- Surveillez les erreurs 500
- Vérifiez les timeouts

#### Stripe Dashboard
- Surveillez les paiements
- Vérifiez les webhooks (événements reçus)
- Surveillez les échecs de paiement

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Ne jamais commiter les `.env` files
- ✅ Utiliser des secrets différents pour dev/prod
- ✅ Activer 2FA sur Vercel et Stripe
- ✅ Utiliser HTTPS uniquement (automatique avec Vercel)
- ✅ Limiter les permissions Stripe au minimum nécessaire

## 🐛 Dépannage

### Build échoue
- Vérifiez les logs dans Vercel
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez la version de Node.js

### Site ne charge pas
- Vérifiez la configuration DNS
- Vérifiez que le domaine est bien configuré dans Vercel
- Vérifiez les logs Vercel

### Erreurs 500
- Vérifiez les variables d'environnement
- Vérifiez les logs Vercel
- Vérifiez la connexion à la base de données

### Webhooks ne fonctionnent pas
- Vérifiez l'URL du webhook dans Stripe
- Vérifiez le secret du webhook
- Vérifiez les logs Stripe Dashboard > Webhooks

## 📝 Checklist finale

- [ ] Code déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Domaine configuré et fonctionnel
- [ ] HTTPS/SSL actif
- [ ] Produits Stripe créés en production
- [ ] Webhooks Stripe configurés
- [ ] Customer Portal configuré
- [ ] Tests de paiement réussis
- [ ] Extension mise à jour avec l'URL de production
- [ ] Monitoring configuré

## 🎉 Félicitations !

Votre SaaS est maintenant en production et prêt à recevoir des utilisateurs !




