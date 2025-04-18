/*
  Warnings:

  - Added the required column `creatorId` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- First, get or create an admin user to own existing tours
DO $$
DECLARE
    admin_id TEXT;
BEGIN
    -- Get the first admin user's ID
    SELECT id INTO admin_id FROM "User" WHERE role = 'ADMIN' LIMIT 1;

    -- If no admin exists, use the first user
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id FROM "User" LIMIT 1;
    END IF;

    -- Add the creatorId column as nullable first
    ALTER TABLE "Tour" ADD COLUMN "creatorId" TEXT;

    -- Update existing tours to belong to the admin
    UPDATE "Tour" SET "creatorId" = admin_id;

    -- Now make the column required
    ALTER TABLE "Tour" ALTER COLUMN "creatorId" SET NOT NULL;
END $$;

-- Create index
CREATE INDEX "Tour_creatorId_idx" ON "Tour"("creatorId");

-- Add foreign key constraint
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
