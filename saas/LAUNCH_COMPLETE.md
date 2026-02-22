# 🚀 Guide complet pour lancer le SaaS

## 📋 Prérequis

- Node.js installé (version 18 ou supérieure)
- npm installé
- Base de données PostgreSQL configurée (Supabase, Neon, etc.)

## 🔧 Étape 1 : Configuration de l'environnement

### Créer le fichier `.env.local`

Créez un fichier `.env.local` dans le dossier `saas` avec le contenu suivant :

```env
# Database
DATABASE_URL="votre_url_postgresql_ici"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre-clé-secrète-générée"

# Fal.ai API (pour la génération d'images)
FAL_AI_API_KEY="votre-clé-api-fal-ai"
FAL_AI_MODEL_ID="fal-ai/flux"

# Stripe (pour les abonnements)
STRIPE_SECRET_KEY="sk_test_votre_clé_secrète_stripe"
STRIPE_PUBLISHABLE_KEY="pk_test_votre_clé_publique_stripe"
STRIPE_PRICE_ID_STARTER="price_1T1qccI1dUWiif5H4Smh4p6c"
STRIPE_PRICE_ID_PRO="price_1T1qclI1dUWiif5H5kPrBTar"
STRIPE_WEBHOOK_SECRET="whsec_votre_secret_webhook"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre_google_client_id"
GOOGLE_CLIENT_SECRET="votre_google_client_secret"
```

### Générer NEXTAUTH_SECRET

**Sur Windows (PowerShell) :**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Sur Mac/Linux :**
```bash
openssl rand -base64 32
```

## 📦 Étape 2 : Installation des dépendances

Ouvrez un terminal PowerShell dans le dossier du projet et exécutez :

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm install
```

## 🗄️ Étape 3 : Configuration de la base de données

### Générer le client Prisma

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npx prisma generate
```

### Synchroniser le schéma avec la base de données

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npx prisma db push
```

## 🚀 Étape 4 : Lancer le serveur de développement

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

Le serveur sera accessible sur : **http://localhost:3001**

## ✅ Vérification

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3001**
3. Vous devriez voir la page d'accueil du SaaS

## 📝 Commandes utiles

### Lancer le serveur
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

### Voir la base de données (Prisma Studio)
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run db:studio
```

### Reconstruire le projet
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run build
```

### Lancer en mode production
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run build
npm run start
```

## 🔍 Dépannage

### Erreur : "Cannot find module"
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm install
```

### Erreur : "Prisma Client not generated"
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npx prisma generate
```

### Erreur : "Database connection failed"
- Vérifiez que `DATABASE_URL` dans `.env.local` est correct
- Vérifiez que votre base de données PostgreSQL est accessible

### Le serveur ne démarre pas
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Vérifiez les logs dans le terminal pour les erreurs

## 📋 Checklist de lancement

- [ ] Fichier `.env.local` créé avec toutes les variables
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] `DATABASE_URL` configuré
- [ ] `FAL_AI_API_KEY` configuré
- [ ] `STRIPE_SECRET_KEY` et autres clés Stripe configurées
- [ ] `npm install` exécuté avec succès
- [ ] `npx prisma generate` exécuté avec succès
- [ ] `npx prisma db push` exécuté avec succès
- [ ] `npm run dev` lancé
- [ ] Serveur accessible sur http://localhost:3001

## 🎯 Prochaines étapes

Une fois le serveur lancé :

1. **Tester l'authentification** : Créez un compte ou connectez-vous
2. **Tester le dashboard** : Allez sur `/dashboard`
3. **Tester les abonnements** : Allez sur `/billing`
4. **Charger l'extension Chrome** : Suivez le guide dans `TEST_FREE_PLAN.md`




