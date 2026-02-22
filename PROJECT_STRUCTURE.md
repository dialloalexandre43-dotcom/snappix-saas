# Structure complète du projet SaaS Image Generator

## 📱 Site Web (Next.js App Router)

### Pages principales

#### 1. **Landing Page** (`/`)
- **Fichier** : `saas/app/page.tsx`
- **Description** : Page d'accueil avec hero, features, et call-to-action
- **Accès** : Public (pas d'authentification requise)
- **Fonctionnalités** :
  - Présentation du service
  - Boutons de connexion/inscription
  - Section des fonctionnalités

#### 2. **Page de connexion** (`/login`)
- **Fichier** : `saas/app/login/page.tsx`
- **Description** : Formulaire de connexion utilisateur
- **Accès** : Public
- **Fonctionnalités** :
  - Connexion avec email/password
  - Redirection vers `/dashboard` après connexion
  - Lien vers la page d'inscription

#### 3. **Page d'inscription** (`/signup`)
- **Fichier** : `saas/app/signup/page.tsx`
- **Description** : Formulaire de création de compte
- **Accès** : Public
- **Fonctionnalités** :
  - Création de compte avec email/password
  - Validation des données
  - Redirection vers `/login` après inscription

#### 4. **Dashboard** (`/dashboard`)
- **Fichier** : `saas/app/dashboard/page.tsx`
- **Description** : Liste de tous les jobs de l'utilisateur
- **Accès** : Privé (authentification requise)
- **Fonctionnalités** :
  - Affichage de tous les jobs en grille
  - Cards avec aperçu des images générées
  - Badges de statut (PENDING, PROCESSING, DONE, ERROR)
  - Lien vers les détails de chaque job
  - État vide si aucun job

#### 5. **Page de détail d'un job** (`/job/[id]`)
- **Fichier** : `saas/app/job/[id]/page.tsx`
- **Description** : Détails complets d'un job avec images
- **Accès** : Privé (authentification requise)
- **Paramètres** : `id` (ID du job)
- **Fonctionnalités** :
  - Affichage de l'image source
  - Grille des images générées
  - Informations du job (style, ratio, date, statut)
  - Navigation retour au dashboard

### Pages de test (développement)

#### 6. **Test de connexion DB** (`/test-db`)
- **Fichier** : `saas/app/test-db/page.tsx`
- **Description** : Page de test pour vérifier la connexion à la base de données
- **Accès** : Public (peut être supprimée en production)

#### 7. **Test de création de job** (`/test-job`)
- **Fichier** : `saas/app/test-job/page.tsx`
- **Description** : Page de test pour créer un job manuellement
- **Accès** : Privé (authentification requise)
- **Note** : Utile pour tester sans l'extension Chrome

### API Routes

#### 8. **API Auth - NextAuth** (`/api/auth/[...nextauth]`)
- **Fichier** : `saas/app/api/auth/[...nextauth]/route.ts`
- **Description** : Handler NextAuth pour l'authentification
- **Méthodes** : GET, POST

#### 9. **API Signup** (`/api/auth/signup`)
- **Fichier** : `saas/app/api/auth/signup/route.ts`
- **Description** : Création de compte utilisateur
- **Méthode** : POST
- **Body** : `{ email: string, password: string }`

#### 10. **API Jobs** (`/api/jobs`)
- **Fichier** : `saas/app/api/jobs/route.ts`
- **Description** : Création d'un job de génération d'images
- **Méthode** : POST
- **Body** : `{ imageUrl: string, style: string, ratio: string }`
- **Authentification** : Requise (session NextAuth)
- **Réponse** : `{ jobId: string, message: string }`

#### 11. **API Test DB** (`/api/test-db`)
- **Fichier** : `saas/app/api/test-db/route.ts`
- **Description** : Test de connexion à la base de données
- **Méthode** : GET
- **Note** : Peut être supprimée en production

#### 12. **API Test Env** (`/api/test-env`)
- **Fichier** : `saas/app/api/test-env/route.ts`
- **Description** : Vérification des variables d'environnement
- **Méthode** : GET
- **Note** : Peut être supprimée en production

### Composants

#### 13. **LogoutButton**
- **Fichier** : `saas/components/LogoutButton.tsx`
- **Description** : Bouton de déconnexion réutilisable
- **Usage** : Utilisé dans le dashboard et la page de détail

### Fichiers de configuration

- **Layout principal** : `saas/app/layout.tsx`
- **Providers** : `saas/app/providers.tsx` (SessionProvider)
- **Styles globaux** : `saas/app/globals.css`
- **Configuration Prisma** : `saas/lib/prisma.ts`
- **Configuration Auth** : `saas/lib/auth.ts`
- **Types NextAuth** : `saas/types/next-auth.d.ts`

---

## 🔌 Extension Chrome

### Fichiers principaux

#### 1. **Manifest** (`manifest.json`)
- **Fichier** : `extension/manifest.json`
- **Description** : Configuration de l'extension
- **Version** : Manifest V3
- **Permissions** : activeTab, storage, scripting
- **Host permissions** : Amazon, AliExpress, localhost

#### 2. **Popup HTML** (`popup.html`)
- **Fichier** : `extension/popup.html`
- **Description** : Interface utilisateur du popup
- **Contenu** :
  - Header avec titre
  - Aperçu de l'image détectée
  - Formulaire de sélection (style, ratio)
  - Champs API (URL, token optionnel)
  - Bouton de génération
  - États de chargement et succès

#### 3. **Popup CSS** (`popup.css`)
- **Fichier** : `extension/popup.css`
- **Description** : Styles du popup
- **Caractéristiques** :
  - Design moderne avec gradients
  - Animations et transitions
  - Responsive

#### 4. **Popup JavaScript** (`popup.js`)
- **Fichier** : `extension/popup.js`
- **Description** : Logique du popup
- **Fonctionnalités** :
  - Détection de l'image produit
  - Extraction depuis Amazon/AliExpress
  - Envoi des données à l'API
  - Gestion des erreurs
  - Redirection vers le job créé

#### 5. **Content Script** (`content.js`)
- **Fichier** : `extension/content.js`
- **Description** : Script injecté dans les pages Amazon/AliExpress
- **Note** : Actuellement utilisé via `chrome.scripting.executeScript` dans popup.js

#### 6. **Background Service Worker** (`background.js`)
- **Fichier** : `extension/background.js`
- **Description** : Service worker en arrière-plan
- **Fonctionnalités** : Gestion des messages (pour extensions futures)

### Documentation

#### 7. **README Extension** (`README.md`)
- **Fichier** : `extension/README.md`
- **Description** : Documentation de l'extension

#### 8. **Guide Icônes** (`ICONS.md`)
- **Fichier** : `extension/ICONS.md`
- **Description** : Instructions pour créer les icônes

---

## 📊 Résumé

### Site Web
- **Pages publiques** : 3 (/, /login, /signup)
- **Pages privées** : 2 (/dashboard, /job/[id])
- **Pages de test** : 2 (/test-db, /test-job)
- **API Routes** : 5
- **Composants** : 1 (LogoutButton)
- **Total pages accessibles** : 7

### Extension Chrome
- **Fichiers principaux** : 5 (manifest, popup HTML/CSS/JS, content, background)
- **Fichiers de documentation** : 2
- **Total fichiers extension** : 7

### Base de données
- **Modèles** : 3 (User, Job, GeneratedImage)
- **Enum** : 1 (JobStatus)

---

## 🗂️ Structure des dossiers

```
saas image/
├── saas/                          # Application Next.js
│   ├── app/
│   │   ├── api/                   # Routes API
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── jobs/route.ts
│   │   │   ├── test-db/route.ts
│   │   │   └── test-env/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── job/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── test-db/page.tsx
│   │   ├── test-job/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing page
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── LogoutButton.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── prisma.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── init.sql
│   ├── types/
│   │   └── next-auth.d.ts
│   └── ... (config files)
│
└── extension/                      # Extension Chrome
    ├── manifest.json
    ├── popup.html
    ├── popup.css
    ├── popup.js
    ├── content.js
    ├── background.js
    ├── README.md
    └── ICONS.md
```

---

## ✅ Checklist pour le déploiement

### Site Web
- [ ] Toutes les pages fonctionnent
- [ ] Authentification opérationnelle
- [ ] API endpoints testés
- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] Build Next.js réussi

### Extension Chrome
- [ ] Manifest.json valide
- [ ] Popup fonctionne
- [ ] Détection d'image opérationnelle
- [ ] Communication avec l'API fonctionne
- [ ] Icônes créées (optionnel)
- [ ] URL de production configurée dans le popup

---

**Dernière mise à jour** : Après améliorations esthétiques complètes






















