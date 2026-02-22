# Guide de Dépannage - Extension Chrome

## Erreur "Une erreur est survenue"

Cette erreur peut avoir plusieurs causes. Suivez ces étapes pour identifier et résoudre le problème :

### 1. Vérifier l'Authentification

**Problème le plus courant** : Vous n'êtes pas connecté à votre compte Snappix.

**Solution** :
1. Ouvrez un nouvel onglet Chrome
2. Allez sur `http://localhost:3001/login`
3. Connectez-vous avec votre compte (ou créez-en un)
4. Revenez sur la page produit Amazon/AliExpress
5. Réessayez avec l'extension

**Vérification** :
- Ouvrez les DevTools (F12) dans l'onglet où vous êtes connecté
- Allez dans l'onglet "Application" → "Cookies" → `http://localhost:3001`
- Vous devriez voir un cookie `next-auth.session-token` ou similaire

### 2. Vérifier que le Serveur est Démarré

**Vérification** :
- Le serveur Next.js doit être en cours d'exécution sur `http://localhost:3001`
- Ouvrez `http://localhost:3001` dans votre navigateur
- Vous devriez voir la page d'accueil de Snappix

**Si le serveur n'est pas démarré** :
```bash
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### 3. Vérifier l'URL de l'API dans l'Extension

1. Ouvrez le popup de l'extension
2. Vérifiez que l'URL dans "Configuration API" est bien `http://localhost:3001`
3. Si ce n'est pas le cas, modifiez-la et réessayez

### 4. Vérifier les Logs du Serveur

Dans le terminal où le serveur tourne, vous devriez voir :
- `📥 POST /api/jobs - Headers:` avec les informations de la requête
- `✅ Utilisateur authentifié:` si vous êtes connecté
- `❌ Non authentifié` si vous n'êtes pas connecté
- Les erreurs détaillées si quelque chose ne va pas

### 5. Vérifier la Console du Navigateur

1. Ouvrez les DevTools (F12) sur la page produit
2. Allez dans l'onglet "Console"
3. Cliquez sur l'icône de l'extension et essayez de générer
4. Regardez les messages dans la console :
   - `📤 Envoi de la requête:` - La requête est envoyée
   - `📥 Réponse reçue:` - La réponse du serveur
   - `❌ Erreur complète:` - Les détails de l'erreur

### 6. Erreurs CORS

Si vous voyez une erreur CORS dans la console :
- Le middleware CORS a été ajouté dans `saas/middleware.ts`
- Redémarrez le serveur pour que les changements prennent effet
- Vérifiez que l'extension est bien chargée avec la dernière version

### 7. Erreur avec Fal.ai

Si l'authentification fonctionne mais que la génération échoue :
- Vérifiez que `FAL_AI_API_KEY` est bien configurée dans `.env`
- Vérifiez les logs du serveur pour voir l'erreur exacte de Fal.ai
- Le job sera créé mais son statut sera `ERROR` si Fal.ai échoue

## Messages d'Erreur Courants

### "Non authentifié" (401)
→ Connectez-vous sur `http://localhost:3001/login`

### "Impossible de se connecter à l'API"
→ Vérifiez que le serveur est démarré sur le port 3001

### "Endpoint non trouvé" (404)
→ Vérifiez que l'URL de l'API est correcte dans l'extension

### "Erreur HTTP 500"
→ Regardez les logs du serveur pour voir l'erreur détaillée

## Test Rapide

Pour tester rapidement si tout fonctionne :

1. **Test de connexion** :
   - Allez sur `http://localhost:3001/login`
   - Connectez-vous

2. **Test de l'API directement** :
   - Ouvrez les DevTools (F12)
   - Allez dans l'onglet "Console"
   - Exécutez :
   ```javascript
   fetch('http://localhost:3001/api/jobs', {
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
   - Si vous obtenez `{ error: 'Non authentifié' }`, vous n'êtes pas connecté
   - Si vous obtenez une autre erreur, regardez les détails

3. **Test avec l'extension** :
   - Allez sur une page produit Amazon/AliExpress
   - Utilisez l'extension
   - Regardez la console pour les erreurs

## Redémarrer le Serveur

Si vous avez modifié des fichiers, redémarrez le serveur :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Redémarrez :
   ```bash
   cd "C:\Users\aferr\Desktop\saas image\saas"
   npm run dev
   ```

## Recharger l'Extension

Après avoir modifié les fichiers de l'extension :

1. Allez sur `chrome://extensions/`
2. Cliquez sur l'icône de rechargement (🔄) sur la carte Snappix













