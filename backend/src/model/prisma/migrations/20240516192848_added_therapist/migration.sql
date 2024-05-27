/*
  Warnings:

  - You are about to drop the column `email` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Therapist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Therapist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ratePerSession` to the `Therapist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Therapist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "Therapist_email_key";

-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "email",
DROP COLUMN "lastname",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "ratePerSession" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "therapistId" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_userId_key" ON "Therapist"("userId");

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
