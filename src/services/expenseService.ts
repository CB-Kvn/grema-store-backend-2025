import prisma from '../config/database';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';
// import { UploadedFile } from 'multer';


export class ExpenseService {
  async getAllExpenses() {
    try {
      return await prisma.expense.findMany({
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error in getAllExpenses:', error);
      throw error;
    }
  }

  async getExpenseById(id: string) {
    try {
      return await prisma.expense.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in getExpenseById: ${id}`, error);
      throw error;
    }
  }

  async createExpense(data: any) {
    try {
      return await prisma.expense.create({
        data,
      });
    } catch (error) {
      logger.error('Error in createExpense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, data: any) {
    try {
      return await prisma.expense.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error(`Error in updateExpense: ${id}`, error);
      throw error;
    }
  }

  async deleteExpense(id: string) {
    try {
      return await prisma.expense.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error in deleteExpense: ${id}`, error);
      throw error;
    }
  }

  async getExpensesByCategory(category: string) {
    try {
      return await prisma.expense.findMany({
        where: {
          category: category as any,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      logger.error(`Error in getExpensesByCategory: ${category}`, error);
      throw error;
    }
  }

  async getExpensesByDateRange(startDate: string, endDate: string) {
    try {
      return await prisma.expense.findMany({
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error in getExpensesByDateRange:', error);
      throw error;
    }
  }

  async getExpensesSummary() {
    try {
      const expenses = await prisma.expense.groupBy({
        by: ['category'],
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
      });

      return expenses.map(expense => ({
        category: expense.category,
        total: expense._sum.amount,
      }));
    } catch (error) {
      logger.error('Error in getExpensesSummary:', error);
      throw error;
    }
  }

  async saveFile(file: any): Promise<string> {
    try {
      // Devuelve la ruta relativa del archivo
      return `/uploads/expenses/${file.filename}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Error saving file');
    }
  }
}