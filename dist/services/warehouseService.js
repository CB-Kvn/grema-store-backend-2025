"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class WarehouseService {
    async getAllWarehouses() {
        try {
            return await database_1.default.warehouse.findMany({
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getAllWarehouses:', error);
            throw error;
        }
    }
    async getWarehouseById(id) {
        try {
            return await database_1.default.warehouse.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            product: true,
                            movements: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in getWarehouseById: ${id}`, error);
            throw error;
        }
    }
    async createWarehouse(data) {
        try {
            return await database_1.default.warehouse.create({
                data: {
                    name: data.name,
                    location: data.location,
                    address: data.address,
                    manager: data.manager,
                    phone: data.phone,
                    email: data.email,
                    capacity: data.capacity,
                    currentOccupancy: data.currentOccupancy ?? 0,
                    status: data.status ?? 'ACTIVE',
                    lastInventoryDate: data.lastInventoryDate ?? null,
                    notes: data.notes ?? null,
                },
                include: {
                    items: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in createWarehouse:', error);
            throw error;
        }
    }
    async updateWarehouse(id, data) {
        try {
            return await database_1.default.warehouse.update({
                where: { id },
                data: {
                    ...data,
                    items: undefined,
                },
                include: {
                    items: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in updateWarehouse: ${id}`, error);
            throw error;
        }
    }
    async deleteWarehouse(id) {
        try {
            await database_1.default.warehouseItem.deleteMany({
                where: { warehouseId: id },
            });
            return await database_1.default.warehouse.delete({
                where: { id },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in deleteWarehouse: ${id}`, error);
            throw error;
        }
    }
    async getWarehouseItemsByProductId(productId) {
        try {
            return await database_1.default.warehouseItem.findMany({
                where: { productId },
                include: {
                    warehouse: true,
                    product: true
                },
            });
        }
        catch (error) {
            console.error('Error in getWarehouseItemsByProductId:', error);
            throw error;
        }
    }
    async addStock(warehouseId, productId, quantity, location, price, cost) {
        try {
            const item = await database_1.default.warehouseItem.findFirst({
                where: {
                    warehouseId,
                    productId,
                },
            });
            if (item) {
                const updatedItem = await database_1.default.warehouseItem.update({
                    where: { id: item.id },
                    data: {
                        price: price,
                        cost: cost,
                        quantity: item.quantity + quantity,
                        status: this.calculateStockStatus(quantity, item.minimumStock),
                    },
                });
                await database_1.default.stockMovement.create({
                    data: {
                        itemId: item.id,
                        type: 'IN',
                        quantity,
                        userId: 'system',
                    },
                });
                return updatedItem;
            }
            else {
                const newItem = await database_1.default.warehouseItem.create({
                    data: {
                        warehouseId,
                        productId,
                        quantity,
                        location,
                        price,
                        cost,
                        minimumStock: 0,
                        status: 'IN_STOCK',
                    },
                });
                await database_1.default.stockMovement.create({
                    data: {
                        itemId: newItem.id,
                        type: 'IN',
                        quantity,
                        userId: 'system',
                    },
                });
                return newItem;
            }
        }
        catch (error) {
            logger_1.logger.error('Error in addStock:', error);
            throw error;
        }
    }
    async removeStock(warehouseId, productId, quantity) {
        try {
            const item = await database_1.default.warehouseItem.findFirst({
                where: {
                    warehouseId,
                    productId,
                },
            });
            if (!item) {
                throw new Error('Item not found in warehouse');
            }
            if (item.quantity < quantity) {
                throw new Error('Insufficient stock');
            }
            const updatedItem = await database_1.default.warehouseItem.update({
                where: { id: item.id },
                data: {
                    quantity: item.quantity - quantity,
                    status: this.calculateStockStatus(item.quantity - quantity, item.minimumStock),
                },
            });
            await database_1.default.stockMovement.create({
                data: {
                    itemId: item.id,
                    type: 'OUT',
                    quantity,
                    userId: 'system',
                },
            });
            return updatedItem;
        }
        catch (error) {
            logger_1.logger.error('Error in removeStock:', error);
            throw error;
        }
    }
    async transferStock(sourceWarehouseId, targetWarehouseId, productId, quantity) {
        try {
            return await database_1.default.$transaction(async (prisma) => {
                const sourceItem = await prisma.warehouseItem.findFirst({
                    where: {
                        warehouseId: sourceWarehouseId,
                        productId,
                    },
                    select: {
                        id: true,
                        location: true,
                        price: true,
                        cost: true,
                        quantity: true,
                    },
                });
                if (!sourceItem) {
                    throw new Error('Source item not found');
                }
                await this.removeStock(sourceWarehouseId, productId, quantity);
                await this.addStock(targetWarehouseId, productId, quantity, sourceItem.location, sourceItem.price, sourceItem.cost);
                return { success: true, message: 'Stock transferred successfully' };
            });
        }
        catch (error) {
            logger_1.logger.error('Error in transferStock:', error);
            throw error;
        }
    }
    async updatePriceAndCost(itemId, price, cost) {
        try {
            const updatedItem = await database_1.default.warehouseItem.update({
                where: { id: itemId },
                data: {
                    price,
                    cost,
                },
                include: {
                    product: true,
                    warehouse: true,
                },
            });
            logger_1.logger.info(`Price and cost updated for item: ${itemId}`);
            return updatedItem;
        }
        catch (error) {
            logger_1.logger.error('Error in updatePriceAndCost:', error);
            throw error;
        }
    }
    calculateStockStatus(quantity, minimumStock) {
        if (quantity === 0)
            return 'OUT_OF_STOCK';
        if (quantity <= minimumStock)
            return 'LOW_STOCK';
        return 'IN_STOCK';
    }
}
exports.WarehouseService = WarehouseService;
