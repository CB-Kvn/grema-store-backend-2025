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
    // Debug logging para entender la estructura
    logger.info('Creating order with data:', JSON.stringify(data, null, 2));
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Items array is required');
    }

    // Filtrar campos que no existen en el schema
    const {
      subtotalWithDiscounts,
      userDiscounts,
      appliedDiscounts,
      ...validOrderData
    } = data;

    // Usar userDiscounts como discount si existe
    const orderData = {
      ...validOrderData,
      discount: userDiscounts || data.discount || 0,
      // Si quieres guardar información adicional sobre descuentos, 
      // puedes agregarla a las notas
      notes: data.notes || (appliedDiscounts ? 
        `Descuentos aplicados: ${JSON.stringify(appliedDiscounts)}` : 
        undefined)
    };

    return await prisma.purchaseOrder.create({
      data: {
        ...orderData,
        items: {
          create: data.items.map((item: any) => {
            // Validar que el item tiene los datos necesarios
            if (!item.productId) {
              throw new Error(`Item is missing productId: ${JSON.stringify(item)}`);
            }
            
            if (!item.unitPrice) {
              throw new Error(`Item is missing unitPrice: ${JSON.stringify(item)}`);
            }

            return {
              productId: item.productId,
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice || (item.quantity * item.unitPrice),
              qtyDone: item.qtyDone || null,
              isGift: item.isGift || false,
              isBestSeller: item.isBestSeller || false,
              isNew: item.isNew || false,
              status: item.status || 'PENDING',
            };
          }),
        },
      },
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
    logger.error('Error in createOrder:', error);
    logger.error('Data received:', JSON.stringify(data, null, 2));
    throw error;
  }
}

  async updateOrder(id: string, data: any) {
  try {
    const { items, documents, ...orderData } = data;

    // Obtener los items y documentos existentes
    const existingOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: true,
        documents: true
      }
    });

    // 1. Manejar los items
    const itemsOperations = Array.isArray(items) ? items.map(item => {
      return prisma.orderItem.upsert({
        where: { 
          id: item.id || '', // Si no tiene id, se creará uno nuevo
          orderId: id
        },
        update: {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          qtyDone: item.qtyDone,
          isGift: item.isGift,
          isBestSeller: item.isBestSeller,
          isNew: item.isNew,
          status: item.status,
        },
        create: {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          qtyDone: item.qtyDone,
          isGift: item.isGift,
          isBestSeller: item.isBestSeller,
          isNew: item.isNew,
          status: item.status,
          orderId: id,
        }
      });
    }) : [];

    // 2. Manejar los documentos
    const documentsOperations = Array.isArray(documents) ? documents.map(doc => {
      return prisma.document.upsert({
        where: { 
          id: doc.id || '', // Si no tiene id, se creará uno nuevo
          orderId: id
        },
        update: {
          type: doc.type,
          title: doc.title,
          url: doc.url,
          uploadedAt: doc.uploadedAt,
          status: doc.status,
          hash: doc.hash,
          mimeType: doc.mimeType,
          size: doc.size,
        },
        create: {
          type: doc.type,
          title: doc.title,
          url: doc.url,
          uploadedAt: doc.uploadedAt,
          status: doc.status,
          hash: doc.hash,
          mimeType: doc.mimeType,
          size: doc.size,
          orderId: id,
        }
      });
    }) : [];

    // Ejecutar todas las operaciones en una transacción
    const [updatedOrder] = await prisma.$transaction([
      prisma.purchaseOrder.update({
        where: { id },
        data: orderData
      }),
      ...itemsOperations,
      ...documentsOperations
    ]);

    // Eliminar items/documents que no están en los nuevos arrays
    if (Array.isArray(items)) {
      const existingItemIds = existingOrder?.items.map(i => i.id) || [];
      const newItemIds = items.filter(i => i.id).map(i => i.id);
      const toDelete = existingItemIds.filter(id => !newItemIds.includes(id));
      
      if (toDelete.length > 0) {
        await prisma.orderItem.deleteMany({
          where: { id: { in: toDelete } }
        });
      }
    }

    if (Array.isArray(documents)) {
      const existingDocIds = existingOrder?.documents.map(d => d.id) || [];
      const newDocIds = documents.filter(d => d.id).map(d => d.id);
      const toDelete = existingDocIds.filter(id => !newDocIds.includes(id));
      
      if (toDelete.length > 0) {
        await prisma.document.deleteMany({
          where: { id: { in: toDelete } }
        });
      }
    }

    // Obtener la orden actualizada con sus relaciones
    return await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        documents: true,
      }
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

  async updateDocument(orderId: string, documentData: any) {
    try {

      if (!orderId) {
        throw new Error('Document ID is required for update');
      }

      prisma.document.deleteMany({
        where: { orderId: orderId }
      }).catch(error => {
        logger.error(`Error deleting document with ID ${documentData.id} for order ${orderId}:`, error);
      })

      return await prisma.document.updateMany({
        where: { id: orderId },
        data: documentData,
      });
    } catch (error) {
      logger.error(`Error in updateDocument: ${orderId}`, error);
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