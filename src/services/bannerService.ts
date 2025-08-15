import prisma from '../config/database';
import { CreateBannerData, UpdateBannerData, BannerStatus } from '../types';

export class BannerService {
  async getAll() {
    return prisma.banner.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getById(id: string) {
    return prisma.banner.findUnique({ 
      where: { id } 
    });
  }

  async getActive() {
    const now = new Date();
    return prisma.banner.findMany({
      where: {
        status: 'ACTIVE',
        dateInit: {
          lte: now
        },
        dateEnd: {
          gte: now
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async create(data: CreateBannerData) {
    return prisma.banner.create({ 
      data: {
        ...data,
        status: data.status || 'ACTIVE'
      }
    });
  }

  async update(id: string, data: UpdateBannerData) {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.banner.delete({ 
      where: { id } 
    });
  }

  async updateStatus(id: string, status: BannerStatus) {
    return prisma.banner.update({
      where: { id },
      data: { status }
    });
  }

  async getByStatus(status: BannerStatus) {
    return prisma.banner.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}