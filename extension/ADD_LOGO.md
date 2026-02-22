# 🎨 Ajouter le logo Snappix à l'extension

## 📋 Instructions

Le logo Snappix (deux losanges orange superposés) doit être ajouté dans le dossier `extension/`.

### Étape 1 : Préparer le logo

1. **Nom du fichier** : `logo.png`
2. **Taille recommandée** : 28x28px ou 56x56px (pour un affichage net)
3. **Format** : PNG avec transparence (fond transparent)

### Étape 2 : Placer le logo

Placez le fichier `logo.png` dans le dossier `extension/` :

```
extension/
  ├── logo.png          ← Ajoutez le logo ici
  ├── popup.html
  ├── popup.js
  ├── popup.css
  ├── manifest.json
  └── ...
```

### Étape 3 : Recharger l'extension

1. Allez sur `chrome://extensions/`
2. Cliquez sur le bouton de rechargement de l'extension
3. Le logo devrait maintenant apparaître dans le popup

## ✅ Vérification

Le code est déjà configuré pour utiliser le logo :

- ✅ `popup.html` : Image avec fallback automatique
- ✅ `manifest.json` : `web_accessible_resources` configuré
- ✅ Gestion d'erreur : Si le logo n'existe pas, le "S" stylisé s'affiche

## 🎨 Spécifications du logo

D'après votre logo (deux losanges orange superposés) :
- **Couleurs** : Orange clair et orange foncé
- **Fond** : Transparent ou noir
- **Forme** : Deux losanges/diamants superposés

## 📝 Note

Si vous avez le logo dans un autre format (SVG, JPG, etc.), vous pouvez :
1. Le convertir en PNG
2. Ou modifier le code pour utiliser un autre format

Le logo apparaîtra automatiquement dans :
- Le header du popup
- Toutes les pages qui utilisent le composant Logo

---

**Une fois le logo ajouté, rechargez l'extension et il apparaîtra automatiquement !** 🎉



















