-- AlterTable
ALTER TABLE `Order` ADD COLUMN `pickupLocation` VARCHAR(191) NOT NULL DEFAULT 'rumah-produksi',
    ADD COLUMN `preparationDate` DATETIME(3) NULL;
