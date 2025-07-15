"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const expenseController_1 = require("../controllers/expenseController");
const router = (0, express_1.Router)();
const expenseController = new expenseController_1.ExpenseController();
const expenseValidation = [
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    (0, express_validator_1.body)('category').isIn([
        'MATERIALS',
        'TOOLS',
        'MARKETING',
        'SALARIES',
        'RENT',
        'SERVICES',
        'OTHER'
    ]).withMessage('Invalid category'),
    (0, express_validator_1.body)('paymentMethod').notEmpty().withMessage('Payment method is required'),
];
const dateRangeValidation = [
    (0, express_validator_1.query)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.query)('endDate').isISO8601().withMessage('Valid end date is required'),
];
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/expenses');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/category/:category', auth_1.auth, expenseController.getExpensesByCategory);
router.get('/date-range', expenseController.getExpensesByDateRange);
router.get('/file/download', expenseController.downloadFile);
router.post('/upload', upload.single('file'), expenseController.uploadFile);
exports.default = router;
