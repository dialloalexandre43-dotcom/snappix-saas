# Guide complet Stripe - Étapes à suivre

## ✅ Étape 1 : Tester le checkout Stripe (MAINTENANT)

### 1.1 Utiliser une carte de test Stripe

Sur la page de paiement Stripe qui s'est ouverte :

**Carte de test pour succès :**
- Numéro : `4242 4242 4242 4242`
- Date d'expiration : N'importe quelle date future (ex: `12/25`)
- CVC : N'importe quel 3 chiffres (ex: `123`)
- Code postal : N'importe quel code postal (ex: `75001`)

**Autres cartes de test utiles :**
- Échec : `4000 0000 0000 0002`
- 3D Secure : `4000 0025 0000 3155`

### 1.2 Compléter le paiement

1. Remplissez les informations de la carte de test
2. Cliquez sur "Subscribe" ou "Payer"
3. Vous serez redirigé vers `/dashboard?success=true`

### 1.3 Vérifier que ça fonctionne

Après le paiement, vérifiez :

1. **Dans votre dashboard Stripe** (https://dashboard.stripe.com/test/payments) :
   - Vous devriez voir le paiement réussi
   - L'abonnement devrait être créé

2. **Dans votre application** :
   - Allez sur `/billing`
   - Votre plan devrait être mis à jour (STARTER ou PRO)
   - Vous devriez voir la date de renouvellement

3. **Dans les logs Stripe CLI** (si vous l'utilisez) :
   - Vous devriez voir les événements webhook reçus

4. **Dans les logs Next.js** :
   - Vous devriez voir "Webhook received" et "User plan updated"

## ✅ Étape 2 : Vérifier les webhooks

### 2.1 Vérifier que Stripe CLI tourne

Si vous utilisez Stripe CLI en local, assurez-vous qu'il tourne :
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

### 2.2 Vérifier les événements dans Stripe Dashboard

1. Allez sur : https://dashboard.stripe.com/test/events
2. Vous devriez voir les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`

### 2.3 Vérifier dans la base de données

1. Ouvrez Prisma Studio :
   ```bash
   cd saas
   npx prisma studio
   ```
2. Allez sur la table `User`
3. Vérifiez que votre utilisateur a :
   - `plan` : `STARTER` ou `PRO`
   - `stripeCustomerId` : Un ID commençant par `cus_...`
   - `stripeSubscriptionId` : Un ID commençant par `sub_...`
   - `stripePriceId` : Le Price ID que vous avez utilisé
   - `stripeCurrentPeriodEnd` : Une date dans le futur

## ✅ Étape 3 : Tester l'annulation d'abonnement

### 3.1 Annuler depuis Stripe Dashboard

1. Allez sur : https://dashboard.stripe.com/test/subscriptions
2. Trouvez votre abonnement
3. Cliquez sur "Cancel subscription"
4. Vérifiez que le plan revient à `FREE` dans votre application

## ✅ Étape 4 : Préparer pour la production

### 4.1 Créer les produits en mode PRODUCTION

1. Allez sur : https://dashboard.stripe.com (sans /test/)
2. Basculez en "Live mode" (en haut à droite)
3. Créez les mêmes produits :
   - STARTER Plan (9€/mois)
   - PRO Plan (29€/mois)
4. Copiez les nouveaux Price IDs (ils seront différents des Price IDs de test)

### 4.2 Configurer les webhooks en production

1. Allez sur : https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le webhook secret (commence par `whsec_...`)

### 4.3 Variables d'environnement en production

Sur votre plateforme de déploiement (Vercel, etc.), ajoutez :

```env
STRIPE_SECRET_KEY=sk_live_... (clé de production)
STRIPE_PRICE_ID_STARTER=price_... (Price ID de production)
STRIPE_PRICE_ID_PRO=price_... (Price ID de production)
STRIPE_WEBHOOK_SECRET=whsec_... (webhook secret de production)
```

## ✅ Étape 5 : Publier l'extension Chrome

### 5.1 Préparer l'extension

1. Vérifiez que l'URL dans `extension/popup.js` pointe vers votre domaine de production
2. Testez l'extension en local avec l'URL de production

### 5.2 Publier sur Chrome Web Store

1. Créez un compte développeur Chrome : https://chrome.google.com/webstore/devconsole
2. Préparez les fichiers :
   - `manifest.json`
   - `popup.html` et `popup.js`
   - Icônes (16x16, 48x48, 128x128)
   - Screenshots pour la store
3. Créez un ZIP de l'extension
4. Uploadez sur Chrome Web Store
5. Remplissez les informations (description, screenshots, etc.)
6. Soumettez pour révision

## ✅ Étape 6 : Monitoring et maintenance

### 6.1 Surveiller les paiements

- Vérifiez régulièrement : https://dashboard.stripe.com/payments
- Surveillez les échecs de paiement
- Configurez des alertes email dans Stripe

### 6.2 Surveiller les webhooks

- Vérifiez les logs : https://dashboard.stripe.com/webhooks
- Surveillez les échecs de webhook
- Testez régulièrement les webhooks

### 6.3 Gérer les abonnements

- Les utilisateurs peuvent gérer leurs abonnements depuis `/billing`
- Vous pouvez aussi créer un portail client Stripe : https://dashboard.stripe.com/settings/billing/portal

## 📋 Checklist finale

### Développement local
- [ ] Checkout Stripe fonctionne avec carte de test
- [ ] Webhooks reçus et traités correctement
- [ ] Plan utilisateur mis à jour dans la base de données
- [ ] Page `/billing` affiche le bon plan

### Production
- [ ] Produits créés en mode PRODUCTION
- [ ] Webhooks configurés avec URL de production
- [ ] Variables d'environnement configurées sur le serveur
- [ ] Test de checkout en production réussi
- [ ] Extension Chrome publiée (ou prête à être publiée)

## 🆘 En cas de problème

### Le checkout ne s'ouvre pas
- Vérifiez `/api/stripe/test` pour voir les variables
- Vérifiez les logs du serveur Next.js
- Vérifiez que vous êtes en mode TEST avec des Price IDs de test

### Le plan ne se met pas à jour
- Vérifiez que Stripe CLI tourne (en local)
- Vérifiez les logs du webhook dans Stripe Dashboard
- Vérifiez les logs Next.js pour les erreurs
- Vérifiez que la base de données est accessible

### Erreur "Invalid price"
- Vérifiez que les Price IDs correspondent au mode (TEST vs PRODUCTION)
- Vérifiez que les produits existent dans Stripe
- Vérifiez que les Price IDs sont corrects dans `.env.local`








