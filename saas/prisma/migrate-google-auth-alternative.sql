-- Version alternative si la migration principale échoue
-- Utilisez cette version si vous avez des contraintes sur passwordHash

-- Étape 1: Ajouter les nouvelles colonnes
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- Étape 2: Si passwordHash a une contrainte NOT NULL, créez une nouvelle table temporaire
-- Cette approche est plus sûre si vous avez déjà des données

-- D'abord, vérifiez la structure actuelle
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'passwordHash';

-- Si la colonne est NOT NULL et que vous avez des utilisateurs existants,
-- vous devrez d'abord mettre à jour les utilisateurs pour permettre NULL
-- ou créer une valeur par défaut temporaire

-- Option 1: Si vous n'avez pas encore d'utilisateurs, utilisez simplement:
-- ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Option 2: Si vous avez des utilisateurs, créez une nouvelle colonne temporaire,
-- copiez les données, supprimez l'ancienne, renommez la nouvelle
-- (Cette approche est plus complexe et nécessite une maintenance)





















