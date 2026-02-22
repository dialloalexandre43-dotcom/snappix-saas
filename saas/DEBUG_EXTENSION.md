# Guide de Diagnostic Rapide - Extension

## Étape 1 : Tester l'Authentification

Ouvrez un nouvel onglet et allez sur :
```
http://localhost:3001/api/test-jobs
```

**Résultat attendu** :
- Si vous êtes connecté : `"authenticated": true`
- Si vous n'êtes pas connecté : `"authenticated": false` → **Connectez-vous sur `/login`**

## Étape 2 : Vérifier les Logs du Serveur

Dans le terminal où le serveur tourne, vous devriez voir :

### Si vous êtes connecté :
```
📥 POST /api/jobs - Headers: { ... }
✅ Utilisateur authentifié: votre@email.com
📦 Body reçu: { ... }
✅ Validation réussie: { ... }
🚀 Démarrage de la génération Fal.ai: { ... }
```

### Si vous n'êtes pas connecté :
```
📥 POST /api/jobs - Headers: { ... }
❌ Non authentifié - Session: null
```

## Étape 3 : Tester avec l'Extension

1. **Ouvrez la Console du Navigateur** (F12) sur la page produit
2. **Cliquez sur l'icône de l'extension**
3. **Regardez les messages dans la console** :
   - `📤 Envoi de la requête:` - La requête est envoyée
   - `📥 Réponse reçue:` - La réponse du serveur
   - `❌ Erreur complète:` - Les détails de l'erreur

## Étape 4 : Erreurs Courantes et Solutions

### Erreur 401 - "Non authentifié"
**Solution** : Connectez-vous sur `http://localhost:3001/login`

### Erreur 400 - "Données invalides"
**Vérifiez** :
- Que `imageUrl` ou `imageUrls` est fourni
- Que `style` est fourni
- Que `ratio` est fourni

**Dans les logs**, vous verrez :
```
❌ Erreur de validation Zod: [détails]
```

### Erreur 500 - "Une erreur est survenue"
**Regardez les logs du serveur** pour voir l'erreur exacte :
- Erreur Prisma (base de données) → Vérifiez `DATABASE_URL` dans `.env`
- Erreur Fal.ai → Vérifiez `FAL_AI_API_KEY` dans `.env`
- Autre erreur → Les détails seront dans les logs

### Erreur CORS
**Solution** : Le middleware CORS a été ajouté. Redémarrez le serveur.

## Étape 5 : Tester l'API Directement

Dans la console du navigateur (sur `http://localhost:3001`), exécutez :

```javascript
// Test GET
fetch('http://localhost:3001/api/test-jobs', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)

// Test POST (remplacez les valeurs)
fetch('http://localhost:3001/api/test-jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    imageUrl: 'https://example.com/test.jpg',
    style: 'studio-blanc',
    ratio: '1:1'
  })
}).then(r => r.json()).then(console.log)
```

## Étape 6 : Vérifier les Variables d'Environnement

Vérifiez que votre fichier `.env` contient :
```env
DATABASE_URL=...
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=...
FAL_AI_API_KEY=afe8cfe2-0da0-40df-abe0-f60ce91ac603:2e903c4935ae783fcd3d4ebabe6819fe
FAL_AI_MODEL_ID=fal-ai/flux
```

## Messages d'Erreur Détaillés

Les nouveaux logs affichent maintenant :
- ✅ Les headers de la requête
- ✅ Le body reçu
- ✅ Le résultat de la validation
- ✅ Le démarrage de la génération Fal.ai
- ❌ Les erreurs détaillées avec stack trace

**Regardez toujours les logs du serveur** pour voir exactement où ça bloque !













