# Paramètres de l'image Hero - Guide de modification

## Section du code à modifier

**Fichier :** `saas/components/hero-section.tsx`  
**Lignes :** 24-40

## Code complet de la section image

```tsx
{/* Hero background image - transparent overlay, positioned to the right of title */}
<div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
  <div className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%] flex items-center justify-end">
    <div className="relative w-full h-[70vh] md:h-[80vh] opacity-30 md:opacity-40">
      <div className="relative w-full h-full scale-125 md:scale-150 lg:scale-[1.75] origin-right">
        <Image
          src="/hero-background.png"
          alt="Laptop showing product visual generation"
          fill
          className="object-contain object-right-center"
          priority
          unoptimized
        />
      </div>
    </div>
  </div>
</div>
```

## Explication des paramètres

### 1. Position horizontale (ligne 26)
```tsx
className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%]"
```
- `right-0` : Aligne l'image à droite
- `w-full` : Largeur 100% sur mobile
- `md:w-[65%]` : Largeur 65% sur tablette
- `lg:w-[55%]` : Largeur 55% sur desktop
- `xl:w-[50%]` : Largeur 50% sur très grand écran

**Pour modifier :** Changez les pourcentages `[65%]`, `[55%]`, `[50%]` ou remplacez `right-0` par `left-0` pour aligner à gauche.

### 2. Position verticale (ligne 26)
```tsx
className="... top-0 bottom-0 ... flex items-center justify-end"
```
- `top-0 bottom-0` : Prend toute la hauteur
- `items-center` : Centre verticalement
- `justify-end` : Aligne à droite

**Pour modifier :** 
- `items-start` = en haut
- `items-center` = centré (actuel)
- `items-end` = en bas
- `top-1/4` = à 25% du haut
- `top-1/2 -translate-y-1/2` = centré verticalement

### 3. Hauteur de l'image (ligne 27)
```tsx
className="... h-[70vh] md:h-[80vh]"
```
- `h-[70vh]` : Hauteur 70% de la hauteur de l'écran sur mobile
- `md:h-[80vh]` : Hauteur 80% sur tablette et plus

**Pour modifier :** Changez `70vh` et `80vh` (ex: `50vh`, `90vh`, `100vh`)

### 4. Transparence (ligne 27)
```tsx
className="... opacity-30 md:opacity-40"
```
- `opacity-30` : 30% d'opacité sur mobile (70% transparent)
- `md:opacity-40` : 40% d'opacité sur desktop (60% transparent)

**Pour modifier :** 
- `opacity-10` = très transparent (10%)
- `opacity-50` = semi-transparent (50%)
- `opacity-100` = opaque (100%)

### 5. Zoom / Échelle (ligne 28)
```tsx
className="... scale-125 md:scale-150 lg:scale-[1.75]"
```
- `scale-125` : Zoom 125% sur mobile
- `md:scale-150` : Zoom 150% sur tablette
- `lg:scale-[1.75]` : Zoom 175% sur desktop

**Pour modifier :** 
- `scale-100` = taille normale (100%)
- `scale-110` = zoom 110%
- `scale-[2]` = zoom 200%
- `scale-75` = réduction 75%

### 6. Point d'origine du zoom (ligne 28)
```tsx
className="... origin-right"
```
- `origin-right` : Le zoom part de la droite

**Pour modifier :**
- `origin-left` = zoom depuis la gauche
- `origin-center` = zoom depuis le centre
- `origin-top-right` = zoom depuis le coin haut-droit

### 7. Positionnement de l'image dans son conteneur (ligne 33)
```tsx
className="object-contain object-right-center"
```
- `object-contain` : L'image garde ses proportions, s'adapte au conteneur
- `object-right-center` : Alignée à droite, centrée verticalement

**Pour modifier :**
- `object-cover` = remplit tout le conteneur (peut couper l'image)
- `object-fill` = étire l'image pour remplir
- `object-left-top` = en haut à gauche
- `object-center` = centré
- `object-right-bottom` = en bas à droite

## Exemples de modifications rapides

### Image plus grande et moins transparente
```tsx
<div className="relative w-full h-[80vh] md:h-[90vh] opacity-50 md:opacity-60">
  <div className="relative w-full h-full scale-150 md:scale-[2] lg:scale-[2.5] origin-right">
```

### Image plus petite et plus à gauche
```tsx
<div className="absolute right-0 top-0 bottom-0 w-full md:w-[50%] lg:w-[40%]">
  <div className="relative w-full h-[60vh] md:h-[70vh] opacity-20 md:opacity-30">
    <div className="relative w-full h-full scale-100 md:scale-125 lg:scale-150 origin-right">
```

### Image centrée verticalement
```tsx
<div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[65%]">
```
















