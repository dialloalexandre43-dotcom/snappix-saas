# 🚀 Déploiement Vercel - Guide Rapide

## ✅ Prérequis

- [x] Code prêt et fonctionnel
- [ ] Compte Vercel (gratuit) : https://vercel.com/signup
- [ ] Compte GitHub (gratuit) : https://github.com/signup
- [ ] Variables d'environnement préparées

---

## 📦 ÉTAPE 1 : Initialiser Git et pousser sur GitHub

### 1.1 Initialiser Git (si pas déjà fait)
```powershell
cd "C:\Users\aferr\Desktop\saas image"
git init
```

### 1.2 Créer un fichier .gitignore (vérifier qu'il existe)
Le fichier `.gitignore` doit exclure :
- `.env.local`
- `node_modules/`
- `.next/`

### 1.3 Créer un repository GitHub
1. Allez sur https://github.com/new
2. Créez un nouveau repository (ex: `snappix-saas`)
3. **Ne cochez PAS** "Initialize with README"
4. Copiez l'URL du repository (ex: `https://github.com/votre-username/snappix-saas.git`)

### 1.4 Pousser le code
```powershell
cd "C:\Users\aferr\Desktop\saas image"
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
git push -u origin main
```

---

## 🌐 ÉTAPE 2 : Déployer sur Vercel

### 2.1 Créer un compte Vercel
1. Allez sur https://vercel.com/signup
2. Connectez-vous avec GitHub (recommandé)

### 2.2 Importer le projet
1. Allez sur https://vercel.com/new
2. Cliquez sur "Import Git Repository"
3. Sélectionnez votre repository GitHub
4. Cliquez sur "Import"

### 2.3 Configurer le projet

**IMPORTANT - Configuration :**
- **Framework Preset** : Next.js (détecté automatiquement)
- **Root Directory** : `saas` ⚠️ **CRITIQUE** - Changez de `.` à `saas`
- **Build Command** : `npm run build` (ou laissez vide)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install`

### 2.4 Ajouter les variables d'environnement

**AVANT de cliquer sur "Deploy", ajoutez les variables :**

Cliquez sur "Environment Variables" et ajoutez :

```env
# Database
DATABASE_URL=postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# NextAuth
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=

# Fal.ai
FAL_AI_API_KEY=votre-clé-fal-ai

# Stripe (TEST pour commencer, puis PRODUCTION)
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PRICE_ID_STARTER=price_YOUR_STARTER_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

**Important :**
- Sélectionnez "Production" pour toutes les variables
- Après le premier déploiement, mettez à jour `NEXTAUTH_URL` avec votre URL Vercel

### 2.5 Déployer
1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-5 minutes)
3. Votre site sera accessible sur `https://votre-projet.vercel.app`

---

## 🔧 ÉTAPE 3 : Après le déploiement

### 3.1 Mettre à jour NEXTAUTH_URL
1. Allez dans Vercel Dashboard > Settings > Environment Variables
2. Modifiez `NEXTAUTH_URL` avec votre URL Vercel
3. Redéployez (ou attendez le prochain déploiement)

### 3.2 Configurer votre domaine personnalisé (si vous en avez un)
1. Allez dans Vercel Dashboard > Settings > Domains
2. Ajoutez votre domaine
3. Suivez les instructions DNS

### 3.3 Tester
1. Visitez votre URL Vercel
2. Testez la connexion/inscription
3. Testez le dashboard
4. Testez la génération d'images

---

## ⚠️ Points importants

### Root Directory
**CRITIQUE** : Le Root Directory doit être `saas` et non `.` (racine)
- Sinon Vercel ne trouvera pas le `package.json`

### Variables d'environnement
- Ne jamais commiter `.env.local` sur GitHub
- Toutes les variables doivent être ajoutées dans Vercel Dashboard

### Build
- Le build peut prendre 2-5 minutes
- Vérifiez les logs si le build échoue

---

## 🆘 En cas d'erreur

### Build échoue
1. Vérifiez les logs dans Vercel Dashboard
2. Vérifiez que le Root Directory est `saas`
3. Vérifiez que toutes les variables d'environnement sont définies

### Site ne charge pas
1. Vérifiez les logs Vercel
2. Vérifiez que `NEXTAUTH_URL` est correct
3. Vérifiez la connexion à la base de données

---

## ✅ Checklist finale

- [ ] Git initialisé
- [ ] Code poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé depuis GitHub
- [ ] Root Directory configuré à `saas`
- [ ] Variables d'environnement ajoutées
- [ ] Build réussi
- [ ] Site accessible
- [ ] NEXTAUTH_URL mis à jour avec l'URL Vercel

---

**Prêt à déployer ? Suivez les étapes ci-dessus ! 🚀**

