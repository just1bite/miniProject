/*
  Warnings:

  - Made the column `voucherAmount` on table `uservoucher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `uservoucher` MODIFY `voucherAmount` DOUBLE NOT NULL;
