"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class PurchaseOrderService {
    async getAllOrders() {
        try {
            return await database_1.default.purchaseOrder.findMany({
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    documents: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getAllOrders:', error);
            throw error;
        }
    }
    async getOrderById(id) {
        try {
            return await database_1.default.purchaseOrder.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    documents: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in getOrderById: ${id}`, error);
            throw error;
        }
    }
    async createOrder(data) {
        try {
            return await database_1.default.purchaseOrder.create({
                data: {
                    ...data,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.product.id,
                            quantity: item.quantity,
                            unitPrice: item.product.WarehouseItem[0].price,
                            totalPrice: item.quantity * item.product.WarehouseItem[0].price,
                        })),
                    },
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in createOrder:', error);
            throw error;
        }
    }
    async updateOrder(id, data) {
        try {
            const { items, documents, ...orderData } = data;
            const existingOrder = await database_1.default.purchaseOrder.findUnique({
                where: { id },
                include: {
                    items: true,
                    documents: true
                }
            });
            const itemsOperations = Array.isArray(items) ? items.map(item => {
                return database_1.default.orderItem.upsert({
                    where: {
                        id: item.id || '',
                        orderId: id
                    },
                    update: {
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        qtyDone: item.qtyDone,
                        isGift: item.isGift,
                        isBestSeller: item.isBestSeller,
                        isNew: item.isNew,
                        status: item.status,
                    },
                    create: {
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        qtyDone: item.qtyDone,
                        isGift: item.isGift,
                        isBestSeller: item.isBestSeller,
                        isNew: item.isNew,
                        status: item.status,
                        orderId: id,
                    }
                });
            }) : [];
            const documentsOperations = Array.isArray(documents) ? documents.map(doc => {
                return database_1.default.document.upsert({
                    where: {
                        id: doc.id || '',
                        orderId: id
                    },
                    update: {
                        type: doc.type,
                        title: doc.title,
                        url: doc.url,
                        uploadedAt: doc.uploadedAt,
                        status: doc.status,
                        hash: doc.hash,
                        mimeType: doc.mimeType,
                        size: doc.size,
                    },
                    create: {
                        type: doc.type,
                        title: doc.title,
                        url: doc.url,
                        uploadedAt: doc.uploadedAt,
                        status: doc.status,
                        hash: doc.hash,
                        mimeType: doc.mimeType,
                        size: doc.size,
                        orderId: id,
                    }
                });
            }) : [];
            const [updatedOrder] = await database_1.default.$transaction([
                database_1.default.purchaseOrder.update({
                    where: { id },
                    data: orderData
                }),
                ...itemsOperations,
                ...documentsOperations
            ]);
            if (Array.isArray(items)) {
                const existingItemIds = existingOrder?.items.map(i => i.id) || [];
                const newItemIds = items.filter(i => i.id).map(i => i.id);
                const toDelete = existingItemIds.filter(id => !newItemIds.includes(id));
                if (toDelete.length > 0) {
                    await database_1.default.orderItem.deleteMany({
                        where: { id: { in: toDelete } }
                    });
                }
            }
            if (Array.isArray(documents)) {
                const existingDocIds = existingOrder?.documents.map(d => d.id) || [];
                const newDocIds = documents.filter(d => d.id).map(d => d.id);
                const toDelete = existingDocIds.filter(id => !newDocIds.includes(id));
                if (toDelete.length > 0) {
                    await database_1.default.document.deleteMany({
                        where: { id: { in: toDelete } }
                    });
                }
            }
            return await database_1.default.purchaseOrder.findUnique({
                where: { id },
                include: {
                    items: { include: { product: true } },
                    documents: true,
                }
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in updateOrder: ${id}`, error);
            throw error;
        }
    }
    async deleteOrder(id) {
        try {
            await database_1.default.orderItem.deleteMany({
                where: { orderId: id },
            });
            await database_1.default.document.deleteMany({
                where: { orderId: id },
            });
            return await database_1.default.purchaseOrder.delete({
                where: { id },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in deleteOrder: ${id}`, error);
            throw error;
        }
    }
    async addDocument(orderId, documentData) {
        try {
            return await database_1.default.document.create({
                data: {
                    ...documentData,
                    orderId,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in addDocument for order: ${orderId}`, error);
            throw error;
        }
    }
    async updateDocument(orderId, documentData) {
        try {
            if (!orderId) {
                throw new Error('Document ID is required for update');
            }
            database_1.default.document.deleteMany({
                where: { orderId: orderId }
            }).catch(error => {
                logger_1.logger.error(`Error deleting document with ID ${documentData.id} for order ${orderId}:`, error);
            });
            return await database_1.default.document.updateMany({
                where: { id: orderId },
                data: documentData,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in updateDocument: ${orderId}`, error);
            throw error;
        }
    }
    async saveFile(file) {
        try {
            console.log('Saving file:', file);
            return `/uploads/vouchers/${file.filename}`;
        }
        catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Error saving file');
        }
    }
}
exports.PurchaseOrderService = PurchaseOrderService;
