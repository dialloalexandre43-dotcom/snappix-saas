# 🔧 Solutions alternatives pour la connexion Google

## 🎯 Solution 1 : Tester d'abord avec email/password

Avant de configurer Google, testons que l'authentification de base fonctionne :

### Étape 1 : Créer un compte avec email/password

1. Allez sur `http://localhost:3001/signup`
2. Créez un compte avec email et mot de passe
3. Connectez-vous avec ces identifiants
4. Vérifiez que vous arrivez sur `/dashboard`

**Si ça fonctionne** : Le problème vient de la configuration Google OAuth
**Si ça ne fonctionne pas** : Le problème est plus général (serveur, base de données, etc.)

## 🎯 Solution 2 : Vérifier les logs du serveur

Le serveur affiche des erreurs détaillées dans la console :

1. **Regardez le terminal** où tourne `npm run dev`
2. **Cherchez les erreurs** qui commencent par :
   - `Error:`
   - `[NextAuth]`
   - `GoogleProvider`
3. **Partagez ces erreurs** pour que je puisse vous aider

## 🎯 Solution 3 : Désactiver temporairement Google OAuth

Pour isoler le problème, on peut désactiver Google OAuth temporairement :

### Modifier `saas/lib/auth.ts`

Commentez temporairement le GoogleProvider :

```typescript
providers: [
  // GoogleProvider({
  //   clientId: process.env.GOOGLE_CLIENT_ID!,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  // }),
  CredentialsProvider({
    // ...
  }),
],
```

**Testez** : Si l'authentification email/password fonctionne, le problème vient de Google OAuth.

## 🎯 Solution 4 : Vérifier les variables d'environnement

### Créer un script de test

Créez `saas/app/api/test-google-env/route.ts` :

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    // Ne pas exposer les secrets complets
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
  })
}
```

**Testez** : Allez sur `http://localhost:3001/api/test-google-env`
**Vérifiez** : Toutes les valeurs doivent être `true` (sauf les secrets)

## 🎯 Solution 5 : Vérifier la configuration Google Cloud Console

### Checklist complète

1. **Projet Google Cloud créé** ✅
2. **API Google+ activée** ✅
3. **OAuth consent screen configuré** ✅
4. **OAuth Client ID créé** ✅
5. **Authorized JavaScript origins** :
   - ✅ `http://localhost:3001` (exactement, avec http, pas https)
6. **Authorized redirect URIs** :
   - ✅ `http://localhost:3001/api/auth/callback/google` (exactement)

### Erreurs courantes

- ❌ `http://localhost:3000/...` (mauvais port)
- ❌ `https://localhost:3001/...` (https au lieu de http)
- ❌ Trailing slash manquant ou en trop
- ❌ Espaces avant/après l'URL

## 🎯 Solution 6 : Utiliser un nouveau projet Google Cloud

Si la configuration actuelle ne fonctionne pas, créons un nouveau projet :

1. **Allez sur** [Google Cloud Console](https://console.cloud.google.com/)
2. **Créez un nouveau projet** (ex: "Snappix Dev")
3. **Activez Google+ API**
4. **Créez un nouveau OAuth Client ID** avec :
   - Authorized redirect URI : `http://localhost:3001/api/auth/callback/google`
5. **Copiez le nouveau Client ID et Secret**
6. **Mettez à jour** `saas/.env.local`
7. **Redémarrez le serveur**

## 🎯 Solution 7 : Vérifier que NextAuth fonctionne

### Tester l'endpoint NextAuth

1. **Allez sur** : `http://localhost:3001/api/auth/providers`
2. **Vous devriez voir** un JSON avec les providers disponibles
3. **Vérifiez** que `google` est dans la liste

### Tester la page de connexion NextAuth

1. **Allez sur** : `http://localhost:3001/api/auth/signin`
2. **Vous devriez voir** la page de connexion NextAuth par défaut
3. **Vérifiez** que le bouton Google apparaît

## 🎯 Solution 8 : Mode debug NextAuth

Ajoutez le mode debug dans `saas/.env.local` :

```env
NEXTAUTH_DEBUG=true
```

**Redémarrez le serveur** et regardez les logs pour voir les erreurs détaillées.

## 🎯 Solution 9 : Vérifier la base de données

Si l'utilisateur n'est pas créé après connexion Google :

1. **Vérifiez** que `DATABASE_URL` est correct
2. **Vérifiez** que Prisma peut écrire :
   ```powershell
   cd saas
   npx prisma studio
   ```
3. **Ouvrez** Prisma Studio et vérifiez la table `User`

## 🎯 Solution 10 : Réinitialiser complètement

Si rien ne fonctionne, réinitialisons :

1. **Arrêtez le serveur** (Ctrl+C)
2. **Supprimez** `saas/.next` (cache Next.js)
3. **Vérifiez** `saas/.env.local` (toutes les variables)
4. **Redémarrez** :
   ```powershell
   cd saas
   npm run dev
   ```

---

## 📋 Diagnostic rapide

Répondez à ces questions :

1. **Le serveur démarre-t-il sans erreur ?** (regardez le terminal)
2. **Pouvez-vous accéder à** `http://localhost:3001` ?
3. **Pouvez-vous créer un compte avec email/password ?**
4. **Quelle erreur exacte voyez-vous** quand vous cliquez sur "Continuer avec Google" ?
5. **Y a-t-il des erreurs dans la console du serveur ?**

**Partagez ces informations et je vous aiderai à résoudre le problème !** 🎯



















