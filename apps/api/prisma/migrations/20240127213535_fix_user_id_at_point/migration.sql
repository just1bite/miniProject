/*
  Warnings:

  - Made the column `userId` on table `point` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `Point_userId_fkey`;

-- AlterTable
ALTER TABLE `point` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
