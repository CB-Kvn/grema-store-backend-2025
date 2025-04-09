import prisma from '../config/database';
import { logger } from '../utils/logger';


export class PurchaseOrderService {
  async getAllOrders() {
    try {
      return await prisma.purchaseOrder.findMany({
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
          documents: true,
        },
      });
    } catch (error) {
      logger.error('Error in getAllOrders:', error);
      throw error;
    }
  }

  async getOrderById(id: string) {
    try {
      return await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
          documents: true,
        },
      });
    } catch (error) {
      logger.error(`Error in getOrderById: ${id}`, error);
      throw error;
    }
  }

  async createOrder(data: any) {
    try {
      return await prisma.purchaseOrder.create({
        data: {
          ...data,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in createOrder:', error);
      throw error;
    }
  }

  async updateOrder(id: string, data: any) {
    try {
      // Update items if provided
      if (data.items) {
        await prisma.orderItem.deleteMany({
          where: { orderId: id },
        });

        await prisma.orderItem.createMany({
          data: data.items.map((item: any) => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        });
      }

      return await prisma.purchaseOrder.update({
        where: { id },
        data: {
          ...data,
          items: undefined, // Handle items separately
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true,
            },
          },
          documents: true,
        },
      });
    } catch (error) {
      logger.error(`Error in updateOrder: ${id}`, error);
      throw error;
    }
  }

  async deleteOrder(id: string) {
    try {
      // Delete related records first
      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      await prisma.document.deleteMany({
        where: { orderId: id },
      });

      return await prisma.purchaseOrder.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in deleteOrder: ${id}`, error);
      throw error;
    }
  }

  async addDocument(orderId: string, documentData: any) {
    try {
      return await prisma.document.create({
        data: {
          ...documentData,
          orderId,
        },
      });
    } catch (error) {
      logger.error(`Error in addDocument for order: ${orderId}`, error);
      throw error;
    }
  }

  async updateDocument(documentId: string, documentData: any) {
    try {
      return await prisma.document.update({
        where: { id: documentId },
        data: documentData,
      });
    } catch (error) {
      logger.error(`Error in updateDocument: ${documentId}`, error);
      throw error;
    }
  }
}