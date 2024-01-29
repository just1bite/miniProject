/*
  Warnings:

  - Made the column `amount` on table `point` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `point` MODIFY `amount` INTEGER NOT NULL;
