"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class ExpenseService {
    async getAllExpenses() {
        try {
            return await database_1.default.expense.findMany({
                where: {
                    state: true,
                },
                orderBy: {
                    date: 'desc',
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getAllExpenses:', error);
            throw error;
        }
    }
    async getExpenseById(id) {
        try {
            return await database_1.default.expense.findUnique({
                where: {
                    id,
                    state: true,
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in getExpenseById: ${id}`, error);
            throw error;
        }
    }
    async createExpense(data) {
        try {
            return await database_1.default.expense.create({
                data,
            });
        }
        catch (error) {
            logger_1.logger.error('Error in createExpense:', error);
            throw error;
        }
    }
    async updateExpense(id, data) {
        try {
            return await database_1.default.expense.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in updateExpense: ${id}`, error);
            throw error;
        }
    }
    async deleteExpense(id) {
        try {
            return await database_1.default.expense.update({
                where: { id },
                data: { state: false },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in deleteExpense: ${id}`, error);
            throw error;
        }
    }
    async getExpensesByCategory(category) {
        try {
            return await database_1.default.expense.findMany({
                where: {
                    category: category,
                    state: true,
                },
                orderBy: {
                    date: 'desc',
                },
            });
        }
        catch (error) {
            logger_1.logger.error(`Error in getExpensesByCategory: ${category}`, error);
            throw error;
        }
    }
    async getExpensesByDateRange(startDate, endDate) {
        try {
            return await database_1.default.expense.findMany({
                where: {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                    state: true,
                },
                orderBy: {
                    date: 'desc',
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in getExpensesByDateRange:', error);
            throw error;
        }
    }
    async getExpensesSummary() {
        try {
            const expenses = await database_1.default.expense.groupBy({
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
        }
        catch (error) {
            logger_1.logger.error('Error in getExpensesSummary:', error);
            throw error;
        }
    }
    async saveFile(file) {
        try {
            return `/uploads/expenses/${file.filename}`;
        }
        catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Error saving file');
        }
    }
}
exports.ExpenseService = ExpenseService;
