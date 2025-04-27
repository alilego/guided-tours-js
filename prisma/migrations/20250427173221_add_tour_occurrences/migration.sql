-- CreateEnum
CREATE TYPE "TourOccurrenceStatus" AS ENUM ('SCHEDULED', 'CANCELED');

-- CreateTable
CREATE TABLE "TourOccurrence" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "TourOccurrenceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourOccurrence_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "tourOccurrenceId" TEXT;

-- CreateIndex
CREATE INDEX "TourOccurrence_tourId_idx" ON "TourOccurrence"("tourId");
CREATE UNIQUE INDEX "TourOccurrence_tourId_date_key" ON "TourOccurrence"("tourId", "date");
CREATE INDEX "Booking_tourOccurrenceId_idx" ON "Booking"("tourOccurrenceId");

-- AddForeignKey
ALTER TABLE "TourOccurrence" ADD CONSTRAINT "TourOccurrence_tourId_fkey" 
    FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourOccurrenceId_fkey" 
    FOREIGN KEY ("tourOccurrenceId") REFERENCES "TourOccurrence"("id") ON DELETE SET NULL ON UPDATE CASCADE; 