/*
  Warnings:

  - You are about to drop the column `tierName` on the `tickettype` table. All the data in the column will be lost.
  - Added the required column `ticketName` to the `TicketType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tickettype` DROP COLUMN `tierName`,
    ADD COLUMN `ticketName` VARCHAR(191) NOT NULL;
