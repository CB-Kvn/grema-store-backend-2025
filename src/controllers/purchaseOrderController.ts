import { Request, Response } from 'express';
import { PurchaseOrderService } from '../services/purchaseOrderService';
import { logger } from '../utils/logger';


export class PurchaseOrderController {
  private purchaseOrderService: PurchaseOrderService;

  constructor() {
    this.purchaseOrderService = new PurchaseOrderService();
  }

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.purchaseOrderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      logger.error('Error getting orders:', error);
      res.status(500).json({ error: 'Error getting orders' });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await this.purchaseOrderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      logger.error('Error getting order:', error);
      res.status(500).json({ error: 'Error getting order' });
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.purchaseOrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      logger.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  };

  updateOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.purchaseOrderService.updateOrder(
        req.params.id,
        req.body
      );
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      logger.error('Error updating order:', error);
      res.status(500).json({ error: 'Error updating order' });
    }
  };

  deleteOrder = async (req: Request, res: Response) => {
    try {
      await this.purchaseOrderService.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting order:', error);
      res.status(500).json({ error: 'Error deleting order' });
    }
  };

  // Document Management
  addDocument = async (req: Request, res: Response) => {
    try {
      const document = await this.purchaseOrderService.addDocument(
        req.params.orderId,
        req.body
      );
      res.status(201).json(document);
    } catch (error) {
      logger.error('Error adding document:', error);
      res.status(500).json({ error: 'Error adding document' });
    }
  };

  updateDocument = async (req: Request, res: Response) => {
    try {
      const document = await this.purchaseOrderService.updateDocument(
        req.params.documentId,
        req.body
      );
      res.json(document);
    } catch (error) {
      logger.error('Error updating document:', error);
      res.status(500).json({ error: 'Error updating document' });
    }
  };

  uploadFile = async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }
  
        const filePath = await this.purchaseOrderService.saveFile(req.file);
        res.status(200).json({ message: 'File uploaded successfully', filePath });
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
  
      }
  
    }
}