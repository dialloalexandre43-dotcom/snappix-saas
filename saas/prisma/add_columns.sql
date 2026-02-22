-- Script SQL pour ajouter les colonnes manquantes à la table User
-- Exécutez ce script dans votre base de données PostgreSQL

-- Ajouter la colonne plan si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'plan') THEN
        ALTER TABLE "User" ADD COLUMN "plan" "UserPlan" NOT NULL DEFAULT 'FREE';
    END IF;
END $$;

-- Ajouter la colonne stripeCustomerId si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'stripeCustomerId') THEN
        ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
    END IF;
END $$;

-- Ajouter la colonne stripeSubscriptionId si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'stripeSubscriptionId') THEN
        ALTER TABLE "User" ADD COLUMN "stripeSubscriptionId" TEXT;
    END IF;
END $$;

-- Ajouter la colonne stripePriceId si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'stripePriceId') THEN
        ALTER TABLE "User" ADD COLUMN "stripePriceId" TEXT;
    END IF;
END $$;

-- Ajouter la colonne stripeCurrentPeriodEnd si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'stripeCurrentPeriodEnd') THEN
        ALTER TABLE "User" ADD COLUMN "stripeCurrentPeriodEnd" TIMESTAMP(3);
    END IF;
END $$;

-- Créer l'enum UserPlan s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserPlan') THEN
        CREATE TYPE "UserPlan" AS ENUM ('FREE', 'STARTER', 'PRO');
    END IF;
END $$;








