# Comment Charger l'Extension Chrome pour Tester

## Étapes pour Charger l'Extension

### 1. Ouvrir la Page des Extensions Chrome

1. Ouvrez Google Chrome
2. Tapez dans la barre d'adresse : `chrome://extensions/`
3. Appuyez sur **Entrée**

### 2. Activer le Mode Développeur

1. En haut à droite de la page, activez le **"Mode développeur"** (toggle)
2. Les options de développement apparaîtront

### 3. Charger l'Extension

1. Cliquez sur le bouton **"Charger l'extension non empaquetée"** (ou "Load unpacked")
2. Naviguez vers le dossier de votre projet
3. Sélectionnez le dossier **`extension`** (pas le dossier parent)
   - Chemin complet : `C:\Users\aferr\Desktop\saas image\extension`
4. Cliquez sur **"Sélectionner le dossier"** (ou "Select Folder")

### 4. Vérifier que l'Extension est Chargée

Vous devriez voir :
- ✅ L'extension "Snappix" dans la liste
- ✅ L'icône de l'extension dans la barre d'outils Chrome (en haut à droite)
- ✅ Le statut "Erreurs" devrait être à 0 (ou vous pouvez voir les erreurs en cliquant)

## Tester l'Extension

### 1. Vérifier que le Serveur est Démarré

- Le serveur Next.js doit être en cours d'exécution sur `http://localhost:3001`
- Vérifiez dans votre terminal que le serveur tourne

### 2. Aller sur une Page Produit

1. Ouvrez un nouvel onglet Chrome
2. Allez sur une page produit **Amazon** ou **AliExpress**, par exemple :
   - Amazon : `https://www.amazon.fr/dp/B08XXXXXXX`
   - AliExpress : `https://fr.aliexpress.com/item/XXXXXXX.html`

### 3. Utiliser l'Extension

1. Cliquez sur l'icône **Snappix** dans la barre d'outils Chrome
2. Le popup de l'extension s'ouvre
3. L'extension devrait automatiquement détecter l'image du produit
4. Sélectionnez :
   - Un **style** (ex: "Studio Blanc", "Lifestyle Maison")
   - Un **format** (ex: "Carré 1:1", "Vertical 4:5")
5. Vérifiez que l'URL de l'API est bien `http://localhost:3001`
6. Cliquez sur **"Générer mes visuels"**

### 4. Vérifier les Résultats

1. Vous serez redirigé vers la page du job créé
2. Les images seront générées en arrière-plan avec Fal.ai
3. Le statut du job passera de `PROCESSING` à `DONE` une fois les images générées

## Dépannage

### L'Extension ne s'affiche pas

- Vérifiez que vous avez bien sélectionné le dossier `extension` (pas le dossier parent)
- Vérifiez qu'il n'y a pas d'erreurs dans `chrome://extensions/`
- Cliquez sur "Recharger" (icône de rafraîchissement) sur la carte de l'extension

### Erreur "Impossible de se connecter à l'API"

- Vérifiez que le serveur Next.js est bien démarré sur le port 3001
- Vérifiez l'URL dans le popup de l'extension (doit être `http://localhost:3001`)
- Ouvrez la console Chrome (F12) pour voir les erreurs détaillées

### L'Image n'est pas détectée

- L'extension fonctionne uniquement sur les pages produits Amazon/AliExpress
- Vérifiez que vous êtes bien sur une page produit (pas une page de recherche)
- Utilisez le bouton "🔍 Debug" dans le popup pour voir ce qui est détecté

### Erreurs CORS

- Le serveur Next.js doit autoriser les requêtes depuis `chrome-extension://`
- Vérifiez la configuration CORS dans votre serveur

## Recharger l'Extension après Modifications

Après avoir modifié les fichiers de l'extension :

1. Allez sur `chrome://extensions/`
2. Cliquez sur l'icône de **rechargement** (🔄) sur la carte de l'extension Snappix
3. L'extension sera rechargée avec vos modifications

## Mapping des Styles Extension → Fal.ai

L'extension utilise ces IDs de styles qui sont automatiquement mappés vers les IDs Fal.ai :

- `studio-blanc` → Style 1 (Amazon Pro Clean)
- `lifestyle-maison` → Style 2 (Lifestyle Modern)
- `minimal-gradient` → Style 3 (Shopify Hero Banner)
- `social-ads` → Style 4 (TikTok Viral)
- `luxury-black` → Style 6 (Luxury Black)
- `packshot-3d` → Style 8 (Mockup Packshot)
- `color-block` → Style 7 (White Gradient Drop)
- `mockup-scene` → Style 8 (Mockup Packshot)













