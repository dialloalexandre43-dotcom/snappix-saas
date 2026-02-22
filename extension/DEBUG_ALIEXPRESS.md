# 🔧 Debug - Détection d'image AliExpress

## Problème résolu

La fonction de détection d'image a été améliorée avec :

### ✅ Améliorations apportées

1. **Plus de sélecteurs CSS** :
   - 15+ sélecteurs différents pour AliExpress
   - Sélecteurs pour les nouvelles versions du site
   - Fallback vers les meta tags (og:image, twitter:image)

2. **Meilleure logique de nettoyage d'URL** :
   - Suppression des paramètres de taille (`_50x50`, `_640x640`, etc.)
   - Nettoyage des query parameters
   - Validation des URLs

3. **Recherche dans JSON-LD** :
   - Dernier recours : recherche dans les données structurées
   - Support des graphes JSON-LD

4. **Retry automatique** :
   - Si la première tentative échoue, nouvelle tentative après 500ms
   - Utile si la page est encore en chargement

5. **Logs améliorés** :
   - Console logs pour debug
   - Messages clairs pour chaque étape

## 🧪 Comment tester

1. **Rechargez l'extension** :
   - Allez sur `chrome://extensions/`
   - Cliquez sur le bouton de rechargement

2. **Ouvrez la console** :
   - Sur une page AliExpress, appuyez sur F12
   - Allez dans l'onglet "Console"
   - Vous verrez les logs de détection

3. **Testez sur une page produit** :
   - Allez sur une page produit AliExpress
   - Cliquez sur l'icône de l'extension
   - Vérifiez les logs dans la console du popup (clic droit > Inspecter)

## 🔍 Sélecteurs utilisés pour AliExpress

```javascript
[
  '[data-pl="main"] img',           // Nouveau sélecteur 2024
  '.images-view-item img',          // Galerie d'images
  '.images-view-wrap img',          // Wrapper d'images
  '.product-image img',             // Image produit
  '.product-image-main img',        // Image principale
  '#j-image-thumb-0 img',           // Thumbnail principale
  '.image-view img',                // Vue d'image
  '.gallery-image img',             // Image de galerie
  'img[src*="ae01.alicdn.com"]',   // Images CDN AliExpress
  'meta[property="og:image"]',      // Meta tag Open Graph
  'meta[name="twitter:image"]'       // Meta tag Twitter
]
```

## 🐛 Si ça ne fonctionne toujours pas

1. **Vérifiez la console** :
   - Ouvrez la console du popup (clic droit sur le popup > Inspecter)
   - Regardez les messages d'erreur

2. **Vérifiez les permissions** :
   - L'extension doit avoir accès à `aliexpress.com`
   - Vérifiez dans `chrome://extensions/` que les permissions sont accordées

3. **Testez manuellement** :
   - Ouvrez la console de la page AliExpress (F12)
   - Tapez : `window.extractProductImageForSnappix()`
   - Vous devriez voir l'URL de l'image ou `null`

4. **Vérifiez la structure de la page** :
   - Inspectez la page produit (F12 > Elements)
   - Cherchez l'image principale
   - Notez les classes/id utilisés
   - Partagez-les pour que je puisse ajouter de nouveaux sélecteurs

## 📝 Notes

- La détection fonctionne mieux si la page est complètement chargée
- Certaines pages AliExpress chargent les images de manière asynchrone
- Le retry automatique devrait gérer ce cas

---

**Si le problème persiste, partagez :**
- L'URL de la page produit
- Les logs de la console
- Une capture d'écran de l'inspecteur (F12) montrant l'image



















