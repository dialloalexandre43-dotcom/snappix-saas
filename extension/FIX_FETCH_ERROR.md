# 🔧 Correction de l'erreur "Failed to fetch"

## ✅ Améliorations apportées

### 1. **Gestion d'erreur améliorée**
- Messages d'erreur plus détaillés et utiles
- Détection du type d'erreur (CORS, 404, 401, etc.)
- Instructions claires pour résoudre le problème

### 2. **Validation avant envoi**
- Vérification que l'URL de l'API est valide
- Vérification que l'image est détectée
- Logs détaillés pour le debug

### 3. **Configuration API visible**
- Champ API visible dans le popup (pour debug)
- Permet de modifier l'URL facilement
- Sauvegarde automatique de l'URL

### 4. **Logs améliorés**
- Logs de la requête envoyée
- Logs de la réponse reçue
- Logs des erreurs complètes

## 🐛 Causes possibles de "Failed to fetch"

### 1. **Serveur non démarré**
- Vérifiez que votre serveur Next.js tourne sur `localhost:3001`
- Testez l'URL dans votre navigateur : `http://localhost:3001/api/jobs`

### 2. **URL incorrecte**
- L'URL par défaut est `http://localhost:3001`
- Vérifiez que c'est la bonne URL dans le popup
- Modifiez-la si nécessaire dans le champ "Configuration API"

### 3. **Problème CORS**
- L'extension Chrome doit pouvoir faire des requêtes vers votre API
- Vérifiez la configuration CORS dans votre API Next.js
- Ajoutez l'origine de l'extension si nécessaire

### 4. **Endpoint inexistant**
- Vérifiez que la route `/api/jobs` existe dans votre API
- Testez avec Postman ou curl

## 🧪 Comment tester

1. **Vérifiez que le serveur tourne** :
   ```bash
   cd saas
   npm run dev
   ```
   Le serveur devrait être sur `http://localhost:3001`

2. **Testez l'endpoint directement** :
   - Ouvrez `http://localhost:3001/api/jobs` dans votre navigateur
   - Vous devriez voir une erreur (normal, c'est une POST), mais pas "Failed to fetch"

3. **Vérifiez la configuration dans l'extension** :
   - Ouvrez le popup
   - Vérifiez que l'URL est `http://localhost:3001`
   - Modifiez si nécessaire

4. **Testez la génération** :
   - Sur une page Amazon (qui fonctionne)
   - Cliquez sur "GÉNÉRER MAINTENANT"
   - Regardez les logs dans la console du popup

## 📝 Configuration CORS (si nécessaire)

Si vous avez des erreurs CORS, ajoutez dans votre API Next.js :

```javascript
// saas/app/api/jobs/route.ts
export async function POST(request: Request) {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*', // Ou votre domaine spécifique
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Votre logique ici...
}
```

## 🔍 Debug

Si l'erreur persiste :

1. **Ouvrez la console du popup** :
   - Clic droit sur le popup > "Inspecter"
   - Regardez les logs qui commencent par 📤, 📥, ✅, ou ❌

2. **Vérifiez les logs du serveur** :
   - Regardez la console où tourne `npm run dev`
   - Vérifiez si la requête arrive au serveur

3. **Testez avec curl** :
   ```bash
   curl -X POST http://localhost:3001/api/jobs \
     -H "Content-Type: application/json" \
     -d '{"imageUrl":"test","style":"test","ratio":"1:1"}'
   ```

---

**Les messages d'erreur sont maintenant plus clairs pour identifier le problème !** 🎯



















