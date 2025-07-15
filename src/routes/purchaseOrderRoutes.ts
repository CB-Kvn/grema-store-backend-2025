import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/purchaseOrderController';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const purchaseOrderController = new PurchaseOrderController();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/purchaseOrders');
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


// Validation rules
const orderValidation = [
  body('supplierId').notEmpty().withMessage('Supplier ID is required'),
  body('orderNumber').notEmpty().withMessage('Order number is required'),
  body('expectedDeliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').isInt().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
];

const documentValidation = [
  body('type').isIn(['INVOICE', 'RECEIPT', 'DELIVERY_NOTE', 'OTHER']).withMessage('Invalid document type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('url').isURL().withMessage('Valid URL is required'),
];

// Routes
router.get('/', purchaseOrderController.getAllOrders);
router.get('/:id', purchaseOrderController.getOrderById);
router.post('/', purchaseOrderController.createOrder);
router.put('/:id', purchaseOrderController.updateOrder);
router.delete('/:id', purchaseOrderController.deleteOrder);

// Document Routes

router.post(
  '/:orderId/documents',
  purchaseOrderController.addDocument
);

router.put(
  '/:orderId/documents/',
  purchaseOrderController.updateDocument
);

router.post(
  '/upload',
  upload.single('file'),
  purchaseOrderController.uploadFile
);

router.post('/uploadReceipt', upload.single('file'), purchaseOrderController.uploadFileReceipt);

export default router;