# 🔄 Comment revenir au plan FREE

## 📋 Méthode 1 : Via la console du navigateur (RECOMMANDÉ)

### Étape 1 : Ouvrir le SaaS
1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3001**
3. **Connectez-vous** à votre compte (si ce n'est pas déjà fait)

### Étape 2 : Ouvrir la console du navigateur
1. Appuyez sur **F12** (ou clic droit → Inspecter)
2. Cliquez sur l'onglet **"Console"**

### Étape 3 : Exécuter la commande
Copiez-collez cette commande dans la console et appuyez sur **Entrée** :

```javascript
fetch('/api/user/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ plan: 'FREE' })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Plan mis à jour:', data);
  alert('Plan mis à jour avec succès ! Vous êtes maintenant en plan FREE.');
  location.reload(); // Recharger la page pour voir les changements
})
.catch(err => {
  console.error('❌ Erreur:', err);
  alert('Erreur lors de la mise à jour du plan');
});
```

### Étape 4 : Vérifier
- Vous devriez voir un message de confirmation
- La page se rechargera automatiquement
- Vérifiez que vous êtes bien en plan FREE (dans le dashboard ou la page billing)

---

## 📋 Méthode 2 : Via l'API directement (PowerShell)

### Étape 1 : Ouvrir PowerShell
Ouvrez PowerShell dans le dossier du projet

### Étape 2 : Exécuter la commande
**⚠️ Note :** Cette méthode nécessite que vous soyez connecté. Il est plus simple d'utiliser la Méthode 1.

```powershell
# Récupérer les cookies de session (nécessite d'être connecté)
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Appeler l'API
$body = @{
    plan = "FREE"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/user/set-plan" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -WebSession $session
```

---

## 📋 Méthode 3 : Via la base de données (AVANCÉ)

Si vous avez accès à votre base de données (Supabase, etc.) :

```sql
-- Remplacez 'votre_email@example.com' par votre email
UPDATE "User" 
SET plan = 'FREE',
    "stripeSubscriptionId" = NULL,
    "stripePriceId" = NULL,
    "stripeCurrentPeriodEnd" = NULL
WHERE email = 'votre_email@example.com';
```

---

## ✅ Vérification

### Vérifier via l'API
Ouvrez dans votre navigateur : **http://localhost:3001/api/user/plan**

Vous devriez voir :
```json
{
  "plan": "FREE",
  "formats": [...],
  "styles": [
    { "id": "studio-blanc", "label": "Studio Blanc" },
    { "id": "lifestyle-maison", "label": "Lifestyle Maison" }
  ]
}
```

### Vérifier dans l'extension Chrome
1. Rechargez l'extension (clic droit → Recharger)
2. Ouvrez l'extension sur une page produit
3. Vérifiez que seulement **2 styles** sont visibles :
   - ✅ Studio Blanc
   - ✅ Lifestyle Maison

---

## 🧪 Tester les autres plans

Pour tester STARTER :
```javascript
fetch('/api/user/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ plan: 'STARTER' })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Plan mis à jour:', data);
  location.reload();
});
```

Pour tester PRO :
```javascript
fetch('/api/user/set-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ plan: 'PRO' })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Plan mis à jour:', data);
  location.reload();
});
```

---

## 🐛 Dépannage

### Erreur : "Non authentifié"
- Assurez-vous d'être **connecté** sur http://localhost:3001
- Rafraîchissez la page et réessayez

### Erreur : "Plan invalide"
- Vérifiez que vous avez bien écrit `'FREE'` (en majuscules)
- Les valeurs possibles sont : `'FREE'`, `'STARTER'`, `'PRO'`

### Le plan ne change pas
- Vérifiez la console pour les erreurs
- Vérifiez que le serveur est bien lancé
- Essayez de vous déconnecter et reconnecter




