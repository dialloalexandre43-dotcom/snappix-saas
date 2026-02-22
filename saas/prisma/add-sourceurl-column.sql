-- Ajouter la colonne sourceUrl à la table Job
-- Cette colonne stocke l'URL de la page produit (Amazon/AliExpress)

ALTER TABLE "Job" 
ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;

-- La colonne est optionnelle (nullable) donc pas besoin de valeur par défaut













