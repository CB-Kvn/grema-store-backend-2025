import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';
import { logger } from '../utils/logger';
import path from 'path';

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor() {
    this.expenseService = new ExpenseService();
  }

  getAllExpenses = async (req: Request, res: Response) => {
    try {
      const expenses = await this.expenseService.getAllExpenses();
      res.json(expenses);
    } catch (error) {
      logger.error('Error getting expenses:', error);
      res.status(500).json({ error: 'Error getting expenses' });
    }
  };

  getExpenseById = async (req: Request, res: Response) => {
    try {
      const expense = await this.expenseService.getExpenseById(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
    } catch (error) {
      logger.error('Error getting expense:', error);
      res.status(500).json({ error: 'Error getting expense' });
    }
  };

  createExpense = async (req: Request, res: Response) => {
    try {
      const expense = await this.expenseService.createExpense(req.body);
      res.status(201).json(expense);
    } catch (error) {
      logger.error('Error creating expense:', error);
      res.status(500).json({ error: 'Error creating expense' });
    }
  };

  updateExpense = async (req: Request, res: Response) => {
    try {
      const expense = await this.expenseService.updateExpense(
        req.params.id,
        req.body
      );
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
    } catch (error) {
      logger.error('Error updating expense:', error);
      res.status(500).json({ error: 'Error updating expense' });
    }
  };

  deleteExpense = async (req: Request, res: Response) => {
    try {
      await this.expenseService.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Error deleting expense' });
    }
  };

  getExpensesByCategory = async (req: Request, res: Response) => {
    try {
      const expenses = await this.expenseService.getExpensesByCategory(
        req.params.category
      );
      res.json(expenses);
    } catch (error) {
      logger.error('Error getting expenses by category:', error);
      res.status(500).json({ error: 'Error getting expenses by category' });
    }
  };

  getExpensesByDateRange = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const expenses = await this.expenseService.getExpensesByDateRange(
        startDate as string,
        endDate as string
      );
      res.json(expenses);
    } catch (error) {
      logger.error('Error getting expenses by date range:', error);
      res.status(500).json({ error: 'Error getting expenses by date range' });
    }
  };
   downloadFile = async  (req: Request, res: Response): Promise<void> => {
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    try {
      const { filePath } = req.query;

      if (!filePath || typeof filePath !== 'string') {
        res.status(400).json({ error: 'File path is required' });
      }

      const fileExtension = path.extname(filePath as string);
      if (!allowedExtensions.includes(fileExtension)) {
        res.status(400).json({ error: 'Invalid file type' });
      }

      const absolutePath = path.join(__dirname, '../..', filePath as string);

      res.download(absolutePath, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Error downloading file' });
        }
      });
    } catch (error) {
      console.error('Error in downloadFile:', error);
      res.status(500).json({ error: 'Error processing request' });
    }
  }
}