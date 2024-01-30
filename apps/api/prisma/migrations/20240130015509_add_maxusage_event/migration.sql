/*
  Warnings:

  - Added the required column `maxUsageVoucher` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `maxUsageVoucher` INTEGER NOT NULL;
