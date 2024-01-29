/*
  Warnings:

  - Made the column `amount` on table `userpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `userpoint` MODIFY `amount` INTEGER NOT NULL;
