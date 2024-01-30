/*
  Warnings:

  - Made the column `maxUsage` on table `promotion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `promotion` MODIFY `maxUsage` INTEGER NOT NULL;
