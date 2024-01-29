-- DropForeignKey
ALTER TABLE `point` DROP FOREIGN KEY `Point_userId_fkey`;

-- AlterTable
ALTER TABLE `point` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
