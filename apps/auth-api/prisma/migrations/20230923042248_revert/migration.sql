/*
  Warnings:

  - You are about to drop the `refreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "refreshTokens" DROP CONSTRAINT "refreshTokens_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshTokens" TEXT;

-- DropTable
DROP TABLE "refreshTokens";
