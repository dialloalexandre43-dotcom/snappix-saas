# 🚀 Guide Complet - Déploiement Vercel "snappix-saas"

## ✅ Prérequis vérifiés
- ✅ Code poussé sur GitHub
- ✅ Corrections TypeScript appliquées
- ✅ Tous les projets Vercel supprimés
- ✅ Fichier `.vercel` supprimé

---

## 📋 ÉTAPE 1 : Créer le projet sur Vercel

### 1.1 Aller sur Vercel
1. Ouvrez https://vercel.com/new
2. Connectez-vous avec votre compte GitHub si nécessaire

### 1.2 Importer le repository
1. Cliquez sur **"Import Git Repository"**
2. Sélectionnez votre repository : `snappix-saas` (ou le nom exact de votre repo GitHub)
3. Cliquez sur **"Import"**

### 1.3 Configurer le projet

**⚠️ CONFIGURATION CRITIQUE - Ne pas oublier !**

Dans la page de configuration :

- **Project Name** : `snappix-saas`
- **Framework Preset** : `Next.js` (détecté automatiquement)
- **Root Directory** : `saas` ⚠️ **CHANGEZ de `.` à `saas`**
- **Build Command** : Laissez vide (Vercel le détectera automatiquement)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

**⚠️ NE CLIQUEZ PAS SUR "Deploy" ENCORE !**

---

## 🔐 ÉTAPE 2 : Ajouter les variables d'environnement

**AVANT de déployer**, vous DEVEZ ajouter toutes les variables d'environnement.

### 2.1 Ouvrir les variables d'environnement
1. Dans la page de configuration, cliquez sur **"Environment Variables"** (ou "Variables d'environnement")
2. Vous verrez une liste vide

### 2.2 Ajouter chaque variable

Pour chaque variable ci-dessous :
1. Cliquez sur **"Add"** ou **"Ajouter"**
2. Entrez le **Name** (nom de la variable)
3. Entrez la **Value** (valeur)
4. Cochez **"Production"** dans les environnements
5. Cliquez sur **"Save"**

### Liste complète des variables :

#### 1. Database
```
Name: DATABASE_URL
Value: postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
Environments: ✅ Production
```

#### 2. NextAuth - URL (à mettre à jour après le premier déploiement)
```
Name: NEXTAUTH_URL
Value: https://snappix-saas.vercel.app
Environments: ✅ Production
```
⚠️ **Note** : Après le premier déploiement, vous devrez mettre à jour cette valeur avec l'URL réelle que Vercel vous donnera.

#### 3. NextAuth - Secret
```
Name: NEXTAUTH_SECRET
Value: y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
Environments: ✅ Production
```

#### 4. Fal.ai API Key
```
Name: FAL_AI_API_KEY
Value: [Votre clé Fal.ai - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

#### 5. Stripe - Secret Key (TEST)
```
Name: STRIPE_SECRET_KEY
Value: [Votre clé Stripe Test - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

#### 6. Stripe - Price ID Starter
```
Name: STRIPE_PRICE_ID_STARTER
Value: [Votre Price ID Starter - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

#### 7. Stripe - Price ID Pro
```
Name: STRIPE_PRICE_ID_PRO
Value: price_1T1pKwEsWYYtIPnHdyHdpL2F
Environments: ✅ Production
```

#### 8. Stripe - Webhook Secret
```
Name: STRIPE_WEBHOOK_SECRET
Value: [Votre Webhook Secret - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

#### 9. Google OAuth - Client ID
```
Name: GOOGLE_CLIENT_ID
Value: [Votre Google Client ID - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

#### 10. Google OAuth - Client Secret
```
Name: GOOGLE_CLIENT_SECRET
Value: [Votre Google Client Secret - à récupérer depuis votre fichier .env.local]
Environments: ✅ Production
```

### 2.3 Vérifier les variables
- ✅ Vous devriez avoir **10 variables** au total
- ✅ Toutes doivent avoir **"Production"** coché

---

## 🚀 ÉTAPE 3 : Déployer

1. Une fois toutes les variables ajoutées, cliquez sur **"Deploy"**
2. Attendez 2-5 minutes pour le build
3. Vercel va :
   - Installer les dépendances
   - Générer Prisma Client
   - Compiler Next.js
   - Déployer le site

### 3.1 Pendant le build
- Vous verrez les logs en temps réel
- Ne fermez pas la page
- Si erreur, les logs vous indiqueront le problème

---

## ✅ ÉTAPE 4 : Après le déploiement

### 4.1 Récupérer l'URL de production
1. Une fois le build terminé, Vercel vous donnera une URL
2. Exemple : `https://snappix-saas-xxx.vercel.app`
3. Notez cette URL

### 4.2 Mettre à jour NEXTAUTH_URL
1. Allez dans Vercel Dashboard → Projet "snappix-saas" → Settings → Environment Variables
2. Trouvez la variable `NEXTAUTH_URL`
3. Cliquez sur **"Edit"**
4. Remplacez la valeur par votre URL Vercel réelle (ex: `https://snappix-saas-xxx.vercel.app`)
5. Cliquez sur **"Save"**
6. Vercel redéploiera automatiquement

### 4.3 Vérifier que le site fonctionne
1. Visitez votre URL Vercel
2. Testez :
   - ✅ La page d'accueil se charge
   - ✅ La connexion/inscription fonctionne
   - ✅ Le dashboard est accessible

---

## 🔄 ÉTAPE 5 : Déploiements futurs

**IMPORTANT** : Ne plus utiliser `vercel --prod` en CLI !

**Pour déployer à l'avenir :**
1. Faites vos modifications de code
2. Committez : `git add .` puis `git commit -m "Description"`
3. Poussez : `git push origin main`
4. Vercel déploiera automatiquement le projet "snappix-saas"

---

## 🆘 En cas d'erreur

### Erreur de build TypeScript
- Vérifiez les logs Vercel
- Les erreurs TypeScript sont listées avec le fichier et la ligne
- Partagez l'erreur exacte pour correction

### Erreur "Root Directory not found"
- Vérifiez que le Root Directory est bien `saas` (pas `.`)
- Vérifiez que le dossier `saas` existe dans votre repo GitHub

### Erreur "Environment variable not found"
- Vérifiez que toutes les variables sont ajoutées
- Vérifiez que "Production" est coché pour chaque variable

### Site ne charge pas
- Vérifiez les logs Vercel (onglet "Functions" ou "Logs")
- Vérifiez que `NEXTAUTH_URL` est correct
- Vérifiez la connexion à la base de données

---

## 📋 Checklist finale

- [ ] Projet "snappix-saas" créé sur Vercel
- [ ] Root Directory configuré à `saas`
- [ ] 10 variables d'environnement ajoutées
- [ ] Build réussi (statut "Ready")
- [ ] URL de production récupérée
- [ ] NEXTAUTH_URL mis à jour avec l'URL réelle
- [ ] Site accessible et fonctionnel
- [ ] Test de connexion réussi

---

## 🎉 C'est prêt !

Une fois toutes ces étapes complétées, votre projet "snappix-saas" sera déployé et fonctionnel sur Vercel !

**Pour les prochains déploiements** : Utilisez simplement `git push origin main` et Vercel déploiera automatiquement.

---

**Besoin d'aide ?** Partagez l'erreur exacte et je vous aiderai à la résoudre.

