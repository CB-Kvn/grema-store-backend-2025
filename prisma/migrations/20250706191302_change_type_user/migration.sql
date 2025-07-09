-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('BUYER', 'ADMIN');

-- AlterTable
ALTER TABLE "Google" ADD COLUMN     "typeUser" "UserTypes" DEFAULT 'BUYER';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "qtyDone" INTEGER;
