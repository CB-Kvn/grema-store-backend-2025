import { Router } from 'express';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body, query } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ExpenseController } from '../controllers/expenseController';

const router = Router();
const expenseController = new ExpenseController();

// Validation rules
const expenseValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isIn([
    'MATERIALS',
    'TOOLS',
    'MARKETING',
    'SALARIES',
    'RENT',
    'SERVICES',
    'OTHER'
  ]).withMessage('Invalid category'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
];

const dateRangeValidation = [
  query('startDate').isISO8601().withMessage('Valid start date is required'),
  query('endDate').isISO8601().withMessage('Valid end date is required'),
];

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/expenses');
    if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
    cb(null, uploadDir); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique name to avoid collisions
  },
});

const upload = multer({ storage });

// Routes
router.get('/', auth, expenseController.getAllExpenses);
router.get('/:id', auth, expenseController.getExpenseById);
router.post('/', [auth, restrictTo('ADMIN'), validate(expenseValidation)], expenseController.createExpense);
router.put('/:id', [auth, restrictTo('ADMIN'), validate(expenseValidation)], expenseController.updateExpense);
router.delete('/:id', [auth, restrictTo('ADMIN')], expenseController.deleteExpense);

// Additional Routes
router.get('/category/:category', auth, expenseController.getExpensesByCategory);
router.get(
  '/date-range',
  [auth, validate(dateRangeValidation)],
  expenseController.getExpensesByDateRange
);
router.get('/download', expenseController.downloadFile);

// Endpoint for file upload
router.post(
  '/upload',
  [auth, restrictTo('ADMIN'), upload.single('file')], // Middleware for authentication and single file upload
  expenseController.uploadFile
);

export default router;