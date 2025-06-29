import prisma from '../config/database';
import { logger } from '../utils/logger';


export class PurchaseOrderService {
  async getAllOrders() {
    try {
      return await prisma.purchaseOrder.findMany({
        include: {
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
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.product.WarehouseItem[0].price,
              totalPrice: item.quantity * item.product.WarehouseItem[0].price,
            })),
          },
        },
        // include: {
        //   items: {
        //     include: {
        //       product: true,
        //     },
        //   },
        // },
      });
    } catch (error) {
      logger.error('Error in createOrder:', error);
      throw error;
    }
  }

  async updateOrder(id: string, data: any) {
    try {
      const { items, documents, ...orderData } = data;

      // 1. Elimina todos los items actuales (para evitar violar la relación requerida)
      if (Array.isArray(items)) {
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
      }

      // 2. Elimina todos los documentos actuales si los vas a reemplazar
      if (Array.isArray(documents)) {
        await prisma.document.deleteMany({ where: { orderId: id } });
      }

      // 3. Actualiza la orden y crea los nuevos items/documents
      return await prisma.purchaseOrder.update({
        where: { id },
        data: {
          ...orderData,
          ...(Array.isArray(items) && {
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                qtyDone: item.qtyDone,
                isGift: item.isGift,
                isBestSeller: item.isBestSeller,
                isNew: item.isNew,
                status: item.status,
              })),
            }
          }),
          ...(Array.isArray(documents) && {
            documents: {
              create: documents.map((doc: any) => ({
                type: doc.type,
                title: doc.title,
                url: doc.url,
                uploadedAt: doc.uploadedAt,
                status: doc.status,
                hash: doc.hash,
                mimeType: doc.mimeType,
                size: doc.size,
              })),
            }
          }),
        },
        include: {
          items: { include: { product: true } },
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

  async saveFile(file: any): Promise<string> {
    try {
      // Devuelve la ruta relativa del archivo
      console.log('Saving file:', file);
      return `/uploads/vouchers/${file.filename}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Error saving file');
    }
  }
}