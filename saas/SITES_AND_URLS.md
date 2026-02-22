# 🌐 Sites et URLs pour Setup, Extension et Publication

## 📋 SETUP & CONFIGURATION

### Base de données
- **Supabase** : https://supabase.com
  - Créer un projet PostgreSQL gratuit
  - Récupérer l'URL de connexion `DATABASE_URL`
  
- **Neon** (alternative) : https://neon.tech
  - Base de données PostgreSQL serverless
  
- **Railway** (alternative) : https://railway.app
  - Base de données PostgreSQL

### Paiements (Stripe)
- **Stripe Dashboard** : https://dashboard.stripe.com
  - Mode TEST : https://dashboard.stripe.com/test
  - Mode PRODUCTION : https://dashboard.stripe.com (sans /test)
  - Créer les produits et récupérer les Price IDs
  - Configurer les webhooks : https://dashboard.stripe.com/webhooks
  - Customer Portal : https://dashboard.stripe.com/settings/billing/portal

### Génération d'images (Fal.ai)
- **Fal.ai Dashboard** : https://fal.ai
  - Créer un compte
  - Récupérer la clé API `FAL_AI_API_KEY`

### Code & Versioning
- **GitHub** : https://github.com
  - Créer un repository
  - Pousser le code pour le déploiement

---

## 🔌 EXTENSION CHROME

### Développement local
- **Chrome Extensions Page** : `chrome://extensions/`
  - Activer le mode développeur
  - Charger l'extension non empaquetée

### Publication
- **Chrome Web Store Developer Console** : https://chrome.google.com/webstore/devconsole
  - Créer un compte développeur (5$ USD, paiement unique)
  - Soumettre l'extension pour révision
  - Gérer les mises à jour

- **Chrome Web Store** : https://chrome.google.com/webstore
  - Page publique où les utilisateurs installent l'extension

### Documentation
- **Chrome Extensions Docs** : https://developer.chrome.com/docs/extensions/
- **Publishing Guide** : https://developer.chrome.com/docs/webstore/publish/

---

## 🚀 PUBLICATION & DÉPLOIEMENT

### Hébergement SaaS (Vercel)
- **Vercel Dashboard** : https://vercel.com
  - Créer un compte (gratuit)
  - Importer le projet depuis GitHub
  - Configurer les variables d'environnement
  - Ajouter votre domaine personnalisé
  - Dashboard : https://vercel.com/dashboard

### Domaines & DNS
- **Votre registrar DNS** (où vous avez acheté le domaine)
  - Configurer les enregistrements DNS fournis par Vercel
  - Type A : IP Vercel
  - Type CNAME : pour www

---

## 📝 RÉCAPITULATIF DES URLS PRINCIPALES

### Setup
1. **GitHub** : https://github.com
2. **Supabase** : https://supabase.com
3. **Stripe Dashboard** : https://dashboard.stripe.com
4. **Fal.ai** : https://fal.ai

### Extension
1. **Chrome Extensions (local)** : `chrome://extensions/`
2. **Chrome Web Store Dev Console** : https://chrome.google.com/webstore/devconsole
3. **Chrome Web Store (public)** : https://chrome.google.com/webstore

### Publication
1. **Vercel** : https://vercel.com
2. **Vercel Dashboard** : https://vercel.com/dashboard
3. **Votre domaine** : `https://votre-domaine.com` (après configuration)

---

## 🔗 URLs IMPORTANTES POUR LA CONFIGURATION

### Stripe
- **Dashboard TEST** : https://dashboard.stripe.com/test/products
- **Dashboard PRODUCTION** : https://dashboard.stripe.com/products
- **Webhooks TEST** : https://dashboard.stripe.com/test/webhooks
- **Webhooks PRODUCTION** : https://dashboard.stripe.com/webhooks
- **Customer Portal** : https://dashboard.stripe.com/settings/billing/portal

### Vercel
- **Nouveau projet** : https://vercel.com/new
- **Dashboard** : https://vercel.com/dashboard
- **Documentation** : https://vercel.com/docs

### Chrome Web Store
- **Developer Console** : https://chrome.google.com/webstore/devconsole
- **Documentation** : https://developer.chrome.com/docs/webstore/

---

## ✅ CHECKLIST RAPIDE

### Setup
- [ ] Compte GitHub créé
- [ ] Base de données Supabase/Neon créée
- [ ] Compte Stripe créé (TEST et PRODUCTION)
- [ ] Compte Fal.ai créé
- [ ] Variables d'environnement configurées

### Extension
- [ ] Extension testée localement (`chrome://extensions/`)
- [ ] Compte développeur Chrome créé (5$ payés)
- [ ] Extension soumise sur Chrome Web Store
- [ ] Extension approuvée et publiée

### Publication
- [ ] Code poussé sur GitHub
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Domaine configuré dans Vercel
- [ ] DNS configuré chez votre registrar
- [ ] Site accessible sur votre domaine

