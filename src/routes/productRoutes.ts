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
  // body('images').isArray().withMessage('Images must be an array'),
  body('details').isObject().withMessage('Details must be an object'),
];

// Validation rules for bulk creation
const bulkProductValidation = [
  body().isArray().withMessage('Request body must be an array of products'),
  body('*.name').notEmpty().withMessage('Name is required for each product'),
  body('*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number for each product'),
  body('*.description').notEmpty().withMessage('Description is required for each product'),
  body('*.category').notEmpty().withMessage('Category is required for each product'),
  body('*.sku').notEmpty().withMessage('SKU is required for each product'),
  // body('*.images').isArray().withMessage('Images must be an array for each product'),
  body('*.details').isObject().withMessage('Details must be an object for each product'),
];

// Routes
router.get('/', productController.getAllProducts);
router.get('/latest', productController.getLatestProducts);
router.get('/best-sellers', productController.getBestSellingProducts);
router.get('/:id', productController.getProductById);
router.post('/',  productController.createProduct);
router.put('/:id',  productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/bulk', productController.createProductsBulk);
router.post('/image-create', productController.createImage);
router.post('/image-update', productController.updateImage);
router.delete('/image-delete/:id', productController.deleteImage);
export default router;