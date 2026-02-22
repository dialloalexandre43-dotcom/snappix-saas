# 🧪 Guide de test des restrictions de plan

Guide précis pour vérifier que les restrictions de plan fonctionnent correctement dans le SaaS et l'extension.

## 📋 Restrictions attendues

### Plan FREE
- **Formats** : 1 seul format (`1024x1024`)
- **Styles** : 2 styles seulement (`studio-blanc`, `lifestyle-maison`)
- **Watermark** : Oui

### Plan STARTER
- **Formats** : 5 formats (`1024x1024`, `1080x1080`, `1080x1920`, `1600x1600`, `2048x2048`)
- **Styles** : 8 styles (tous sauf les styles PRO exclusifs s'il y en a)
- **Watermark** : Non

### Plan PRO
- **Formats** : 13+ formats (tous les formats disponibles)
- **Styles** : 8 styles (tous les styles)
- **Watermark** : Non

---

## Test 1 : Vérifier l'API `/api/user/plan` (5 minutes)

### Étape 1.1 : Tester avec chaque plan

1. **Connectez-vous** à votre application
2. **Changez votre plan** dans Stripe Dashboard (ou via checkout)
3. **Testez l'endpoint** : `http://localhost:3001/api/user/plan`

### Étape 1.2 : Vérifier les résultats

Pour chaque plan, vérifiez que :

**FREE** :
```json
{
  "plan": "FREE",
  "formats": [
    { "id": "jpg-1024", "label": "JPG 1024x1024", ... }
  ],
  "styles": [
    { "id": "studio-blanc", "label": "Studio Blanc" },
    { "id": "lifestyle-maison", "label": "Lifestyle Maison" }
  ]
}
```

**STARTER** :
```json
{
  "plan": "STARTER",
  "formats": [
    { "id": "jpg-1024", ... },
    { "id": "1080x1080", ... },
    { "id": "1080x1920", ... },
    { "id": "1600x1600", ... },
    { "id": "jpg-2048", ... }
  ],
  "styles": [
    // 8 styles
  ]
}
```

**PRO** :
```json
{
  "plan": "PRO",
  "formats": [
    // 13+ formats
  ],
  "styles": [
    // 8 styles (tous)
  ]
}
```

---

## Test 2 : Vérifier l'extension Chrome (10 minutes)

### Étape 2.1 : Tester avec plan FREE

1. **Assurez-vous d'être en plan FREE** (annulez l'abonnement si nécessaire)
2. **Ouvrez l'extension Chrome** sur une page Amazon/AliExpress
3. **Vérifiez que** :
   - Seulement **1 format** est disponible (`1024x1024`)
   - Seulement **2 styles** sont disponibles
   - Les autres formats/styles sont **grisés** ou **masqués**

### Étape 2.2 : Tester avec plan STARTER

1. **Upgradez vers STARTER** via `/billing`
2. **Rechargez l'extension** (fermez et rouvrez)
3. **Vérifiez que** :
   - **5 formats** sont disponibles
   - **8 styles** sont disponibles
   - Les formats PRO sont **grisés** ou **masqués**

### Étape 2.3 : Tester avec plan PRO

1. **Upgradez vers PRO** via `/billing`
2. **Rechargez l'extension**
3. **Vérifiez que** :
   - **Tous les formats** sont disponibles
   - **Tous les styles** sont disponibles
   - Aucun format/style n'est grisé

---

## Test 3 : Vérifier la validation côté serveur (5 minutes)

### Étape 3.1 : Tester avec une requête invalide

Dans la console du navigateur (F12), testez :

```javascript
// Tester avec un format PRO alors que vous êtes en FREE
fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    style: 'Studio Blanc',
    ratio: '16:9', // Format PRO
    formatId: 'rectangle-1920x1080' // Format PRO
  })
})
.then(r => r.json())
.then(console.log)
```

**Résultat attendu** : Erreur 403 avec message "Format non disponible"

### Étape 3.2 : Tester avec un style invalide

```javascript
// Tester avec un style PRO alors que vous êtes en FREE
fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    style: 'Luxury Black', // Style non disponible en FREE
    ratio: '1:1'
  })
})
.then(r => r.json())
.then(console.log)
```

**Résultat attendu** : Erreur 403 avec message "Style non disponible"

---

## Test 4 : Vérifier le watermark pour FREE (5 minutes)

### Étape 4.1 : Créer un job en plan FREE

1. **Assurez-vous d'être en plan FREE**
2. **Créez un job** via l'extension
3. **Vérifiez les images générées** :
   - Elles doivent avoir un **watermark "Snappix"**
   - Le watermark doit être visible mais discret

### Étape 4.2 : Créer un job en plan STARTER/PRO

1. **Upgradez vers STARTER ou PRO**
2. **Créez un job** via l'extension
3. **Vérifiez les images générées** :
   - Elles ne doivent **PAS avoir de watermark**

---

## 📊 Checklist de vérification

### API `/api/user/plan`
- [ ] FREE retourne 1 format et 2 styles
- [ ] STARTER retourne 5 formats et 8 styles
- [ ] PRO retourne 13+ formats et 8 styles

### Extension Chrome
- [ ] FREE : Seulement 1 format et 2 styles visibles
- [ ] STARTER : 5 formats et 8 styles visibles
- [ ] PRO : Tous les formats et styles visibles
- [ ] Formats/styles non disponibles sont grisés ou masqués

### Validation serveur `/api/jobs`
- [ ] Erreur 403 si format non disponible
- [ ] Erreur 403 si style non disponible
- [ ] Message d'erreur clair avec formats/styles disponibles

### Watermark
- [ ] Images FREE ont un watermark
- [ ] Images STARTER/PRO n'ont pas de watermark

---

## 🐛 En cas de problème

### Les formats/styles ne sont pas filtrés dans l'extension

1. Vérifiez la console de l'extension (clic droit → Inspecter)
2. Vérifiez que `loadUserPlanAndFormats()` est appelée
3. Vérifiez que les formats/styles sont filtrés correctement
4. Rechargez l'extension complètement

### L'API retourne tous les formats/styles

1. Vérifiez que le plan utilisateur est correct dans la base de données
2. Vérifiez que `getFormatsByPlan()` et `getStylesByPlan()` fonctionnent
3. Testez directement : `http://localhost:3001/api/user/plan`

### La validation ne fonctionne pas

1. Vérifiez les logs du serveur Next.js
2. Vérifiez que `isFormatAvailableForPlan()` et `isStyleAvailableForPlan()` fonctionnent
3. Testez avec des requêtes directes à `/api/jobs`

---

## ✅ Résultat attendu

Une fois tous les tests passés :
- ✅ Les utilisateurs FREE ne voient que les options FREE
- ✅ Les utilisateurs STARTER ne voient que les options STARTER
- ✅ Les utilisateurs PRO voient toutes les options
- ✅ La validation serveur bloque les tentatives de contournement
- ✅ Le watermark est appliqué uniquement pour FREE








