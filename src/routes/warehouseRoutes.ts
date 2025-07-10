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
router.get('/',  warehouseController.getAllWarehouses);
router.get('/:id',  warehouseController.getWarehouseById);
router.post('/', warehouseController.createWarehouse);
router.put('/:id', warehouseController.updateWarehouse);
router.delete('/:id', warehouseController.deleteWarehouse);

// Stock Management Routes
router.post(
  '/:warehouseId/stock/:productId',
  warehouseController.addStock
);

router.post(
  '/remove/:warehouseId/stock/:productId',
  warehouseController.removeStock
);

router.post(
  '/transfer/:sourceWarehouseId/:targetWarehouseId/:productId',
  warehouseController.transferStock
);

router.get('/warehouse-items/product/:productId', warehouseController.getWarehouseItemsByProductId);

export default router;