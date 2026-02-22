# Modèles Fal.ai pour Image-to-Image

## Problème actuel

Le modèle "nanano banana" génère des objets complètement différents au lieu de transformer l'image source. Cela suggère que ce modèle ne supporte pas correctement l'image-to-image.

## Modèles recommandés pour Image-to-Image

### Option 1 : Flux Pro (Recommandé)
```env
FAL_AI_MODEL_ID=fal-ai/flux-pro
```
- Meilleur support pour l'image-to-image
- Qualité supérieure
- Paramètres : `image_url`, `prompt`, `aspect_ratio`

### Option 2 : Flux Dev
```env
FAL_AI_MODEL_ID=fal-ai/flux-dev
```
- Version développement avec meilleures fonctionnalités
- Support image-to-image amélioré

### Option 3 : Stable Diffusion (si disponible)
```env
FAL_AI_MODEL_ID=fal-ai/stable-diffusion-xl
```
- Excellent pour l'image-to-image
- Paramètres : `image_url`, `prompt`, `strength`, `guidance_scale`

### Option 4 : Vérifier la documentation Fal.ai
Consultez https://fal.ai/models pour trouver :
- Les modèles qui supportent explicitement l'image-to-image
- Les paramètres exacts à utiliser
- Les exemples de requêtes

## Comment changer de modèle

1. Ouvrez votre fichier `.env` dans le dossier `saas`
2. Modifiez la ligne :
   ```env
   FAL_AI_MODEL_ID=fal-ai/flux-pro
   ```
3. Redémarrez le serveur

## Paramètres à tester selon le modèle

### Pour Flux Pro/Dev
```json
{
  "prompt": "...",
  "image_url": "https://...",
  "aspect_ratio": "1:1"
}
```

### Pour Stable Diffusion
```json
{
  "prompt": "...",
  "image_url": "https://...",
  "strength": 0.35,
  "guidance_scale": 5.0,
  "aspect_ratio": "1:1"
}
```

## Test recommandé

1. Changez vers `fal-ai/flux-pro` dans votre `.env`
2. Redémarrez le serveur
3. Testez avec une image simple (haltères)
4. Vérifiez les logs pour voir si `image_url` est bien utilisé
5. Si ça ne fonctionne toujours pas, essayez un autre modèle












