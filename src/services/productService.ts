import prisma from '../config/database';
import { logger } from '../utils/logger';

export class ProductService {
  async getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      include: {
        WarehouseItem: true,
        Images: true,
      },
    });

    // Filtra las imágenes por state === true
    return products.map(product => ({
      ...product,
      Images: product.Images ? product.Images.filter(img => img.state === true) : [],
    }));
  } catch (error) {
    logger.error('Error in getAllProducts:', error);
    throw error;
  }
}
  async getProductById(id: number) {
    try {
      return await prisma.product.findUnique({
        where: { id, available: true },
        include: {
          WarehouseItem: true,
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
      return await prisma.product.update({
        where: { id },
        data: { available: false },
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
  async updateImage(id: number | null | undefined, url?: string, state?: boolean, productId?: number) {
    // Si el id no es un número válido, crea la imagen
    if (!id || typeof id !== 'number' || isNaN(id)) {
      return prisma.image.create({
        data: {
          url: url ?? '',
          state: state ?? true,
          productId: productId!
        }
      });
    }

    // Si el id es válido, intenta actualizar
    try {
      return await prisma.image.update({
        where: { id },
        data: {
          url,
          state,
          productId
        },
      });
    } catch (error: any) {
      // Si no existe, la crea
      if (error.code === 'P2025') {
        return prisma.image.create({
          data: {
            id,
            url: url ?? '',
            state: state ?? true,
            productId: productId!
          }
        });
      }
      throw error;
    }
  }
  async deleteImage(id: number) {
    // Soft delete: set state to false
    return prisma.image.update({
      where: { id },
      data: { state: false },
    });
  }
  async getLatestProducts(limit: number = 12) {
    try {
      return await prisma.product.findMany({
        where: { available: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          WarehouseItem: true,
          Images: true,
        },
      });
    } catch (error) {
      logger.error('Error in getLatestProducts:', error);
      throw error;
    }
  }
  async getBestSellingProducts(limit: number = 12) {
    // Consulta los productos más vendidos usando OrderItem
    const bestSellers = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    if (bestSellers.length === 0) {
      // Si no hay ventas, devuelve productos aleatorios
      return prisma.product.findMany({
        where: { available: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          WarehouseItem: true,
          Images: true,
        },
      });
    }

    // Obtiene los productos más vendidos por sus IDs
    const productIds = bestSellers.map((item) => item.productId);
    return prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
      include: {
        WarehouseItem: true,
        Images: true,
      },
    });
  }
  async getPendingOrderQuantity(productId: number) {
    // Considera órdenes que NO estén enviadas ni entregadas
    const orderItems = await prisma.orderItem.findMany({
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

    // Suma las cantidades
    const total = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    return total;
  }
}