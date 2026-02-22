-- Migration pour ajouter le support Google OAuth
-- Exécutez ce script dans Supabase SQL Editor

-- Ajouter les colonnes name et image (optionnelles)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "name" TEXT;

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "image" TEXT;

-- Rendre passwordHash optionnel (pour permettre les comptes Google sans mot de passe)
-- Note: Cette commande peut échouer si vous avez des contraintes
-- Si elle échoue, vous devrez d'abord mettre à jour les utilisateurs existants
ALTER TABLE "User" 
ALTER COLUMN "passwordHash" DROP NOT NULL;
