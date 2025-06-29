/*
  Warnings:

  - The values [RECEIVED,REJECTED] on the enum `OrderItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `warehouseItemId` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseItemId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `shippingMethod` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subtotal` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxes` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataBilling` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataShipping` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAmount` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalAmount` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderItemStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'UNCOMPLETED');
ALTER TABLE "OrderItem" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OrderItem" ALTER COLUMN "status" TYPE "OrderItemStatus_new" USING ("status"::text::"OrderItemStatus_new");
ALTER TYPE "OrderItemStatus" RENAME TO "OrderItemStatus_old";
ALTER TYPE "OrderItemStatus_new" RENAME TO "OrderItemStatus";
DROP TYPE "OrderItemStatus_old";
ALTER TABLE "OrderItem" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_warehouseItemId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_warehouseItemId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropIndex
DROP INDEX "Discount_warehouseItemId_key";

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "warehouseItemId",
ADD COLUMN     "items" INTEGER[];

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxes" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "warehouseItemId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL,
ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "paymentTerms",
DROP COLUMN "shippingMethod",
DROP COLUMN "supplierId",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "dataBilling" TEXT NOT NULL,
ADD COLUMN     "dataShipping" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "shippingAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subtotalAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "expectedDeliveryDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "actualDeliveryDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WarehouseItem" ALTER COLUMN "lastUpdated" DROP DEFAULT;

-- DropTable
DROP TABLE "Supplier";

-- CreateTable
CREATE TABLE "Google" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "email" TEXT,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Google_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Google_googleId_key" ON "Google"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Google_email_key" ON "Google"("email");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
