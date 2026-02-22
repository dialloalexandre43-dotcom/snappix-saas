# 🔧 Configuration pour le port 3001

## ✅ Ce qui a été modifié

Le projet est maintenant configuré pour utiliser le **port 3001** au lieu de 3000.

Cela permet d'éviter les conflits avec votre autre projet SaaS qui utilise le port 3000.

---

## 📋 Étapes à suivre

### Étape 1 : Mettre à jour Google OAuth

1. Allez sur https://console.cloud.google.com/
2. Ouvrez votre projet Google Cloud
3. **APIs & Services** > **Credentials**
4. Ouvrez votre OAuth Client ID
5. Dans **"Authorized redirect URIs"**, ajoutez :
   ```
   http://localhost:3001/api/auth/callback/google
   ```
6. Cliquez sur **"Save"**

**Note** : Vous pouvez garder `localhost:3000` aussi si vous voulez utiliser les deux projets.

---

### Étape 2 : Mettre à jour les variables d'environnement

Dans `saas/.env.local`, assurez-vous d'avoir :

```env
DATABASE_URL=postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
```

**Important** : `NEXTAUTH_URL` doit être `http://localhost:3001` (pas 3000)

---

### Étape 3 : Lancer le projet

```bash
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

Le serveur démarrera sur **http://localhost:3001**

---

### Étape 4 : Tester

1. Allez sur **http://localhost:3001/login**
2. Cliquez sur **"Continuer avec Google"**
3. Connectez-vous
4. Vous devriez être redirigé vers `/dashboard`

---

## 🔄 Résumé des changements

- **Port** : 3000 → 3001
- **URL locale** : `http://localhost:3001`
- **Google OAuth** : Ajoutez `http://localhost:3001/api/auth/callback/google`
- **NEXTAUTH_URL** : `http://localhost:3001`

---

## ✅ Avantages

- ✅ Pas de conflit avec votre autre projet (port 3000)
- ✅ Les deux projets peuvent tourner en même temps
- ✅ Configuration simple

---

**C'est tout ! Votre projet tourne maintenant sur le port 3001. 🚀**





















