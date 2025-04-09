import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/purchaseOrderController';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = Router();
const purchaseOrderController = new PurchaseOrderController();

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
router.get('/', auth, purchaseOrderController.getAllOrders);
router.get('/:id', auth, purchaseOrderController.getOrderById);
router.post('/', [auth, restrictTo('admin'), validate(orderValidation)], purchaseOrderController.createOrder);
router.put('/:id', [auth, restrictTo('admin'), validate(orderValidation)], purchaseOrderController.updateOrder);
router.delete('/:id', [auth, restrictTo('admin')], purchaseOrderController.deleteOrder);

// Document Routes
router.post(
  '/:orderId/documents',
  [auth, restrictTo('admin'), validate(documentValidation)],
  purchaseOrderController.addDocument
);

router.put(
  '/documents/:documentId',
  [auth, restrictTo('admin'), validate(documentValidation)],
  purchaseOrderController.updateDocument
);

export default router;