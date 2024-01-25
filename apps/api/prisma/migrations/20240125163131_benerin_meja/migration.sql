/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `userUser_id` on the `point` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userUser_id` on the `voucher` table. All the data in the column will be lost.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_userUser_id_fkey`;

-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `Point_userUser_id_fkey`;

-- DropForeignKey
ALTER TABLE `voucher` DROP FOREIGN KEY `Voucher_userUser_id_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `userUser_id`,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `point` DROP COLUMN `userUser_id`,
    ADD COLUMN `pointId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `voucher` DROP COLUMN `userUser_id`,
    ADD COLUMN `userId` INTEGER NULL,
    ADD COLUMN `voucherId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `reviewBy` VARCHAR(191) NOT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voucher` ADD CONSTRAINT `Voucher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
