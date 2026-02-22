# 🌐 Configuration du nom de domaine - Guide

## 📋 Quand vous aurez votre domaine

### Étapes après l'achat du domaine

#### 1. Connecter le domaine à Vercel

1. Allez sur votre projet Vercel
2. **Settings** → **Domains**
3. Ajoutez votre domaine
4. Suivez les instructions pour configurer les DNS

#### 2. Mettre à jour Google OAuth

1. Allez sur Google Cloud Console
2. **APIs & Services** → **Credentials**
3. Ouvrez votre OAuth Client ID
4. Ajoutez dans **Authorized redirect URIs** :
   ```
   https://votre-domaine.com/api/auth/callback/google
   ```
5. Sauvegardez

#### 3. Configurer Apple OAuth

1. Allez sur Apple Developer Portal
2. Ouvrez votre Service ID
3. Configurez **Sign In with Apple**
4. Ajoutez dans **Return URLs** :
   ```
   https://votre-domaine.com/api/auth/callback/apple
   ```
5. Générez le JWT avec votre domaine
6. Mettez à jour les variables d'environnement

#### 4. Mettre à jour les variables d'environnement

Dans Vercel, mettez à jour :
```
NEXTAUTH_URL=https://votre-domaine.com
```

#### 5. Mettre à jour l'extension Chrome

Dans `extension/popup.html`, changez l'URL par défaut :
```html
<input 
  type="text" 
  id="api-url" 
  value="https://votre-domaine.com"
  ...
>
```

---

## 📝 Checklist après achat du domaine

- [ ] Domaine connecté à Vercel
- [ ] DNS configurés
- [ ] Google OAuth mis à jour avec le nouveau domaine
- [ ] Apple OAuth configuré (si applicable)
- [ ] Variables d'environnement mises à jour
- [ ] Extension Chrome mise à jour
- [ ] Test en production réussi

---

**Note** : Ce guide sera utile quand vous aurez votre domaine ! 🌐




















