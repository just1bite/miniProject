/*
  Warnings:

  - You are about to drop the `voucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `voucher` DROP FOREIGN KEY `Voucher_userId_fkey`;

-- DropTable
DROP TABLE `voucher`;

-- CreateTable
CREATE TABLE `Uservoucher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expiredDate` DATETIME(3) NOT NULL,
    `voucherAmount` DOUBLE NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Uservoucher` ADD CONSTRAINT `Uservoucher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
