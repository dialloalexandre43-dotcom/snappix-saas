-- Migration: Add UserPlan enum and plan field to User table

-- Create UserPlan enum
DO $$ BEGIN
    CREATE TYPE "UserPlan" AS ENUM ('FREE', 'STARTER', 'PRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add plan column to User table (defaults to FREE)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "plan" "UserPlan" NOT NULL DEFAULT 'FREE';

-- Update existing users to FREE plan (if not already set)
UPDATE "User" SET "plan" = 'FREE' WHERE "plan" IS NULL;










