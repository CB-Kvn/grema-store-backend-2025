"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class ProductService {
    async getAllProducts() {
        try {
            return await database_1.default.product.findMany({
                where: { available: true },
                include: {
                    WarehouseItem: true,
                    Images: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getAllProducts:', error);
            throw error;
        }
    }
    async getProductById(id) {
        try {
            return await database_1.default.product.findUnique({
                where: { id, available: true },
                include: {
                    WarehouseItem: true,
                    Images: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in getProductById: ${id}`, error);
            throw error;
        }
    }
    async createProduct(data) {
        try {
            return await database_1.default.product.create({
                data: {
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    sku: data.sku,
                    details: data.details,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in createProduct:', error);
            throw error;
        }
    }
    async updateProduct(id, data) {
        try {
            return await database_1.default.product.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    sku: data.sku,
                    details: data.details,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in updateProduct: ${id}`, error);
            throw error;
        }
    }
    async deleteProduct(id) {
        try {
            return await database_1.default.product.update({
                where: { id },
                data: { available: false },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in deleteProduct: ${id}`, error);
            throw error;
        }
    }
    async createProductsBulk(products) {
        try {
            if (!products || products.length === 0) {
                throw new Error('No products provided for bulk creation');
            }
            const createdProducts = await database_1.default.product.createMany({
                data: products.map((product) => ({
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    sku: product.sku,
                    details: product.details,
                })),
                skipDuplicates: true,
            });
            return createdProducts;
        }
        catch (error) {
            logger_1.logger.error('Error in createProductsBulk:', error);
            throw error;
        }
    }
    async createImage(data) {
        return database_1.default.image.create({
            data: { url: data.url, productId: data.productId, state: true }
        });
    }
    async updateImage(id, url, state, productId) {
        if (!id || typeof id !== 'number' || isNaN(id)) {
            return database_1.default.image.create({
                data: {
                    url: url ?? '',
                    state: state ?? true,
                    productId: productId
                }
            });
        }
        try {
            return await database_1.default.image.update({
                where: { id },
                data: {
                    url,
                    state,
                    productId
                },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return database_1.default.image.create({
                    data: {
                        id,
                        url: url ?? '',
                        state: state ?? true,
                        productId: productId
                    }
                });
            }
            throw error;
        }
    }
    async deleteImage(id) {
        return database_1.default.image.update({
            where: { id },
            data: { state: false },
        });
    }
    async getLatestProducts(limit = 12) {
        try {
            return await database_1.default.product.findMany({
                where: { available: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    WarehouseItem: true,
                    Images: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getLatestProducts:', error);
            throw error;
        }
    }
    async getBestSellingProducts(limit = 12) {
        const bestSellers = await database_1.default.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });
        if (bestSellers.length === 0) {
            return database_1.default.product.findMany({
                where: { available: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    WarehouseItem: true,
                    Images: true,
                },
            });
        }
        const productIds = bestSellers.map((item) => item.productId);
        return database_1.default.product.findMany({
            where: { id: { in: productIds }, available: true },
            include: {
                WarehouseItem: true,
                Images: true,
            },
        });
    }
    async getPendingOrderQuantity(productId) {
        const orderItems = await database_1.default.orderItem.findMany({
            where: {
                productId,
                order: {
                    NOT: {
                        status: { in: ['SHIPPED', 'DELIVERED'] }
                    }
                }
            },
            select: { quantity: true }
        });
        const total = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        return total;
    }
}
exports.ProductService = ProductService;
