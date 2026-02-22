# Stripe : Mode Test vs Production

## 🔴 Mode TEST (pour le développement local)

- **Clé secrète** : Commence par `sk_test_...`
- **Clé publique** : Commence par `pk_test_...`
- **Webhook secret** : Commence par `whsec_...` (généré par Stripe CLI ou dashboard test)
- **Produits/Prix** : Doivent être créés dans le **dashboard TEST** de Stripe
- **URL Dashboard** : https://dashboard.stripe.com/test/...

## 🟢 Mode PRODUCTION (pour le site en ligne)

- **Clé secrète** : Commence par `sk_live_...`
- **Clé publique** : Commence par `pk_live_...`
- **Webhook secret** : Commence par `whsec_...` (généré dans le dashboard production)
- **Produits/Prix** : Doivent être créés dans le **dashboard PRODUCTION** de Stripe
- **URL Dashboard** : https://dashboard.stripe.com/... (sans /test/)

## ⚠️ Important

**Les Price IDs créés en mode TEST ne fonctionnent PAS avec les clés PRODUCTION et vice versa !**

Si vous utilisez :
- `sk_test_...` → Vous DEVEZ utiliser des Price IDs créés en mode TEST
- `sk_live_...` → Vous DEVEZ utiliser des Price IDs créés en mode PRODUCTION

## 🔍 Comment vérifier dans quel mode vous êtes

1. Allez sur https://dashboard.stripe.com
2. Regardez en haut à droite : il y a un toggle "Test mode" / "Live mode"
3. Si vous voyez "Test mode" → Vous êtes en mode TEST
4. Si vous voyez "Live mode" → Vous êtes en mode PRODUCTION

## ✅ Pour votre développement local

Vous devez être en **MODE TEST** :
1. Allez sur https://dashboard.stripe.com/test/products
2. Créez les produits STARTER et PRO
3. Copiez les Price IDs (ils commencent par `price_...`)
4. Utilisez `sk_test_...` dans votre `.env.local`








