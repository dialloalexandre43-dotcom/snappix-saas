# 🔧 Correction du port 3000 → 3001

## Problème

L'extension essayait de se connecter à `http://localhost:3000` au lieu de `http://localhost:3001`.

## Solution appliquée

J'ai ajouté une **correction automatique** dans le code de l'extension qui :
1. Détecte si l'URL contient `localhost:3000`
2. Remplace automatiquement par `localhost:3001`
3. Sauvegarde la correction dans le localStorage

## Comment tester

1. **Rechargez l'extension** :
   - Allez sur `chrome://extensions/`
   - Cliquez sur le bouton de rechargement 🔄 de l'extension Snappix

2. **Testez la génération** :
   - Allez sur une page produit Amazon
   - Cliquez sur l'icône de l'extension
   - Générez un visuel
   - L'URL devrait maintenant être `http://localhost:3001`

## Vérification manuelle (si nécessaire)

Si vous voulez vérifier ou corriger manuellement l'URL :

1. **Ouvrez l'extension** (cliquez sur l'icône)
2. **Dans la section "Configuration API"** (en bas du popup)
3. **Vérifiez que l'URL est** : `http://localhost:3001`
4. **Si ce n'est pas le cas**, modifiez-la manuellement

## Note

La correction est automatique, donc même si vous aviez une ancienne URL stockée, elle sera corrigée automatiquement au prochain chargement de l'extension.

---

**Dernière mise à jour** : Correction automatique ajoutée dans `popup.js`



















