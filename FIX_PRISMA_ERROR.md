# 🔧 Fix: Erreur Prisma "prepared statement already exists"

## Problème

L'erreur `prepared statement "s0" already exists` (code PostgreSQL 42P05) survient souvent avec Supabase et Prisma, surtout avec le pooler de connexion.

## Solutions

### Solution 1 : Vérifier l'URL de connexion Supabase

Assurez-vous d'utiliser l'URL du **Transaction pooler** (port 6543) et non la connexion directe :

```
postgresql://postgres.xxx:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important** : Ajoutez `?pgbouncer=true` à la fin de l'URL si vous utilisez le pooler.

### Solution 2 : Utiliser la connexion directe (alternative)

Si le pooler pose problème, utilisez la connexion directe (port 5432) :

```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

⚠️ **Note** : La connexion directe a des limites de connexions simultanées.

### Solution 3 : Redémarrer le serveur

Parfois, le problème vient d'une instance Prisma qui traîne :

1. Arrêtez le serveur (`Ctrl+C`)
2. Supprimez `.next` si nécessaire :
   ```bash
   rm -rf .next
   ```
3. Régénérez le client Prisma :
   ```bash
   npx prisma generate
   ```
4. Redémarrez le serveur :
   ```bash
   npm run dev
   ```

### Solution 4 : Vérifier le fichier `.env.local`

Assurez-vous que `DATABASE_URL` est correctement défini dans `saas/.env.local` :

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Solution 5 : Mettre à jour le schema Prisma (si nécessaire)

Si vous utilisez le pooler, vous pouvez ajouter `directUrl` dans le schema :

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // URL directe sans pooler
}
```

Puis dans `.env.local` :
```env
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

## Vérification

1. Vérifiez que l'URL contient `?pgbouncer=true` si vous utilisez le pooler
2. Redémarrez le serveur
3. Testez la connexion

Si le problème persiste, essayez la connexion directe temporairement.




















