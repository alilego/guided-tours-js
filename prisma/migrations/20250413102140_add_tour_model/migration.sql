/*
  Warnings:

  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfPeople` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `maxGroupSize` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `date` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxParticipants` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "date",
DROP COLUMN "numberOfPeople",
DROP COLUMN "status",
DROP COLUMN "totalPrice";

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "categories",
DROP COLUMN "difficulty",
DROP COLUMN "location",
DROP COLUMN "maxGroupSize",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Booking_tourId_idx" ON "Booking"("tourId");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
