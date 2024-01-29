/*
  Warnings:

  - Made the column `userId` on table `userpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `userpoint` DROP FOREIGN KEY `Userpoint_userId_fkey`;

-- AlterTable
ALTER TABLE `userpoint` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Userpoint` ADD CONSTRAINT `Userpoint_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
