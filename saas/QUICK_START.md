# ⚡ Démarrage rapide

## 🚀 Lancer le SaaS en 3 commandes

```powershell
# 1. Aller dans le dossier saas
cd "C:\Users\aferr\Desktop\saas image\saas"

# 2. Installer les dépendances (première fois seulement)
npm install

# 3. Lancer le serveur
npm run dev
```

Le serveur sera accessible sur : **http://localhost:3001**

## 📝 Configuration minimale (.env.local)

Créez `saas/.env.local` avec au minimum :

```env
DATABASE_URL="votre_url_postgresql"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="générez-une-clé-secrète"
FAL_AI_API_KEY="votre-clé-fal-ai"
STRIPE_SECRET_KEY="sk_test_votre_clé"
STRIPE_PRICE_ID_STARTER="price_1T1qccI1dUWiif5H4Smh4p6c"
STRIPE_PRICE_ID_PRO="price_1T1qclI1dUWiif5H5kPrBTar"
```

## 🔧 Première installation complète

```powershell
# 1. Aller dans le dossier saas
cd "C:\Users\aferr\Desktop\saas image\saas"

# 2. Installer les dépendances
npm install

# 3. Générer Prisma Client
npx prisma generate

# 4. Synchroniser la base de données
npx prisma db push

# 5. Lancer le serveur
npm run dev
```

## 📚 Documentation complète

Voir `LAUNCH_COMPLETE.md` pour toutes les instructions détaillées.




