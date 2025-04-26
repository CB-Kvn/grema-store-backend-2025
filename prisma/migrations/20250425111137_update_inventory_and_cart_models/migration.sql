/*
  Warnings:

  - You are about to drop the column `productId` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `isBestSeller` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isGift` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[warehouseItemId]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `warehouseItemId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseItemId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `WarehouseItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_productId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropIndex
DROP INDEX "Discount_productId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "productId",
ADD COLUMN     "warehouseItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "productId",
ADD COLUMN     "warehouseItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isBestSeller",
DROP COLUMN "isGift",
DROP COLUMN "isNew",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WarehouseItem" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Discount_warehouseItemId_key" ON "Discount"("warehouseItemId");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_warehouseItemId_fkey" FOREIGN KEY ("warehouseItemId") REFERENCES "WarehouseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_warehouseItemId_fkey" FOREIGN KEY ("warehouseItemId") REFERENCES "WarehouseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
