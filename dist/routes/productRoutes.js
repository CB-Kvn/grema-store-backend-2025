"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const productController = new productController_1.ProductController();
const productValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('sku').notEmpty().withMessage('SKU is required'),
    (0, express_validator_1.body)('details').isObject().withMessage('Details must be an object'),
];
const bulkProductValidation = [
    (0, express_validator_1.body)().isArray().withMessage('Request body must be an array of products'),
    (0, express_validator_1.body)('*.name').notEmpty().withMessage('Name is required for each product'),
    (0, express_validator_1.body)('*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number for each product'),
    (0, express_validator_1.body)('*.description').notEmpty().withMessage('Description is required for each product'),
    (0, express_validator_1.body)('*.category').notEmpty().withMessage('Category is required for each product'),
    (0, express_validator_1.body)('*.sku').notEmpty().withMessage('SKU is required for each product'),
    (0, express_validator_1.body)('*.details').isObject().withMessage('Details must be an object for each product'),
];
router.get('/', productController.getAllProducts);
router.get('/latest', productController.getLatestProducts);
router.get('/best-sellers', productController.getBestSellingProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/pending-quantity', productController.getPendingOrderQuantity);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/bulk', productController.createProductsBulk);
router.post('/image-create', productController.createImage);
router.post('/image-update', productController.updateImage);
router.delete('/image-delete/:id', productController.deleteImage);
exports.default = router;
