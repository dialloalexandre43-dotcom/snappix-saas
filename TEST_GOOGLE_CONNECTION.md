# 🔐 Test de la connexion Google

## ✅ Étapes pour tester

### 1. Démarrer le serveur

**Important** : Le serveur doit être démarré avant de tester la connexion Google.

```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

Vous devriez voir :
```
▲ Next.js 14.x.x
- Local:        http://localhost:3001
- ready started server on 0.0.0.0:3001
```

### 2. Vérifier les variables d'environnement

Ouvrez `saas/.env.local` et vérifiez que vous avez :

```env
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
DATABASE_URL=votre-url-database
NEXTAUTH_SECRET=votre-secret
```

**Si les variables manquent** :
1. Créez ou modifiez `saas/.env.local`
2. Ajoutez les variables ci-dessus
3. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

### 3. Vérifier Google Cloud Console

Allez sur [Google Cloud Console](https://console.cloud.google.com/) :

1. **APIs & Services** > **Credentials**
2. Cliquez sur votre **OAuth 2.0 Client ID**
3. Vérifiez les **Authorized redirect URIs** :
   - ✅ `http://localhost:3001/api/auth/callback/google`
   - ❌ Pas `http://localhost:3000/...` (ancien port)

4. Si ce n'est pas configuré :
   - Cliquez sur **"EDIT"**
   - Ajoutez `http://localhost:3001/api/auth/callback/google` dans "Authorized redirect URIs"
   - Cliquez sur **"SAVE"**

### 4. Tester la connexion

1. **Ouvrez votre navigateur** et allez sur :
   ```
   http://localhost:3001/login
   ```

2. **Cliquez sur "Continuer avec Google"**

3. **Vous devriez être redirigé vers Google** pour vous connecter

4. **Après connexion**, vous devriez être redirigé vers `/dashboard`

## 🐛 Si ça ne fonctionne pas

### Erreur : "ERR_CONNECTION_REFUSED"

**Solution** : Le serveur n'est pas démarré
- Vérifiez que `npm run dev` tourne dans un terminal
- Vérifiez que le serveur est sur `http://localhost:3001`

### Erreur : "redirect_uri_mismatch"

**Solution** : L'URI de redirection ne correspond pas
- Vérifiez dans Google Cloud Console que l'URI est exactement :
  ```
  http://localhost:3001/api/auth/callback/google
  ```
- Le port doit être **3001**, pas 3000

### Erreur : "Invalid client"

**Solution** : Variables d'environnement incorrectes
- Vérifiez `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans `.env.local`
- Redémarrez le serveur après modification

### L'utilisateur n'est pas créé

**Solution** : Problème de base de données
- Vérifiez les logs du serveur pour voir les erreurs
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez que Prisma peut écrire dans la base de données

## 📋 Checklist rapide

- [ ] Serveur démarré (`npm run dev` dans le terminal)
- [ ] Serveur accessible sur `http://localhost:3001`
- [ ] Variables d'environnement dans `saas/.env.local`
- [ ] `GOOGLE_CLIENT_ID` configuré
- [ ] `GOOGLE_CLIENT_SECRET` configuré
- [ ] `NEXTAUTH_URL=http://localhost:3001`
- [ ] Redirect URI configuré dans Google Cloud Console
- [ ] Port 3001 (pas 3000) dans Google Cloud Console

---

**Testez maintenant et dites-moi ce qui se passe !** 🚀



















