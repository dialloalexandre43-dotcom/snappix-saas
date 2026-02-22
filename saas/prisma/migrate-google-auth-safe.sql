-- Version sécurisée de la migration Google OAuth
-- Exécutez ce script dans Supabase SQL Editor, ligne par ligne si nécessaire

-- Étape 1: Ajouter la colonne name
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- Étape 2: Ajouter la colonne image
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- Étape 3: Rendre passwordHash optionnel
-- Si cette commande échoue, exécutez d'abord la version alternative ci-dessous
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;





















