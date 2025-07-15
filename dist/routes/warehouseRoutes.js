"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouseController_1 = require("../controllers/warehouseController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const warehouseController = new warehouseController_1.WarehouseController();
const warehouseValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('manager').notEmpty().withMessage('Manager is required'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('capacity').isInt({ min: 0 }).withMessage('Capacity must be a positive number'),
];
const stockValidation = [
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
];
router.get('/', warehouseController.getAllWarehouses);
router.get('/:id', warehouseController.getWarehouseById);
router.post('/', warehouseController.createWarehouse);
router.put('/:id', warehouseController.updateWarehouse);
router.delete('/:id', warehouseController.deleteWarehouse);
router.post('/:warehouseId/stock/:productId', warehouseController.addStock);
router.post('/remove/:warehouseId/stock/:productId', warehouseController.removeStock);
router.post('/transfer/:sourceWarehouseId/:targetWarehouseId/:productId', warehouseController.transferStock);
router.get('/warehouse-items/product/:productId', warehouseController.getWarehouseItemsByProductId);
exports.default = router;
