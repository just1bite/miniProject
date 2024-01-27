/*
  Warnings:

  - You are about to drop the `tickettier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tickettier` DROP FOREIGN KEY `TicketTier_eventId_fkey`;

-- DropTable
DROP TABLE `tickettier`;

-- CreateTable
CREATE TABLE `TicketType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tierName` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NOT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TicketType` ADD CONSTRAINT `TicketType_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
