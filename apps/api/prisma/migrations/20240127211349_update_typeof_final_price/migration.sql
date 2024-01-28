/*
  Warnings:

  - You are about to alter the column `finalPrice` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `finalPrice` DOUBLE NULL;
