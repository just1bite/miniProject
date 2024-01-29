/*
  Warnings:

  - Added the required column `username` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `username` VARCHAR(191) NOT NULL;
