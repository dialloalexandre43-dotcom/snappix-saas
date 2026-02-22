# Fal.ai VisualDrop API - Styles Disponibles

## Structure de Réponse

L'API retourne toujours cette structure JSON :

```json
{
  "success": true,
  "generated_image": "https://fal.ai/output/abc123.jpg",
  "style_id": 1,
  "style_name": "Amazon Pro Clean", 
  "processing_time": 2.3,
  "credits_used": 1,
  "original_image": "https://input.jpg",
  "prompt_used": "Transform [PRODUCT_IMAGE] into..."
}
```

## Styles Disponibles (1-8)

### Style 1 - Amazon Pro Clean
- **ID**: `1`
- **Nom**: "Amazon Pro Clean"
- **Description**: Fond blanc studio professionnel, produit centré, éclairage doux, ombre portée subtile
- **Ratio recommandé**: 1:1
- **Usage**: E-commerce Amazon, produits standards

### Style 2 - Lifestyle Modern
- **ID**: `2`
- **Nom**: "Lifestyle Modern"
- **Description**: Scène lifestyle moderne, comptoir marbre, lumière naturelle, profondeur de champ cinématique
- **Ratio recommandé**: 16:9
- **Usage**: Marketing lifestyle, produits premium

### Style 3 - Shopify Hero Banner
- **ID**: `3`
- **Nom**: "Shopify Hero Banner"
- **Description**: Bannière hero Shopify, composition large, dégradé bleu clair vers blanc
- **Ratio recommandé**: 3:1
- **Usage**: Bannières hero Shopify, landing pages

### Style 4 - TikTok Viral
- **ID**: `4`
- **Nom**: "TikTok Viral"
- **Description**: Style TikTok tendance, fond dégradé néon (rose/violet), effets holographiques
- **Ratio recommandé**: 9:16
- **Usage**: Réseaux sociaux, TikTok, Instagram Stories

### Style 5 - Etsy Handmade
- **ID**: `5`
- **Nom**: "Etsy Handmade"
- **Description**: Style artisanal Etsy, table en bois rustique, lumière dorée, ambiance authentique
- **Ratio recommandé**: 1:1
- **Usage**: Produits artisanaux, Etsy, produits faits main

### Style 6 - Luxury Black
- **ID**: `6`
- **Nom**: "Luxury Black"
- **Description**: Studio noir mat, éclairage dramatique, style éditorial mode
- **Ratio recommandé**: 1:1
- **Usage**: Produits de luxe, mode, bijoux

### Style 7 - White Gradient Drop
- **ID**: `7`
- **Nom**: "White Gradient Drop"
- **Description**: Fond blanc avec dégradé et ombre portée professionnelle
- **Ratio recommandé**: 1:1
- **Usage**: eBay, Amazon, produits standards

### Style 8 - Mockup Packshot
- **ID**: `8`
- **Nom**: "Mockup Packshot"
- **Description**: Packshot produit, vue 3/4, fond transparent optionnel
- **Ratio recommandé**: 1:1
- **Usage**: Catalogues produits, présentations multiples

## Utilisation dans le Code

### Exemple 1 : Utiliser un style par ID
```typescript
import { generateImagesWithFalAI } from '@/lib/falai'

const result = await generateImagesWithFalAI({
  imageUrl: 'https://example.com/product.jpg',
  style: '1', // ou 'Amazon Pro Clean'
  ratio: '1:1',
  numImages: 3
})
```

### Exemple 2 : Utiliser un style par nom
```typescript
const result = await generateImagesWithFalAI({
  imageUrl: 'https://example.com/product.jpg',
  style: 'Lifestyle Modern', // Sera mappé automatiquement à l'ID 2
  ratio: '16:9',
  numImages: 3
})
```

### Exemple 3 : Lister tous les styles disponibles
```typescript
import { getAllStyles } from '@/lib/falai'

const styles = getAllStyles()
console.log(styles) // Array de { id, name, prompt }
```

## Mapping Automatique

Le système mappe automatiquement les noms de styles vers les IDs :

- "Amazon", "Pro Clean", "Fond blanc" → Style 1
- "Lifestyle", "Modern" → Style 2
- "Shopify", "Banner", "Hero" → Style 3
- "TikTok", "Viral", "Neon" → Style 4
- "Etsy", "Handmade", "Artisan" → Style 5
- "Luxury", "Black", "Dramatic" → Style 6
- "Gradient", "Drop", "Shadow" → Style 7
- "Mockup", "Packshot", "Catalog" → Style 8

Si aucun match n'est trouvé, le style 1 (Amazon Pro Clean) est utilisé par défaut.













