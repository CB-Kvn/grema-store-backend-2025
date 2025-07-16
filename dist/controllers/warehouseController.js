"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const warehouseService_1 = require("../services/warehouseService");
const logger_1 = require("../utils/logger");
class WarehouseController {
    constructor() {
        this.getAllWarehouses = async (req, res) => {
            try {
                const warehouses = await this.warehouseService.getAllWarehouses();
                res.json(warehouses);
            }
            catch (error) {
                logger_1.logger.error('Error getting warehouses:', error);
                res.status(500).json({ error: 'Error getting warehouses' });
            }
        };
        this.getWarehouseById = async (req, res) => {
            try {
                const warehouse = await this.warehouseService.getWarehouseById(req.params.id);
                if (!warehouse) {
                    return res.status(404).json({ error: 'Warehouse not found' });
                }
                res.json(warehouse);
            }
            catch (error) {
                logger_1.logger.error('Error getting warehouse:', error);
                res.status(500).json({ error: 'Error getting warehouse' });
            }
        };
        this.createWarehouse = async (req, res) => {
            try {
                const warehouse = await this.warehouseService.createWarehouse(req.body);
                res.status(201).json(warehouse);
            }
            catch (error) {
                logger_1.logger.error('Error creating warehouse:', error);
                res.status(500).json({ error: 'Error creating warehouse' });
            }
        };
        this.updateWarehouse = async (req, res) => {
            try {
                const warehouse = await this.warehouseService.updateWarehouse(req.params.id, req.body);
                if (!warehouse) {
                    return res.status(404).json({ error: 'Warehouse not found' });
                }
                res.json(warehouse);
            }
            catch (error) {
                logger_1.logger.error('Error updating warehouse:', error);
                res.status(500).json({ error: 'Error updating warehouse' });
            }
        };
        this.deleteWarehouse = async (req, res) => {
            try {
                await this.warehouseService.deleteWarehouse(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting warehouse:', error);
                res.status(500).json({ error: 'Error deleting warehouse' });
            }
        };
        this.addStock = async (req, res) => {
            try {
                const result = await this.warehouseService.addStock(req.params.warehouseId, Number(req.params.productId), req.body.quantity, req.body.location, Number(req.body.price), Number(req.body.cost));
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error adding stock:', error);
                res.status(500).json({ error: 'Error adding stock' });
            }
        };
        this.removeStock = async (req, res) => {
            try {
                const result = await this.warehouseService.removeStock(req.params.warehouseId, Number(req.params.productId), req.body.quantity);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error removing stock:', error);
                res.status(500).json({ error: 'Error removing stock' });
            }
        };
        this.transferStock = async (req, res) => {
            try {
                const result = await this.warehouseService.transferStock(req.params.sourceWarehouseId, req.params.targetWarehouseId, Number(req.params.productId), req.body.quantity);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error transferring stock:', error);
                res.status(500).json({ error: 'Error transferring stock' });
            }
        };
        this.getWarehouseItemsByProductId = async (req, res) => {
            try {
                const productId = parseInt(req.params.productId, 10);
                if (isNaN(productId)) {
                    return res.status(400).json({ error: 'Invalid productId' });
                }
                const warehouseItems = await this.warehouseService.getWarehouseItemsByProductId(productId);
                if (!warehouseItems || warehouseItems.length === 0) {
                    return res.status(404).json({ message: 'No WarehouseItems found for the given productId' });
                }
                res.status(200).json(warehouseItems);
            }
            catch (error) {
                console.error('Error in getWarehouseItemsByProductId:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.updatePriceAndCost = async (req, res) => {
            try {
                const { itemId } = req.params;
                const { price, cost } = req.body;
                if (!price || !cost) {
                    return res.status(400).json({
                        error: 'Price and cost are required',
                        success: false
                    });
                }
                if (isNaN(Number(price)) || isNaN(Number(cost))) {
                    return res.status(400).json({
                        error: 'Price and cost must be valid numbers',
                        success: false
                    });
                }
                if (Number(price) < 0 || Number(cost) < 0) {
                    return res.status(400).json({
                        error: 'Price and cost must be positive numbers',
                        success: false
                    });
                }
                const updatedItem = await this.warehouseService.updatePriceAndCost(itemId, Number(price), Number(cost));
                res.status(200).json({
                    success: true,
                    message: 'Price and cost updated successfully',
                    data: updatedItem
                });
            }
            catch (error) {
                logger_1.logger.error('Error updating price and cost:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };
        this.warehouseService = new warehouseService_1.WarehouseService();
    }
}
exports.WarehouseController = WarehouseController;
