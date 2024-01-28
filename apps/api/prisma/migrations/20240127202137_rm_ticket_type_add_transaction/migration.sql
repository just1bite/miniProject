/*
  Warnings:

  - You are about to drop the column `date` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `tickettype` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dateEvent` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datePurchased` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tickettype` DROP FOREIGN KEY `TicketType_eventId_fkey`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `date`,
    ADD COLUMN `dateEvent` DATETIME(3) NOT NULL,
    ADD COLUMN `datePurchased` DATETIME(3) NOT NULL,
    ADD COLUMN `eventId` INTEGER NOT NULL,
    ADD COLUMN `ticketType` VARCHAR(191) NOT NULL DEFAULT 'bronze';

-- DropTable
DROP TABLE `tickettype`;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
