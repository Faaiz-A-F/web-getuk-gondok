/*
  Warnings:

  - The values [PROCESSING,SHIPPED,DELIVERED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'PAID', 'DONE', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
