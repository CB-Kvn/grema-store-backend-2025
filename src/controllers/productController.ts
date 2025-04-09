import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { logger } from '../utils/logger';


export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      logger.error('Error getting products:', error);
      res.status(500).json({ error: 'Error getting products' });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      logger.error('Error getting product:', error);
      res.status(500).json({ error: 'Error getting product' });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({ error: 'Error creating product' });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product' });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({ error: 'Error deleting product' });
    }
  };
}