/*
  Warnings:

  - Added the required column `username` to the `Uservoucher` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `uservoucher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `uservoucher` DROP FOREIGN KEY `Uservoucher_userId_fkey`;

-- AlterTable
ALTER TABLE `uservoucher` ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Uservoucher` ADD CONSTRAINT `Uservoucher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
