import prisma from '../config/database';

export class DiscountService {
  async getAll() {
    return prisma.discount.findMany();
  }

  async getGlobalDiscounts() {
    return prisma.discount.findMany({
      where: {
        isGlobal: true,
        isActive: true
      }
    });
  }

  async getById(id: number) {
    return prisma.discount.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.discount.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.discount.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.discount.delete({ where: { id } });
  }
}