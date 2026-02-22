# 🧪 Guide de test complet - Stripe & Abonnements

Guide précis pour tester tous les aspects du système de paiement.

## 📋 Prérequis

Avant de commencer, assurez-vous que :
- ✅ Le serveur Next.js tourne (`npm run dev` dans le dossier `saas`)
- ✅ Stripe CLI tourne (optionnel mais recommandé) : `stripe listen --forward-to localhost:3001/api/stripe/webhook`
- ✅ Vous êtes connecté à votre application
- ✅ Vous avez accès au dashboard Stripe : https://dashboard.stripe.com/test

---

## Test 1 : Checkout STARTER (5 minutes)

### Étape 1.1 : Vérifier l'état initial
1. Allez sur : `http://localhost:3001/billing`
2. Vérifiez que votre plan actuel est **FREE**
3. Notez les fonctionnalités disponibles (2 styles, 1 format, etc.)

### Étape 1.2 : Lancer le checkout
1. Cliquez sur le bouton **"Upgrade"** sous le plan STARTER
2. La page de paiement Stripe devrait s'ouvrir dans un nouvel onglet

### Étape 1.3 : Utiliser une carte de test
Sur la page Stripe :
- **Numéro de carte** : `4242 4242 4242 4242`
- **Date d'expiration** : `12/25` (ou n'importe quelle date future)
- **CVC** : `123`
- **Code postal** : `75001` (ou n'importe quel code postal)
- Cliquez sur **"Subscribe"** ou **"Payer"**

### Étape 1.4 : Vérifier la redirection
1. Vous devriez être redirigé vers : `http://localhost:3001/dashboard?success=true`
2. Si vous voyez `?success=true` dans l'URL, c'est bon signe

### Étape 1.5 : Vérifier la mise à jour automatique
1. Allez sur : `http://localhost:3001/billing`
2. **Vérifiez que** :
   - Votre plan est maintenant **STARTER** (badge "Actuel")
   - La date de renouvellement est affichée
   - Les fonctionnalités STARTER sont listées

### Étape 1.6 : Vérifier dans Stripe Dashboard
1. Allez sur : https://dashboard.stripe.com/test/payments
2. Vous devriez voir le paiement réussi
3. Allez sur : https://dashboard.stripe.com/test/subscriptions
4. Vous devriez voir votre abonnement STARTER actif

### Étape 1.7 : Vérifier les webhooks
1. Allez sur : https://dashboard.stripe.com/test/events
2. Vous devriez voir les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`

### Étape 1.8 : Vérifier les logs
Dans le terminal où tourne `npm run dev`, vous devriez voir :
```
📥 Webhook received: checkout.session.completed
✅ User ... updated to plan STARTER via checkout.session.completed
```

**✅ Résultat attendu** : Plan mis à jour à STARTER automatiquement

---

## Test 2 : Vérifier les limites du plan STARTER (5 minutes)

### Étape 2.1 : Vérifier les formats disponibles
1. Allez sur : `http://localhost:3001/api/user/plan`
2. Vérifiez que `formats` contient 5 formats (STARTER a 5 formats)
3. Vérifiez que `styles` contient 8 styles (STARTER a 8 styles)

### Étape 2.2 : Tester avec l'extension Chrome (si disponible)
1. Ouvrez l'extension Chrome
2. Vérifiez que seuls les formats/styles STARTER sont disponibles
3. Essayez de sélectionner un format PRO → devrait être désactivé

**✅ Résultat attendu** : Seuls les formats/styles STARTER sont disponibles

---

## Test 3 : Checkout PRO (5 minutes)

### Étape 3.1 : Lancer le checkout PRO
1. Allez sur : `http://localhost:3001/billing`
2. Cliquez sur **"Upgrade"** sous le plan PRO
3. Utilisez la même carte de test : `4242 4242 4242 4242`

### Étape 3.2 : Vérifier la mise à jour
1. Après le paiement, allez sur `/billing`
2. Vérifiez que votre plan est maintenant **PRO**
3. Vérifiez que tous les formats/styles sont disponibles

**✅ Résultat attendu** : Plan mis à jour à PRO avec tous les formats/styles

---

## Test 4 : Annulation d'abonnement (5 minutes)

### Étape 4.1 : Annuler depuis Stripe Dashboard
1. Allez sur : https://dashboard.stripe.com/test/subscriptions
2. Trouvez votre abonnement actif
3. Cliquez sur l'abonnement
4. Cliquez sur **"Cancel subscription"**
5. Confirmez l'annulation

### Étape 4.2 : Vérifier la mise à jour automatique
1. Attendez 5-10 secondes
2. Allez sur : `http://localhost:3001/billing`
3. **Vérifiez que** :
   - Votre plan est revenu à **FREE**
   - Le badge "Actuel" est sur FREE
   - Les fonctionnalités FREE sont listées

### Étape 4.3 : Vérifier les webhooks
1. Allez sur : https://dashboard.stripe.com/test/events
2. Vous devriez voir : `customer.subscription.deleted`

### Étape 4.4 : Vérifier les logs
Dans les logs Next.js, vous devriez voir :
```
📥 Webhook received: customer.subscription.deleted
✅ User ... plan remis à FREE
```

**✅ Résultat attendu** : Plan automatiquement remis à FREE après annulation

---

## Test 5 : Synchronisation automatique (3 minutes)

### Étape 5.1 : Simuler un webhook manqué
1. Dans Stripe Dashboard, créez un nouvel abonnement manuellement (pour tester)
2. OU : Attendez qu'un webhook échoue (peu probable en local)

### Étape 5.2 : Vérifier la synchronisation au chargement
1. Allez sur : `http://localhost:3001/billing`
2. La synchronisation automatique devrait se déclencher
3. Vérifiez dans la console du navigateur (F12) :
   - Vous devriez voir "Auto-syncing subscription..." (si nécessaire)
   - Le plan devrait être mis à jour automatiquement

**✅ Résultat attendu** : Synchronisation automatique au chargement de la page

---

## Test 6 : Test des erreurs (5 minutes)

### Étape 6.1 : Tester avec une carte qui échoue
1. Allez sur : `http://localhost:3001/billing`
2. Cliquez sur "Upgrade" pour STARTER
3. Utilisez la carte de test d'échec : `4000 0000 0000 0002`
4. Le paiement devrait échouer
5. Vérifiez que votre plan reste inchangé

### Étape 6.2 : Tester sans connexion Stripe CLI
1. Arrêtez Stripe CLI (si vous l'utilisez)
2. Faites un nouveau checkout
3. Le paiement devrait fonctionner dans Stripe
4. Allez sur `/billing` → La synchronisation automatique devrait corriger le plan

**✅ Résultat attendu** : Gestion correcte des erreurs et synchronisation de secours

---

## Test 7 : Vérification complète de la base de données (3 minutes)

### Étape 7.1 : Ouvrir Prisma Studio
```bash
cd saas
npx prisma studio
```

### Étape 7.2 : Vérifier votre utilisateur
1. Allez sur la table `User`
2. Trouvez votre utilisateur (par email)
3. **Vérifiez que** :
   - `plan` : STARTER ou PRO (selon votre abonnement)
   - `stripeCustomerId` : Commence par `cus_...`
   - `stripeSubscriptionId` : Commence par `sub_...`
   - `stripePriceId` : Correspond au Price ID configuré
   - `stripeCurrentPeriodEnd` : Date dans le futur

**✅ Résultat attendu** : Toutes les données Stripe sont correctement enregistrées

---

## Test 8 : Test de l'API directement (5 minutes)

### Étape 8.1 : Tester l'endpoint de debug
1. Ouvrez : `http://localhost:3001/api/stripe/debug`
2. Vérifiez que toutes les informations sont correctes :
   - `user.plan` : Correspond à votre plan actuel
   - `stripe.subscriptions` : Liste vos abonnements actifs

### Étape 8.2 : Tester l'endpoint user/plan
1. Ouvrez : `http://localhost:3001/api/user/plan`
2. Vérifiez que :
   - `plan` : Correspond à votre plan
   - `formats` : Liste les formats disponibles pour votre plan
   - `styles` : Liste les styles disponibles pour votre plan

**✅ Résultat attendu** : Les API retournent les bonnes informations

---

## 📊 Checklist de test complète

Cochez chaque test au fur et à mesure :

### Tests de base
- [ ] Checkout STARTER fonctionne
- [ ] Plan mis à jour automatiquement après paiement STARTER
- [ ] Checkout PRO fonctionne
- [ ] Plan mis à jour automatiquement après paiement PRO
- [ ] Annulation fonctionne
- [ ] Plan remis à FREE après annulation

### Tests de fonctionnalités
- [ ] Formats STARTER correctement limités
- [ ] Styles STARTER correctement limités
- [ ] Formats PRO tous disponibles
- [ ] Styles PRO tous disponibles

### Tests de robustesse
- [ ] Synchronisation automatique fonctionne
- [ ] Webhooks reçus et traités
- [ ] Gestion des erreurs de paiement
- [ ] Base de données correctement mise à jour

### Tests de vérification
- [ ] Stripe Dashboard montre les paiements
- [ ] Stripe Dashboard montre les abonnements
- [ ] Logs Next.js montrent les webhooks
- [ ] Prisma Studio montre les bonnes données

---

## 🐛 En cas de problème

### Le plan ne se met pas à jour
1. Vérifiez que Stripe CLI tourne : `stripe listen --forward-to localhost:3001/api/stripe/webhook`
2. Vérifiez les logs Next.js pour les erreurs
3. Vérifiez `/api/stripe/debug` pour voir l'état
4. Essayez de recharger `/billing` (synchronisation automatique)

### Le checkout ne s'ouvre pas
1. Vérifiez `/api/stripe/test` pour voir les variables
2. Vérifiez les logs Next.js
3. Vérifiez la console du navigateur (F12)

### Les webhooks ne sont pas reçus
1. Vérifiez que Stripe CLI tourne
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct dans `.env.local`
3. Vérifiez les événements dans Stripe Dashboard

---

## ✅ Validation finale

Une fois tous les tests passés, votre système est prêt pour la production !

**Temps total estimé** : 30-40 minutes pour tous les tests








