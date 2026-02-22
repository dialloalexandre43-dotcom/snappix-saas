# Prompt pour Claude Code - Détecteur d'Images AliExpress

## Contexte

Je développe une extension Chrome qui doit détecter les **vraies images du produit** sur les pages produits AliExpress (ex: `https://www.aliexpress.com/item/...`).

**Problème actuel** : Mon détecteur trouve 5 images, mais ce sont des images qui n'ont rien à voir avec le produit (logos, icônes, images de navigation, etc.). Je dois détecter uniquement les **images principales du produit** affichées dans la galerie d'images du produit.

## Objectif

Créer une fonction JavaScript qui :
1. **Détecte UNIQUEMENT les images du produit** (pas les logos, icônes, images de navigation, etc.)
2. **Retourne toutes les images du produit** (généralement 3-10 images par produit)
3. **Fonctionne sur les pages produits AliExpress** (structure 2024-2025)
4. **Ignore les images non pertinentes** (logos, boutons, icônes, images de fond, etc.)

## Contraintes techniques

- **Environnement** : Extension Chrome (Manifest V3)
- **Exécution** : Content script injecté dans la page AliExpress
- **Format de retour** : Tableau d'URLs d'images (`string[]`)
- **Nettoyage des URLs** : Enlever les paramètres de taille (`_50x50`, `_640x640`, etc.) pour obtenir les images en haute résolution

## Structure des pages AliExpress

Les pages produits AliExpress ont généralement :
- Une **galerie d'images principale** avec les images du produit
- Des **miniatures** cliquables pour changer l'image principale
- Les images sont souvent chargées de manière **lazy** (attributs `data-src`, `data-lazy-src`)
- Les URLs contiennent souvent des paramètres de taille qu'il faut nettoyer

## Critères de détection

Une image est considérée comme **image du produit** si :
1. ✅ Elle est dans la **galerie d'images principale** du produit
2. ✅ Elle est visible dans la **zone d'affichage des images produit** (pas dans le header, footer, sidebar)
3. ✅ Elle a une **taille raisonnable** (pas une icône 16x16 ou un logo)
4. ✅ Elle provient du **CDN AliExpress** (`alicdn.com`)
5. ✅ Elle n'est **pas un logo, icône, ou image de navigation**

Une image doit être **ignorée** si :
1. ❌ C'est un logo (petite taille, position fixe en header/footer)
2. ❌ C'est une icône (petite taille, souvent SVG ou PNG < 100px)
3. ❌ C'est une image de navigation/bouton
4. ❌ C'est une image de fond (background-image)
5. ❌ Elle est en dehors de la zone produit principale

## Approche suggérée

1. **Identifier la zone produit principale** :
   - Chercher les conteneurs spécifiques à la galerie d'images produit
   - Éviter les zones header, footer, sidebar, navigation

2. **Sélecteurs CSS prioritaires** :
   - Galerie d'images principale : `.images-view`, `.product-image-gallery`, `.image-view-list`
   - Miniatures : `.image-thumb`, `.gallery-thumb`, `[data-role="image-thumb"]`
   - Image principale affichée : `.magnifier-image`, `.main-image`, `[data-role="main-image"]`

3. **Filtrage intelligent** :
   - Vérifier la taille naturelle de l'image (`naturalWidth`, `naturalHeight`)
   - Ignorer les images < 200px de largeur/hauteur
   - Vérifier que l'image est visible et dans le viewport
   - Ignorer les images avec des classes/IDs suspects (logo, icon, nav, etc.)

4. **Nettoyage des URLs** :
   - Enlever les paramètres de taille : `_50x50.jpg` → `.jpg`
   - Enlever les query parameters : `?v=123` → rien
   - Obtenir l'URL en haute résolution

## Structure de la fonction attendue

```javascript
/**
 * Extrait toutes les images du produit depuis une page AliExpress
 * @returns {string[]} Tableau d'URLs d'images du produit (haute résolution)
 */
function extractAllProductImagesFromAliExpress() {
  // Votre implémentation ici
  // Retourner un tableau d'URLs nettoyées
}
```

## Exemples de sélecteurs à tester

- `.images-view-list img`
- `.product-image-gallery img`
- `.magnifier-image img`
- `[data-role="main-image"] img`
- `.image-view-item img`
- `#j-image-thumb-0 img` et ses variantes
- Conteneurs avec `data-pl="main"`

## Données JavaScript à explorer

- `window.__INITIAL_STATE__` - Peut contenir les URLs des images dans `imageModule` ou `productImage`
- `window.runParams` - Peut contenir `imageModule.imagePathList`
- Scripts JSON-LD avec `application/ld+json`

## Critères de validation

La fonction doit :
1. ✅ Retourner **uniquement les images du produit** (pas de logos/icônes)
2. ✅ Retourner **toutes les images du produit** (généralement 3-10 images)
3. ✅ Retourner les URLs en **haute résolution** (nettoyées)
4. ✅ Fonctionner sur **différentes variantes** de pages AliExpress
5. ✅ Être **robuste** face aux changements de structure de page

## Test

Pour tester, ouvrez une page produit AliExpress dans la console et exécutez :
```javascript
const images = extractAllProductImagesFromAliExpress();
console.log(`${images.length} images trouvées:`, images);
```

Les images retournées doivent être les **vraies images du produit** affichées dans la galerie, pas des logos ou icônes.

---

**Note importante** : Le détecteur doit être **précis** plutôt que **exhaustif**. Il vaut mieux retourner 3-5 bonnes images que 10 images dont la moitié sont des logos/icônes.


















