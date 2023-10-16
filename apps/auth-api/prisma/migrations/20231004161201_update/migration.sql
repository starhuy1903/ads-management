-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resettingPass" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
