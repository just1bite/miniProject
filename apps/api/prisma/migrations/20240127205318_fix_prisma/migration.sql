/*
  Warnings:

  - You are about to drop the column `ticketId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `eventName` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `ticketId`,
    DROP COLUMN `username`,
    ADD COLUMN `eventName` VARCHAR(191) NOT NULL;
