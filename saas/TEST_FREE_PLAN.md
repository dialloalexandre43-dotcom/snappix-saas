# 🧪 Guide de test - Plan FREE (2 styles seulement)

## 📋 Étapes pour tester le plan FREE

### 1. ✅ Serveur SaaS lancé
Le serveur Next.js devrait être en cours d'exécution sur **http://localhost:3001**

### 2. 🔄 Remettre votre compte au plan FREE

**Option A : Via l'API (recommandé)**

1. Ouvrez votre navigateur et allez sur **http://localhost:3001**
2. Connectez-vous à votre compte
3. Ouvrez la console du navigateur (F12)
4. Exécutez cette commande dans la console :

```javascript
fetch('/api/user/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ plan: 'FREE' })
})
.then(r => r.json())
.then(data => console.log('✅ Plan mis à jour:', data))
.catch(err => console.error('❌ Erreur:', err));
```

**Option B : Via curl (PowerShell)**

```powershell
$session = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/signin" -SessionVariable session
# Connectez-vous d'abord, puis :
Invoke-WebRequest -Uri "http://localhost:3001/api/user/set-plan" -Method POST -WebSession $session -ContentType "application/json" -Body '{"plan":"FREE"}'
```

### 3. 📦 Charger l'extension Chrome

1. Ouvrez Chrome et allez sur **`chrome://extensions/`**
2. Activez le **"Mode développeur"** (en haut à droite)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier **`extension`** dans votre projet :
   ```
   C:\Users\aferr\Desktop\saas image\extension
   ```
5. L'extension devrait apparaître dans la liste

### 4. 🔧 Configurer l'URL de l'API dans l'extension

1. Cliquez sur l'icône de l'extension Snappix dans Chrome
2. Si c'est la première fois, l'extension vous demandera l'URL de l'API
3. Entrez : **`http://localhost:3001`**
4. Cliquez sur "Enregistrer"

### 5. ✅ Tester le filtrage des styles

1. Allez sur une page produit Amazon ou AliExpress
2. Cliquez sur l'icône de l'extension Snappix
3. **Vérifiez que seulement 2 styles sont visibles** :
   - ✅ Studio Blanc
   - ✅ Lifestyle Maison
4. Ouvrez la console de l'extension (clic droit sur l'extension → Inspecter)
5. Vérifiez les logs :
   ```
   ✅ Styles filtrés selon le plan: { plan: 'FREE', stylesCount: 2 }
   ```

### 6. 🔍 Vérification dans la console

Dans la console de l'extension, vous devriez voir :

```
🔍 Styles disponibles depuis l'API: { 
  plan: 'FREE', 
  availableStyleIds: ['studio-blanc', 'lifestyle-maison'],
  stylesFromAPI: [...]
}
✅ Styles filtrés selon le plan: { 
  plan: 'FREE', 
  stylesCount: 2,
  filteredStyles: [
    { id: 'studio-blanc', label: 'Studio Blanc' },
    { id: 'lifestyle-maison', label: 'Lifestyle Maison' }
  ]
}
```

### 7. 🧪 Tester les autres plans

Pour tester STARTER ou PRO :

```javascript
// Dans la console du navigateur (sur localhost:3001)
fetch('/api/user/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ plan: 'STARTER' }) // ou 'PRO'
})
.then(r => r.json())
.then(data => {
  console.log('✅ Plan mis à jour:', data);
  // Rechargez l'extension pour voir les changements
});
```

Puis **rechargez l'extension** (clic droit → Recharger) et vérifiez que 8 styles sont maintenant disponibles.

## 🐛 Dépannage

### L'extension ne charge pas
- Vérifiez que le dossier `extension` contient `manifest.json`
- Vérifiez la console de Chrome (`chrome://extensions/`) pour les erreurs

### L'API ne répond pas
- Vérifiez que le serveur est bien lancé : **http://localhost:3001**
- Vérifiez les logs du serveur dans le terminal

### Les styles ne sont pas filtrés
- Vérifiez que vous avez bien rechargé l'extension après les modifications
- Vérifiez la console de l'extension pour les logs
- Vérifiez que l'API retourne bien les bons styles : **http://localhost:3001/api/user/plan**

## ✅ Résultat attendu

- **Plan FREE** : 2 styles seulement (Studio Blanc, Lifestyle Maison)
- **Plan STARTER** : 8 styles (tous)
- **Plan PRO** : 8 styles (tous)




