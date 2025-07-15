"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderController = void 0;
const purchaseOrderService_1 = require("../services/purchaseOrderService");
const logger_1 = require("../utils/logger");
const otherKitService_1 = __importDefault(require("../services/otherKitService"));
const promises_1 = __importDefault(require("fs/promises"));
class PurchaseOrderController {
    constructor() {
        this.getAllOrders = async (req, res) => {
            try {
                const orders = await this.purchaseOrderService.getAllOrders();
                res.json(orders);
            }
            catch (error) {
                logger_1.logger.error('Error getting orders:', error);
                res.status(500).json({ error: 'Error getting orders' });
            }
        };
        this.getOrderById = async (req, res) => {
            try {
                const order = await this.purchaseOrderService.getOrderById(req.params.id);
                if (!order) {
                    return res.status(404).json({ error: 'Order not found' });
                }
                res.json(order);
            }
            catch (error) {
                logger_1.logger.error('Error getting order:', error);
                res.status(500).json({ error: 'Error getting order' });
            }
        };
        this.createOrder = async (req, res) => {
            try {
                const order = await this.purchaseOrderService.createOrder(req.body);
                res.status(201).json(order);
            }
            catch (error) {
                logger_1.logger.error('Error creating order:', error);
                res.status(500).json({ error: 'Error creating order' });
            }
        };
        this.updateOrder = async (req, res) => {
            try {
                const order = await this.purchaseOrderService.updateOrder(req.params.id, req.body);
                if (!order) {
                    return res.status(404).json({ error: 'Order not found' });
                }
                res.json(order);
            }
            catch (error) {
                logger_1.logger.error('Error updating order:', error);
                res.status(500).json({ error: 'Error updating order' });
            }
        };
        this.deleteOrder = async (req, res) => {
            try {
                await this.purchaseOrderService.deleteOrder(req.params.id);
                res.status(201).json({ message: 'Order deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting order:', error);
                res.status(500).json({ error: 'Error deleting order' });
            }
        };
        this.addDocument = async (req, res) => {
            try {
                const document = await this.purchaseOrderService.addDocument(req.params.orderId, req.body);
                res.status(201).json(document);
            }
            catch (error) {
                logger_1.logger.error('Error adding document:', error);
                res.status(500).json({ error: 'Error adding document' });
            }
        };
        this.updateDocument = async (req, res) => {
            try {
                const document = await this.purchaseOrderService.updateDocument(req.params.orderId, req.body);
                res.json(document);
            }
            catch (error) {
                logger_1.logger.error('Error updating document:', error);
                res.status(500).json({ error: 'Error updating document' });
            }
        };
        this.uploadFile = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ error: 'No file uploaded' });
                    return;
                }
                const filePath = await this.purchaseOrderService.saveFile(req.file);
                res.status(200).json({ message: 'File uploaded successfully', filePath });
            }
            catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Error uploading file' });
            }
        };
        this.uploadFileReceipt = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No file uploaded' });
                    return;
                }
                const folderName = 'purchase_orders_files';
                const response = await this.othersKitService.upload(req.file.path, { folder: folderName });
                await promises_1.default.unlink(req.file.path);
                res.status(200).json(response);
            }
            catch (error) {
                logger_1.logger.error('Error uploading purchase order file:', error);
                res.status(500).json({ message: 'Error uploading file', error });
            }
        };
        this.purchaseOrderService = new purchaseOrderService_1.PurchaseOrderService();
        this.othersKitService = new otherKitService_1.default();
    }
}
exports.PurchaseOrderController = PurchaseOrderController;
