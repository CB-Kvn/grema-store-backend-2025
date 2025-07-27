import prisma from '../config/database';
import { logger } from '../utils/logger';


export class WarehouseService {
  async getAllWarehouses() {
    try {
      const warehouses = await prisma.warehouse.findMany({
        include: { items: true }
      });

      // Agrega la propiedad ocupacion sumando quantity de items
      return warehouses.map(w => ({
        ...w,
        ocupacion: w.items.reduce((acc, item) => acc + item.quantity, 0)
      }));
    } catch (error) {
      logger.error('Error in getAllWarehouses:', error);
      throw error;
    }
  }

  async getWarehouseById(id: string) {
    try {
      return await prisma.warehouse.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
              movements: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error(`Error in getWarehouseById: ${id}`, error);
      throw error;
    }
  }

  async createWarehouse(data: any) {
    try {
      return await prisma.warehouse.create({
        data: {
          name: data.name,
          location: data.location,
          address: data.address,
          manager: data.manager,
          phone: data.phone,
          email: data.email,
          capacity: data.capacity,
          currentOccupancy: data.currentOccupancy ?? 0,
          status: data.status ?? 'ACTIVE',
          lastInventoryDate: data.lastInventoryDate ?? null,
          notes: data.notes ?? null,
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      logger.error('Error in createWarehouse:', error);
      throw error;
    }
  }

  async updateWarehouse(id: string, data: any) {
    try {
      return await prisma.warehouse.update({
        where: { id },
        data: {
          ...data,
          items: undefined, // Handle items separately to avoid conflicts
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      logger.error(`Error in updateWarehouse: ${id}`, error);
      throw error;
    }
  }

  async deleteWarehouse(id: string) {
    try {
      // First delete related items due to foreign key constraint
      await prisma.warehouseItem.deleteMany({
        where: { warehouseId: id },
      });

      return await prisma.warehouse.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in deleteWarehouse: ${id}`, error);
      throw error;
    }
  }

  async getWarehouseItemsByProductId(productId: number) {
    try {
      return await prisma.warehouseItem.findMany({
        where: { productId },
        include: {
          warehouse: true,
          product: true
        },
      });
    } catch (error) {
      console.error('Error in getWarehouseItemsByProductId:', error);
      throw error;
    }
  }

  async addStock(warehouseId: string, productId: number, quantity: number, location: string) {
    try {
      const item = await prisma.warehouseItem.findFirst({
        where: {
          warehouseId,
          productId,
        },
      });

      if (item) {
        // Actualiza el item existente
        const updatedItem = await prisma.warehouseItem.update({
          where: { id: item.id },
          data: {

            quantity: item.quantity + quantity,
            status: this.calculateStockStatus(quantity, item.minimumStock),
          },
        });

        // Crea un registro de movimiento de stock
        await prisma.stockMovement.create({
          data: {
            itemId: item.id,
            type: 'IN',
            quantity,
            userId: 'system', // Reemplaza con el ID del usuario real
          },
        });

        return updatedItem;
      } else {
        // Crea un nuevo item
        const newItem = await prisma.warehouseItem.create({
          data: {
            warehouseId,
            productId,
            quantity,
            location,
            minimumStock: 0, // Establece un valor predeterminado o acepta como parámetro
            status: 'IN_STOCK',
          },
        });

        // Crea un registro de movimiento de stock
        await prisma.stockMovement.create({
          data: {
            itemId: newItem.id,
            type: 'IN',
            quantity,
            userId: 'system', // Reemplaza con el ID del usuario real
          },
        });

        return newItem;
      }
    } catch (error) {
      logger.error('Error in addStock:', error);
      throw error;
    }
  }

  async removeStock(warehouseId: string, productId: number, quantity: number) {
    try {
      const item = await prisma.warehouseItem.findFirst({
        where: {
          warehouseId,
          productId,
        },
      });

      if (!item) {
        throw new Error('Item not found in warehouse');
      }

      if (item.quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      const updatedItem = await prisma.warehouseItem.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity - quantity,
          status: this.calculateStockStatus(item.quantity - quantity, item.minimumStock),
        },
      });

      // Create movement record
      await prisma.stockMovement.create({
        data: {
          itemId: item.id,
          type: 'OUT',
          quantity,
          userId: 'system', // Replace with actual user ID
        },
      });

      return updatedItem;
    } catch (error) {
      logger.error('Error in removeStock:', error);
      throw error;
    }
  }

  async transferStock(
    sourceWarehouseId: string,
    targetWarehouseId: string,
    productId: number,
    quantity: number
  ) {
    try {
      // Start transaction
      return await prisma.$transaction(async (prisma) => {
        // Get the source item to retrieve price and cost information
        const sourceItem = await prisma.warehouseItem.findFirst({
          where: {
            warehouseId: sourceWarehouseId,
            productId,
          },
          select: {
            id: true,
            location: true,
            price: true,
            cost: true,
            quantity: true,
          },
        });

        if (!sourceItem) {
          throw new Error('Source item not found');
        }

        // Remove from source
        await this.removeStock(sourceWarehouseId, productId, quantity);

        // Add to target with the same price and cost from source
        await this.addStock(targetWarehouseId, productId, quantity, sourceItem.location);

        return { success: true, message: 'Stock transferred successfully' };
      });
    } catch (error) {
      logger.error('Error in transferStock:', error);
      throw error;
    }
  }

  async updatePriceAndCost(itemId: string, price: number, cost: number) {
    try {
      const updatedItem = await prisma.warehouseItem.updateMany({
        where: { productId: Number(itemId) },
        data: {
          price,
          cost,
        },
      });

      logger.info(`Price and cost updated for item: ${itemId}`);
      return updatedItem;
    } catch (error) {
      logger.error('Error in updatePriceAndCost:', error);
      throw error;
    }
  }

  private calculateStockStatus(quantity: number, minimumStock: number) {
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity <= minimumStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  }
}