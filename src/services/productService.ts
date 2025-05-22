import prisma from '../config/database';
import { logger } from '../utils/logger';

export class ProductService {
  async getAllProducts() {
    try {
      return await prisma.product.findMany({
        include: {
          WarehouseItem: {
            include: {
              discount: true, 
            },
          },
          Images: true, // Incluye la información de Images
        },
      });
    } catch (error) {
      logger.error('Error in getAllProducts:', error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: {
          WarehouseItem: {
            include: {
              discount: true, // Incluye la información de Discount
            },
          },
          Images: true,
        },
      });
    } catch (error) {
      logger.error(`Error in getProductById: ${id}`, error);
      throw error;
    }
  }

  async createProduct(data: any) {
    try {
      return await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          sku: data.sku,
          details: data.details,
        },
      });
    } catch (error) {
      logger.error('Error in createProduct:', error);
      throw error;
    }
  }

  async updateProduct(id: number, data: any) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          sku: data.sku,
          details: data.details,
        },
      });
    } catch (error) {
      logger.error(`Error in updateProduct: ${id}`, error);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      return await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in deleteProduct: ${id}`, error);
      throw error;
    }
  }

  async createProductsBulk(products: any[]) {
    try {
      // Valida que el array no esté vacío
      if (!products || products.length === 0) {
        throw new Error('No products provided for bulk creation');
      }

      // Crea los productos de forma masiva
      const createdProducts = await prisma.product.createMany({
        data: products.map((product) => ({
          name: product.name,
          description: product.description,
          category: product.category,
          sku: product.sku,
          details: product.details,
        })),
        skipDuplicates: true, // Evita errores por duplicados en campos únicos como `sku`
      });

      // Devuelve los productos creados
      return createdProducts;
    } catch (error) {
      logger.error('Error in createProductsBulk:', error);
      throw error;
    }
  }

  async createImage(data: { url: string; productId: number }) {
    
    return prisma.image.create({
      data: { url: data.url, productId: data.productId, state: true }
    });
  }
  async updateImage(id: number, url?: string, state?: boolean, productId?: number ) {
    return prisma.image.update({
      where: { id },
      data:{
        url: url,
        state: state,
        productId: productId
      },
    });
  }
  async deleteImage(id: number) {
    // Soft delete: set state to false
    return prisma.image.update({
      where: { id },
      data: { state: false },
    });
  }
}