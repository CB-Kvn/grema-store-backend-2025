import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouseService';
import { logger } from '../utils/logger';


export class WarehouseController {
  private warehouseService: WarehouseService;

  constructor() {
    this.warehouseService = new WarehouseService();
  }

  getAllWarehouses = async (req: Request, res: Response) => {
    try {
      const warehouses = await this.warehouseService.getAllWarehouses();
      res.json(warehouses);
    } catch (error) {
      logger.error('Error getting warehouses:', error);
      res.status(500).json({ error: 'Error getting warehouses' });
    }
  };

  getWarehouseById = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.getWarehouseById(req.params.id);
      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found' });
      }
      res.json(warehouse);
    } catch (error) {
      logger.error('Error getting warehouse:', error);
      res.status(500).json({ error: 'Error getting warehouse' });
    }
  };

  createWarehouse = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.createWarehouse(req.body);
      res.status(201).json(warehouse);
    } catch (error) {
      logger.error('Error creating warehouse:', error);
      res.status(500).json({ error: 'Error creating warehouse' });
    }
  };

  updateWarehouse = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.updateWarehouse(
        req.params.id,
        req.body
      );
      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found' });
      }
      res.json(warehouse);
    } catch (error) {
      logger.error('Error updating warehouse:', error);
      res.status(500).json({ error: 'Error updating warehouse' });
    }
  };

  deleteWarehouse = async (req: Request, res: Response) => {
    try {
      await this.warehouseService.deleteWarehouse(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting warehouse:', error);
      res.status(500).json({ error: 'Error deleting warehouse' });
    }
  };

  // Stock Management
  addStock = async (req: Request, res: Response) => {
    try {
      const result = await this.warehouseService.addStock(
        req.params.warehouseId,
        Number(req.params.productId),
        req.body.quantity,
        req.body.location,
      );
      res.json(result);
    } catch (error) {
      logger.error('Error adding stock:', error);
      res.status(500).json({ error: 'Error adding stock' });
    }
  };

  removeStock = async (req: Request, res: Response) => {
    try {
      const result = await this.warehouseService.removeStock(
        req.params.warehouseId,
        Number(req.params.productId),
        req.body.quantity
      );
      res.json(result);
    } catch (error) {
      logger.error('Error removing stock:', error);
      res.status(500).json({ error: 'Error removing stock' });
    }
  };

  transferStock = async (req: Request, res: Response) => {
    try {
      const result = await this.warehouseService.transferStock(
        req.params.sourceWarehouseId,
        req.params.targetWarehouseId,
        Number(req.params.productId),
        req.body.quantity
      );
      res.json(result);
    } catch (error) {
      logger.error('Error transferring stock:', error);
      res.status(500).json({ error: 'Error transferring stock' });
    }
  };

  getWarehouseItemsByProductId = async (req: Request, res: Response) => {
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
    } catch (error) {
      console.error('Error in getWarehouseItemsByProductId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update price and cost for a specific warehouse item
  updatePriceAndCost = async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { price, cost } = req.body;

      // Validaciones
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

      const updatedItem = await this.warehouseService.updatePriceAndCost(
        itemId,
        Number(price),
        Number(cost)
      );

      res.status(200).json({
        success: true,
        message: 'Price and cost updated successfully',
        data: updatedItem
      });
    } catch (error) {
      logger.error('Error updating price and cost:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

}