# Configuration Stripe

Ce guide vous explique comment configurer Stripe pour gérer les abonnements (STARTER et PRO).

## 1. Créer un compte Stripe

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte (ou connectez-vous)
3. Accédez au **Dashboard Stripe**

## 2. Créer les produits et prix

### Produit STARTER (9€/mois)

1. Allez dans **Products** → **Add product**
2. Nom : `STARTER Plan`
3. Description : `50 images/mois - Qualité standard`
4. Prix : `9.00 EUR`
5. Billing period : `Monthly (recurring)`
6. Copiez le **Price ID** (commence par `price_...`)

### Produit PRO (29€/mois)

1. Allez dans **Products** → **Add product**
2. Nom : `PRO Plan`
3. Description : `300 images/mois - Qualité premium`
4. Prix : `29.00 EUR`
5. Billing period : `Monthly (recurring)`
6. Copiez le **Price ID** (commence par `price_...`)

## 3. Configurer les webhooks

1. Allez dans **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. Endpoint URL : `https://votre-domaine.com/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** (commence par `whsec_...`)

## 4. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_... # Clé secrète (Dashboard → Developers → API keys)
STRIPE_PUBLISHABLE_KEY=pk_test_... # Clé publique (optionnel pour le frontend)
STRIPE_WEBHOOK_SECRET=whsec_... # Secret du webhook
STRIPE_PRICE_ID_STARTER=price_... # Price ID du plan STARTER
STRIPE_PRICE_ID_PRO=price_... # Price ID du plan PRO
```

### Mode test vs production

- **Test** : Utilisez les clés commençant par `sk_test_` et `pk_test_`
- **Production** : Utilisez les clés commençant par `sk_live_` et `pk_live_`

## 5. Mettre à jour la base de données

Après avoir modifié le schéma Prisma, exécutez :

```bash
cd saas
npx prisma generate
npx prisma db push
```

Cela ajoutera les nouveaux champs :
- `stripeCustomerId`
- `stripeSubscriptionId`
- `stripePriceId`
- `stripeCurrentPeriodEnd`

## 6. Tester le flux de paiement

### En local (avec Stripe CLI)

1. Installez [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Connectez-vous : `stripe login`
3. Redirigez les webhooks vers votre serveur local :
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```
4. Copiez le webhook secret affiché et ajoutez-le dans `.env` comme `STRIPE_WEBHOOK_SECRET`

### En production

1. Configurez l'URL du webhook dans le dashboard Stripe
2. Utilisez le webhook secret de production dans vos variables d'environnement

## 7. Tester avec des cartes de test

Stripe fournit des cartes de test :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

Date d'expiration : n'importe quelle date future
CVC : n'importe quel 3 chiffres

## 8. Vérifier que tout fonctionne

1. Allez sur `/billing`
2. Cliquez sur "Upgrade" pour STARTER ou PRO
3. Utilisez une carte de test
4. Vérifiez que votre plan est mis à jour dans la base de données
5. Vérifiez les logs du webhook dans le dashboard Stripe

## Notes importantes

- Les webhooks doivent être accessibles publiquement (pas de localhost en production)
- Utilisez HTTPS en production
- Testez toujours en mode test avant de passer en production
- Surveillez les logs des webhooks dans le dashboard Stripe









