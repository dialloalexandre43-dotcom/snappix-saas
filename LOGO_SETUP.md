# 🎨 Configuration du logo Snappix

## 📋 Instructions

### 1. Ajouter le logo

Placez votre fichier logo dans le dossier `saas/public/` avec le nom `logo.png`.

**Format recommandé :**
- Format : PNG avec transparence
- Taille : 256x256px minimum (ou plus grand, sera redimensionné automatiquement)
- Fond : Transparent ou noir selon votre logo

### 2. Structure du logo

Le logo doit être l'image des deux losanges orange superposés sur fond noir que vous avez fournie.

### 3. Fallback automatique

Si le logo n'est pas trouvé, un fallback avec la lettre "S" sur fond orange dégradé s'affichera automatiquement.

## 📁 Fichiers mis à jour

Tous les fichiers suivants ont été mis à jour pour utiliser "Snappix" :

- ✅ `app/layout.tsx` - Métadonnées
- ✅ `components/header.tsx` - Header principal
- ✅ `components/app-header.tsx` - Header des pages app
- ✅ `components/footer.tsx` - Footer
- ✅ `app/login/page.tsx` - Page de connexion
- ✅ `app/signup/page.tsx` - Page d'inscription
- ✅ `components/cta-section.tsx` - Section CTA

## 🎯 Utilisation du composant Logo

Un composant `Logo` réutilisable a été créé dans `components/logo.tsx` :

```tsx
import { Logo } from '@/components/logo'

// Utilisation basique
<Logo />

// Avec options
<Logo size="lg" showText={true} href="/" />
```

**Tailles disponibles :**
- `sm` : 24px (6 en Tailwind)
- `md` : 28px (7 en Tailwind) - par défaut
- `lg` : 40px (10 en Tailwind)

## ✅ Checklist

- [ ] Logo ajouté dans `saas/public/logo.png`
- [ ] Logo visible sur toutes les pages
- [ ] Fallback fonctionne si logo manquant
- [ ] Tous les textes "Pixely" remplacés par "Snappix"

---

**Note** : Le logo sera automatiquement redimensionné selon le contexte (header, footer, etc.)




















