/*
  Warnings:

  - You are about to alter the column `voucherAmount` on the `uservoucher` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `uservoucher` MODIFY `voucherAmount` DOUBLE NOT NULL;
