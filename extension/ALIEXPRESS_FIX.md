# 🔧 Amélioration de la détection AliExpress

## ✅ Améliorations apportées

### 1. **Plus de sélecteurs CSS** (30+ sélecteurs)
- Sélecteurs pour les nouvelles versions d'AliExpress (2024-2025)
- Support des conteneurs et des images directes
- Sélecteurs par data-attributes
- Sélecteurs pour tous les CDN AliExpress (ae01-ae05, sc01-sc02)

### 2. **Meilleure logique de détection**
- Détection des images dans les conteneurs
- Support des attributs `data-src-large`, `data-src-medium`
- Vérification que l'URL contient `alicdn.com`
- Ajout automatique de l'extension si manquante

### 3. **Retry amélioré pour AliExpress**
- 3 tentatives au lieu de 2
- Délais plus longs pour AliExpress (1.5s puis 1s)
- Les images AliExpress chargent souvent de manière asynchrone

### 4. **Nettoyage d'URL amélioré**
- Suppression des paramètres de taille (`_50x50`, `_640x640`, etc.)
- Support des formats `.jpg`, `.png`, `.webp`
- Nettoyage des query parameters

## 🧪 Comment tester

1. **Rechargez l'extension** :
   - Allez sur `chrome://extensions/`
   - Cliquez sur le bouton de rechargement

2. **Testez sur AliExpress** :
   - Allez sur une page produit AliExpress
   - Attendez que la page soit complètement chargée
   - Cliquez sur l'icône de l'extension
   - L'image devrait être détectée

3. **Si ça ne fonctionne toujours pas** :
   - Ouvrez la console (F12 sur la page AliExpress)
   - Regardez les logs qui commencent par "🔍 Snappix:"
   - Partagez les logs pour que je puisse ajouter d'autres sélecteurs

## 📋 Sélecteurs testés

L'extension essaie maintenant ces sélecteurs (dans l'ordre) :

1. `[data-pl="main"] img` - Nouveau sélecteur 2024
2. `.images-view-item img` - Galerie d'images
3. `.product-image-main img` - Image principale
4. `#j-image-thumb-0 img` - Thumbnail principale
5. `img[src*="ae01.alicdn.com"]` - Images CDN
6. Et 25+ autres sélecteurs...

## 🐛 Debug

Si l'image n'est toujours pas détectée :

1. **Ouvrez la console du popup** :
   - Clic droit sur le popup > "Inspecter"
   - Regardez les messages de log

2. **Ouvrez la console de la page** :
   - F12 sur la page AliExpress
   - Cherchez les messages "🔍 Snappix:"

3. **Inspectez la page** :
   - F12 > Elements
   - Cherchez l'image principale du produit
   - Notez les classes/id utilisés
   - Partagez-les pour que je puisse ajouter de nouveaux sélecteurs

## 💡 Note importante

AliExpress charge souvent les images de manière asynchrone. L'extension fait maintenant 3 tentatives avec des délais pour s'assurer que les images sont chargées.

---

**Testez et dites-moi si ça fonctionne maintenant !** 🎉



















