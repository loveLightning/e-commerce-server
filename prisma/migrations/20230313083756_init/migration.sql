/*
  Warnings:

  - You are about to drop the column `int` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "int",
ADD COLUMN     "id" SERIAL NOT NULL;
