# Mise à jour de la base de données

La base de données n'a pas les colonnes nécessaires. Voici comment les ajouter :

## Option 1 : Utiliser Prisma Studio (Recommandé)

1. Ouvrez Prisma Studio :
   ```bash
   cd saas
   npx prisma studio
   ```

2. Cela ouvrira une interface web sur http://localhost:5555

3. Vérifiez la structure de la table User

## Option 2 : Exécuter le script SQL directement

1. Connectez-vous à votre base de données PostgreSQL (Supabase, etc.)

2. Exécutez le script `prisma/add_columns.sql` dans votre interface SQL

3. Ou utilisez psql :
   ```bash
   psql $DATABASE_URL -f prisma/add_columns.sql
   ```

## Option 3 : Utiliser Prisma db push (si possible)

Essayez à nouveau :
```bash
cd saas
npx prisma db push
```

Si ça ne fonctionne pas, utilisez l'Option 2.

## Vérification

Après avoir ajouté les colonnes, redémarrez votre serveur Next.js et testez la page `/billing`.








