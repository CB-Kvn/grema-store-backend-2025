import prisma from '../config/database';
import { logger } from '../utils/logger';


export class ProductService {
  async getAllProducts() {
    try {
      return await prisma.product.findMany({
        include: {
          images: true,
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
          images: true,
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
          ...data,
          images: {
            create: data.images.map((url: string) => ({ url })),
          },
        },
        include: {
          images: true,
        },
      });
    } catch (error) {
      logger.error('Error in createProduct:', error);
      throw error;
    }
  }

  async updateProduct(id: number, data: any) {
    try {
      // First, delete existing images if new ones are provided
      if (data.images) {
        await prisma.image.deleteMany({
          where: { productId: id },
        });
      }

      return await prisma.product.update({
        where: { id },
        data: {
          ...data,
          images: data.images ? {
            create: data.images.map((url: string) => ({ url })),
          } : undefined,
        },
        include: {
          images: true,
        },
      });
    } catch (error) {
      logger.error(`Error in updateProduct: ${id}`, error);
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      // First delete related images due to foreign key constraint
      await prisma.image.deleteMany({
        where: { productId: id },
      });

      return await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in deleteProduct: ${id}`, error);
      throw error;
    }
  }
}