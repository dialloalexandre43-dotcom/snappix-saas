# Guide de test de l'endpoint webhook Stripe

## Étape 1 : Démarrer le serveur Next.js

Ouvrez un terminal et démarrez le serveur :

```bash
cd saas
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3001`

## Étape 2 : Installer Stripe CLI

### Option A : Téléchargement manuel (Windows)

1. Allez sur : https://github.com/stripe/stripe-cli/releases/latest
2. Téléchargez le fichier `.zip` pour Windows
3. Extrayez `stripe.exe`
4. Ajoutez-le à votre PATH ou placez-le dans un dossier accessible

### Option B : Utiliser winget

```powershell
winget install stripe.stripe-cli
```

## Étape 3 : Se connecter à Stripe CLI

Dans un **nouveau terminal** (gardez le serveur Next.js en cours d'exécution) :

```bash
stripe login
```

Cela ouvrira votre navigateur pour vous authentifier avec votre compte Stripe.

## Étape 4 : Rediriger les webhooks vers localhost

Toujours dans le terminal Stripe CLI :

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Vous devriez voir quelque chose comme :

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

## Étape 5 : Copier le webhook secret

Copiez le `whsec_...` affiché et ajoutez-le dans votre fichier `.env.local` :

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Étape 6 : Redémarrer le serveur Next.js

Après avoir ajouté le webhook secret, **redémarrez votre serveur Next.js** (Ctrl+C puis `npm run dev`).

## Étape 7 : Tester l'endpoint

### Test 1 : Vérifier que l'endpoint répond

Dans un terminal, testez avec curl :

```bash
curl http://localhost:3001/api/stripe/webhook -X POST -H "Content-Type: application/json" -d "{}"
```

Vous devriez recevoir une erreur "Missing stripe-signature header" - c'est normal, cela confirme que l'endpoint fonctionne.

### Test 2 : Tester avec un événement Stripe

Dans le terminal où `stripe listen` tourne, déclenchez un événement de test :

```bash
stripe trigger checkout.session.completed
```

Vous devriez voir dans les deux terminaux :
- **Stripe CLI** : L'événement est envoyé
- **Next.js** : Les logs du webhook dans la console

### Test 3 : Tester un checkout complet

1. Allez sur votre site : `http://localhost:3001/billing`
2. Cliquez sur "Upgrade" pour STARTER ou PRO
3. Utilisez une carte de test Stripe : `4242 4242 4242 4242`
4. Date d'expiration : n'importe quelle date future
5. CVC : n'importe quel 3 chiffres
6. Complétez le paiement

Vous devriez voir :
- Dans Stripe CLI : Les événements webhook sont reçus
- Dans Next.js : Les logs de traitement
- Dans votre dashboard : Le plan de l'utilisateur est mis à jour

## Vérification

Pour vérifier que tout fonctionne :

1. **Vérifiez les logs** dans le terminal Next.js - vous devriez voir les événements webhook traités
2. **Vérifiez la base de données** - le plan de l'utilisateur devrait être mis à jour
3. **Vérifiez le dashboard Stripe** - vous devriez voir les événements dans "Developers → Events"

## Dépannage

### Erreur "Webhook secret not configured"
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est bien dans `.env.local`
- Redémarrez le serveur Next.js

### Erreur "Invalid signature"
- Vérifiez que vous utilisez le bon webhook secret (celui de Stripe CLI, pas celui du dashboard)
- En local, utilisez toujours le secret de Stripe CLI

### L'endpoint ne répond pas
- Vérifiez que le serveur Next.js tourne sur le port 3001
- Vérifiez l'URL : `http://localhost:3001/api/stripe/webhook`

### Les événements ne sont pas traités
- Vérifiez les logs dans la console Next.js
- Vérifiez que la base de données est accessible
- Vérifiez que les Price IDs sont corrects dans `.env.local`








