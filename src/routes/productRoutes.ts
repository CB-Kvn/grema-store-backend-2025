import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

const router = Router();
const productController = new ProductController();

// Validation rules
const productValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('images').isArray().withMessage('Images must be an array'),
  body('details').isObject().withMessage('Details must be an object'),
];

// Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', [auth, restrictTo('admin'), validate(productValidation)], productController.createProduct);
router.put('/:id', [auth, restrictTo('admin'), validate(productValidation)], productController.updateProduct);
router.delete('/:id', [auth, restrictTo('admin')], productController.deleteProduct);

export default router;