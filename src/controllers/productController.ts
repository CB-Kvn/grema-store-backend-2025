import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

const productService = new ProductService();

export class ProductController {
  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error getting products' });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error getting product' });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await productService.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      await productService.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async createProductsBulk(req: Request, res: Response) {
    try {
      const products = req.body;

      // Llama al servicio para crear productos de forma masiva
      const createdProducts = await productService.createProductsBulk(products);

      res.status(201).json({
        message: 'Products created successfully',
        count: createdProducts.count,
        products: createdProducts,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to create products',
        details: error.message,
      });
    }
  }
}