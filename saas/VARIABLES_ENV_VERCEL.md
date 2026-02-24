# 📋 Variables d'environnement pour Vercel

## Instructions
Copiez ces valeurs depuis votre fichier `saas/.env.local` et ajoutez-les dans Vercel Dashboard.

---

## Variables à ajouter dans Vercel

### 1. DATABASE_URL
```
postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 2. NEXTAUTH_URL
```
https://snappix-saas.vercel.app
```
⚠️ **À mettre à jour après le premier déploiement** avec l'URL réelle que Vercel vous donnera.

### 3. NEXTAUTH_SECRET
```
y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
```

### 4. FAL_AI_API_KEY
```
[Copiez depuis votre .env.local]
```

### 5. STRIPE_SECRET_KEY
```
[Copiez depuis votre .env.local - commence par sk_test_]
```

### 6. STRIPE_PRICE_ID_STARTER
```
[Copiez depuis votre .env.local - commence par price_]
```

### 7. STRIPE_PRICE_ID_PRO
```
price_1T1pKwEsWYYtIPnHdyHdpL2F
```

### 8. STRIPE_WEBHOOK_SECRET
```
[Copiez depuis votre .env.local - commence par whsec_]
```

### 9. GOOGLE_CLIENT_ID
```
[Copiez depuis votre .env.local]
```

### 10. GOOGLE_CLIENT_SECRET
```
[Copiez depuis votre .env.local]
```

---

## Comment les ajouter dans Vercel

1. Allez dans Vercel Dashboard → Projet "snappix-saas" → Settings → Environment Variables
2. Pour chaque variable :
   - Cliquez sur "Add"
   - Entrez le **Name** (ex: `DATABASE_URL`)
   - Entrez la **Value** (copiez depuis ci-dessus)
   - Cochez **"Production"**
   - Cliquez sur "Save"

---

## Vérification

Vous devriez avoir **10 variables** au total dans Vercel.

