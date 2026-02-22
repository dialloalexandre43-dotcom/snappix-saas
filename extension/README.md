# Extension Chrome - SaaS Image Generator

Extension Chrome pour générer des visuels produits depuis Amazon et AliExpress.

## Installation

### Mode développement

1. Ouvrez Chrome et allez sur `chrome://extensions/`
2. Activez le "Mode développeur" (en haut à droite)
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `extension`

### Utilisation

1. Allez sur une page produit Amazon ou AliExpress
2. Cliquez sur l'icône de l'extension dans la barre d'outils
3. L'extension détecte automatiquement l'image principale du produit
4. Choisissez :
   - Un style de photoshoot
   - Un format d'image
   - L'URL de votre API (par défaut: http://localhost:3000)
   - Optionnellement un token API
5. Cliquez sur "Générer mes visuels"
6. Vous serez redirigé vers la page du job créé

## Configuration

### Authentification

L'extension supporte deux méthodes d'authentification :

1. **Session navigateur** : Si vous êtes connecté à votre SaaS dans le même navigateur, les cookies de session seront automatiquement envoyés
2. **Token API** : Entrez un token API dans le champ prévu (à implémenter côté backend si nécessaire)

### URL de l'API

Par défaut, l'URL est `http://localhost:3000`. Vous pouvez la modifier dans le popup. L'URL est sauvegardée localement.

## Structure

- `manifest.json` : Configuration de l'extension
- `popup.html/css/js` : Interface du popup
- `content.js` : Script injecté dans les pages (pour référence)
- `background.js` : Service worker en arrière-plan

## Développement

Pour tester les modifications :

1. Modifiez les fichiers
2. Allez sur `chrome://extensions/`
3. Cliquez sur l'icône de rechargement de l'extension

## Notes

- Les icônes sont manquantes pour l'instant (vous pouvez créer des placeholders)
- L'extension fonctionne uniquement sur les pages produits Amazon/AliExpress
- Pour la production, changez l'URL par défaut vers votre domaine Vercel






















