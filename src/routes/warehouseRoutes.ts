import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouseController';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = Router();
const warehouseController = new WarehouseController();

// Validation rules
const warehouseValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('manager').notEmpty().withMessage('Manager is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('capacity').isInt({ min: 0 }).withMessage('Capacity must be a positive number'),
];

const stockValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
  body('location').notEmpty().withMessage('Location is required'),
];

// Routes
router.get('/', auth, warehouseController.getAllWarehouses);
router.get('/:id', auth, warehouseController.getWarehouseById);
router.post('/', [auth, restrictTo('admin'), validate(warehouseValidation)], warehouseController.createWarehouse);
router.put('/:id', [auth, restrictTo('admin'), validate(warehouseValidation)], warehouseController.updateWarehouse);
router.delete('/:id', [auth, restrictTo('admin')], warehouseController.deleteWarehouse);

// Stock Management Routes
router.post(
  '/:warehouseId/stock/:productId',
  [auth, restrictTo('admin'), validate(stockValidation)],
  warehouseController.addStock
);

router.delete(
  '/:warehouseId/stock/:productId',
  [auth, restrictTo('admin'), validate([body('quantity').isInt({ min: 1 })])],
  warehouseController.removeStock
);

router.post(
  '/transfer/:sourceWarehouseId/:targetWarehouseId/:productId',
  [auth, restrictTo('admin'), validate([body('quantity').isInt({ min: 1 })])],
  warehouseController.transferStock
);

export default router;