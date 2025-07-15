"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expenseService_1 = require("../services/expenseService");
const logger_1 = require("../utils/logger");
const expenseService = new expenseService_1.ExpenseService();
const path_1 = __importDefault(require("path"));
const otherKitService_1 = __importDefault(require("../services/otherKitService"));
const promises_1 = __importDefault(require("fs/promises"));
class ExpenseController {
    constructor() {
        this.getAllExpenses = async (req, res) => {
            try {
                const expenses = await this.expenseService.getAllExpenses();
                res.json(expenses);
            }
            catch (error) {
                logger_1.logger.error('Error getting expenses:', error);
                res.status(500).json({ error: 'Error getting expenses' });
            }
        };
        this.getExpenseById = async (req, res) => {
            try {
                const expense = await this.expenseService.getExpenseById(req.params.id);
                if (!expense) {
                    return res.status(404).json({ error: 'Expense not found' });
                }
                res.json(expense);
            }
            catch (error) {
                logger_1.logger.error('Error getting expense:', error);
                res.status(500).json({ error: 'Error getting expense' });
            }
        };
        this.createExpense = async (req, res) => {
            try {
                const expense = await this.expenseService.createExpense(req.body);
                res.status(201).json(expense);
            }
            catch (error) {
                logger_1.logger.error('Error creating expense:', error);
                res.status(500).json({ error: 'Error creating expense' });
            }
        };
        this.updateExpense = async (req, res) => {
            try {
                const expense = await this.expenseService.updateExpense(req.params.id, req.body);
                if (!expense) {
                    return res.status(404).json({ error: 'Expense not found' });
                }
                res.json(expense);
            }
            catch (error) {
                logger_1.logger.error('Error updating expense:', error);
                res.status(500).json({ error: 'Error updating expense' });
            }
        };
        this.deleteExpense = async (req, res) => {
            try {
                await this.expenseService.deleteExpense(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting expense:', error);
                res.status(500).json({ error: 'Error deleting expense' });
            }
        };
        this.getExpensesByCategory = async (req, res) => {
            try {
                const expenses = await this.expenseService.getExpensesByCategory(req.params.category);
                res.json(expenses);
            }
            catch (error) {
                logger_1.logger.error('Error getting expenses by category:', error);
                res.status(500).json({ error: 'Error getting expenses by category' });
            }
        };
        this.getExpensesByDateRange = async (req, res) => {
            try {
                const { startDate, endDate } = req.query;
                const expenses = await this.expenseService.getExpensesByDateRange(startDate, endDate);
                res.json(expenses);
            }
            catch (error) {
                logger_1.logger.error('Error getting expenses by date range:', error);
                res.status(500).json({ error: 'Error getting expenses by date range' });
            }
        };
        this.uploadFile = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No files uploaded' });
                    return;
                }
                const folderName = 'expenses_files';
                const response = await this.othersKitService.upload(req.file.path, { folder: folderName });
                await promises_1.default.unlink(req.file.path);
                res.status(200).json(response);
            }
            catch (error) {
                res.status(500).json({ message: 'Error uploading file', error });
            }
        };
        this.expenseService = new expenseService_1.ExpenseService();
        this.othersKitService = new otherKitService_1.default();
    }
    async downloadFile(req, res) {
        const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
        try {
            const { filePath } = req.query;
            if (!filePath || typeof filePath !== 'string') {
                res.status(400).json({ error: 'File path is required' });
            }
            const fileExtension = path_1.default.extname(filePath);
            if (!allowedExtensions.includes(fileExtension)) {
                res.status(400).json({ error: 'Invalid file type' });
            }
            const absolutePath = path_1.default.join(__dirname, '../..', filePath);
            res.download(absolutePath, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).json({ error: 'Error downloading file' });
                }
            });
        }
        catch (error) {
            console.error('Error in downloadFile:', error);
            res.status(500).json({ error: 'Error processing request' });
        }
    }
}
exports.ExpenseController = ExpenseController;
