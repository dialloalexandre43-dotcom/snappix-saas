# Vérification de la configuration Stripe

## Variables à vérifier dans `.env.local`

Ouvrez votre fichier `saas/.env.local` et vérifiez que vous avez **TOUTES** ces variables :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PRICE_ID_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## Vérification

1. **STRIPE_SECRET_KEY** : Doit commencer par `sk_test_` (mode test) ou `sk_live_` (production)
2. **STRIPE_PRICE_ID_STARTER** : Doit commencer par `price_`
3. **STRIPE_PRICE_ID_PRO** : Doit commencer par `price_`
4. **STRIPE_WEBHOOK_SECRET** : Doit commencer par `whsec_`

## Si une variable manque

1. Ajoutez-la dans `.env.local`
2. **Redémarrez votre serveur Next.js** (très important !)
3. Réessayez de cliquer sur "Upgrade"

## Vérifier les logs du serveur

Quand vous cliquez sur "Upgrade", regardez les logs dans le terminal où tourne `npm run dev`. Vous devriez voir :
- Soit une erreur détaillée
- Soit un message de succès

## Test de l'API directement

Vous pouvez tester l'endpoint directement dans votre navigateur (après vous être connecté) :

1. Ouvrez la console du navigateur (F12)
2. Exécutez :
```javascript
fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'STARTER' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Cela vous montrera l'erreur exacte si quelque chose ne va pas.








