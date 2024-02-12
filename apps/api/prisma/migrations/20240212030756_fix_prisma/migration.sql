/*
  Warnings:

  - You are about to drop the column `ticketType` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `countSeat` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `ticketType`,
    ADD COLUMN `countSeat` INTEGER NOT NULL;
