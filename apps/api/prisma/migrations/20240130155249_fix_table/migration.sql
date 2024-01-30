/*
  Warnings:

  - You are about to drop the column `maxUsageVoucher` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `voucherCode` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `referralDiscount` on the `promotion` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `useVoucher` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `countSeat` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `maxUsageVoucher`,
    DROP COLUMN `voucherCode`;

-- AlterTable
ALTER TABLE `promotion` DROP COLUMN `referralDiscount`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `ticketType`,
    DROP COLUMN `useVoucher`,
    ADD COLUMN `countSeat` INTEGER NOT NULL;
