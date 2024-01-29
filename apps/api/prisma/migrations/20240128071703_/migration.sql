/*
  Warnings:

  - You are about to drop the `point` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `Point_userId_fkey`;

-- DropTable
DROP TABLE `point`;

-- CreateTable
CREATE TABLE `Userpoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `expiredDate` DATETIME(3) NOT NULL,
    `amount` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Userpoint` ADD CONSTRAINT `Userpoint_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
