# 🎉 Prochaines étapes - Guide complet

Félicitations ! Votre système de paiement Stripe fonctionne correctement. Voici ce qu'il reste à faire :

## ✅ Ce qui est fait

- [x] Configuration Stripe en mode TEST
- [x] Produits STARTER et PRO créés
- [x] Webhooks configurés et fonctionnels
- [x] Synchronisation automatique des abonnements
- [x] Page de facturation opérationnelle
- [x] Checkout Stripe fonctionnel

## 📋 Checklist avant la production

### 1. Tests finaux en local

- [ ] Tester un checkout STARTER complet
- [ ] Vérifier que le plan passe à STARTER automatiquement
- [ ] Tester un checkout PRO complet
- [ ] Vérifier que le plan passe à PRO automatiquement
- [ ] Tester l'annulation d'abonnement (dans Stripe Dashboard)
- [ ] Vérifier que le plan revient à FREE après annulation
- [ ] Tester que les limites de plan fonctionnent (formats/styles disponibles)

### 2. Préparer la production Stripe

#### 2.1 Créer les produits en mode PRODUCTION

1. Allez sur : https://dashboard.stripe.com
2. **Basculez en "Live mode"** (toggle en haut à droite)
3. Créez les produits :
   - **STARTER Plan** : 9€/mois
   - **PRO Plan** : 29€/mois
4. **Copiez les nouveaux Price IDs** (ils seront différents des Price IDs de test)

#### 2.2 Configurer les webhooks en production

1. Allez sur : https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. **URL** : `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Copiez le webhook secret** (commence par `whsec_...`)

#### 2.3 Obtenir les clés de production

1. Allez sur : https://dashboard.stripe.com/apikeys
2. **Copiez la clé secrète de production** (commence par `sk_live_...`)
3. **Copiez la clé publique de production** (commence par `pk_live_...`) - optionnel pour le frontend

### 3. Déployer sur Vercel (ou autre plateforme)

#### 3.1 Préparer le code

1. Assurez-vous que tout est commité sur Git
2. Poussez sur GitHub

#### 3.2 Configurer Vercel

1. Allez sur : https://vercel.com
2. Importez votre repo GitHub
3. **Root Directory** : `saas`
4. Ajoutez les variables d'environnement :

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=...

# Stripe PRODUCTION
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_STARTER=price_... (Price ID de production)
STRIPE_PRICE_ID_PRO=price_... (Price ID de production)
STRIPE_WEBHOOK_SECRET=whsec_... (Webhook secret de production)
```

#### 3.3 Mettre à jour le webhook Stripe

1. Dans Stripe Dashboard → Webhooks
2. Modifiez l'endpoint de production
3. URL : `https://votre-domaine.vercel.app/api/stripe/webhook`

### 4. Publier l'extension Chrome

#### 4.1 Préparer l'extension

1. Ouvrez `extension/popup.js`
2. Vérifiez que l'URL pointe vers votre domaine de production :
   ```javascript
   const API_BASE_URL = 'https://votre-domaine.vercel.app';
   ```

3. Testez l'extension en local avec l'URL de production

#### 4.2 Créer le package

1. Créez un ZIP de tout le dossier `extension`
2. Assurez-vous d'inclure :
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - Toutes les icônes nécessaires

#### 4.3 Publier sur Chrome Web Store

1. Créez un compte développeur : https://chrome.google.com/webstore/devconsole
   - Coût : 5$ (une seule fois)

2. Cliquez sur "New Item"
3. Uploadez le ZIP
4. Remplissez les informations :
   - **Name** : Snappix (ou votre nom)
   - **Description** : Générez des visuels produits professionnels depuis Amazon et AliExpress
   - **Screenshots** : Ajoutez des captures d'écran
   - **Category** : Productivity
   - **Language** : French (ou English)

5. Soumettez pour révision (peut prendre quelques jours)

### 5. Tests en production

- [ ] Tester un checkout avec une vraie carte (petit montant)
- [ ] Vérifier que le webhook fonctionne en production
- [ ] Vérifier que le plan est mis à jour automatiquement
- [ ] Tester l'extension Chrome avec l'API de production
- [ ] Vérifier que les limites de plan fonctionnent

### 6. Monitoring et maintenance

#### 6.1 Surveiller les paiements

- Vérifiez régulièrement : https://dashboard.stripe.com/payments
- Configurez des alertes email dans Stripe pour les échecs de paiement

#### 6.2 Surveiller les webhooks

- Vérifiez les logs : https://dashboard.stripe.com/webhooks
- Surveillez les échecs de webhook

#### 6.3 Gérer les abonnements

- Les utilisateurs peuvent gérer leurs abonnements depuis `/billing`
- Vous pouvez créer un portail client Stripe : https://dashboard.stripe.com/settings/billing/portal

## 🚀 Résumé des actions immédiates

1. **Tester complètement en local** (checkout, annulation, etc.)
2. **Créer les produits en mode PRODUCTION** dans Stripe
3. **Configurer les webhooks de production**
4. **Déployer sur Vercel** avec les variables d'environnement de production
5. **Mettre à jour l'extension** avec l'URL de production
6. **Publier l'extension** sur Chrome Web Store

## 📞 Support

Si vous rencontrez des problèmes :
- Vérifiez les logs Stripe Dashboard
- Vérifiez les logs Vercel
- Vérifiez les logs de votre serveur Next.js
- Utilisez `/api/stripe/debug` pour diagnostiquer

Bon courage ! 🎉








