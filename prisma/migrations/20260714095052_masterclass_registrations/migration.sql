-- AlterEnum
ALTER TYPE "DonationType" ADD VALUE 'TRAINING';

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "position" TEXT;
