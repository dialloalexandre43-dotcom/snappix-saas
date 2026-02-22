# Prompt Court pour Claude Code

```
Je développe une extension Chrome qui détecte les images produits sur AliExpress.

PROBLÈME : Mon détecteur trouve 5 images mais ce sont des logos/icônes, pas les vraies images du produit.

BESOIN : Créer une fonction JavaScript qui détecte UNIQUEMENT les images du produit (pas les logos, icônes, images de navigation).

CONTRAINTES :
- Extension Chrome (Content Script)
- Retourne un tableau d'URLs d'images (string[])
- Nettoie les URLs (enlève _50x50, _640x640 pour avoir haute résolution)
- Fonctionne sur pages produits AliExpress 2024-2025

CRITÈRES :
✅ Image dans la galerie produit principale
✅ Taille raisonnable (pas icône < 200px)
✅ Provenant de alicdn.com
✅ Visible dans la zone produit (pas header/footer)
❌ Ignorer logos, icônes, boutons, images de navigation

SÉLECTEURS À TESTER :
- .images-view-list img
- .product-image-gallery img
- .magnifier-image img
- [data-role="main-image"] img
- .image-view-item img

FILTRAGE :
- Vérifier naturalWidth/naturalHeight > 200px
- Ignorer images avec classes/IDs suspects (logo, icon, nav)
- Vérifier que l'image est dans la zone produit principale

DONNÉES JS :
- window.__INITIAL_STATE__ (chercher imageModule, productImage)
- window.runParams.imageModule.imagePathList
- Scripts JSON-LD

FONCTION ATTENDUE :
function extractAllProductImagesFromAliExpress() {
  // Retourne string[] d'URLs nettoyées (haute résolution)
  // UNIQUEMENT les images du produit, pas logos/icônes
}

IMPORTANT : Précision > Exhaustivité. Mieux vaut 3-5 bonnes images que 10 avec des logos.
```


















