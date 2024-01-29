/*
  Warnings:

  - You are about to drop the column `pointId` on the `point` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `point` DROP COLUMN `pointId`,
    ADD COLUMN `amount` INTEGER NOT NULL;
