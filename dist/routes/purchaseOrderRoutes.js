"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseOrderController_1 = require("../controllers/purchaseOrderController");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const purchaseOrderController = new purchaseOrderController_1.PurchaseOrderController();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/purchaseOrders');
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
const orderValidation = [
    (0, express_validator_1.body)('supplierId').notEmpty().withMessage('Supplier ID is required'),
    (0, express_validator_1.body)('orderNumber').notEmpty().withMessage('Order number is required'),
    (0, express_validator_1.body)('expectedDeliveryDate').isISO8601().withMessage('Valid delivery date is required'),
    (0, express_validator_1.body)('items').isArray().withMessage('Items must be an array'),
    (0, express_validator_1.body)('items.*.productId').isInt().withMessage('Valid product ID is required'),
    (0, express_validator_1.body)('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
    (0, express_validator_1.body)('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
];
const documentValidation = [
    (0, express_validator_1.body)('type').isIn(['INVOICE', 'RECEIPT', 'DELIVERY_NOTE', 'OTHER']).withMessage('Invalid document type'),
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('url').isURL().withMessage('Valid URL is required'),
];
router.get('/', purchaseOrderController.getAllOrders);
router.get('/:id', purchaseOrderController.getOrderById);
router.post('/', purchaseOrderController.createOrder);
router.put('/:id', purchaseOrderController.updateOrder);
router.delete('/:id', purchaseOrderController.deleteOrder);
router.post('/:orderId/documents', purchaseOrderController.addDocument);
router.put('/:orderId/documents/', purchaseOrderController.updateDocument);
router.post('/upload', upload.single('file'), purchaseOrderController.uploadFile);
router.post('/uploadReceipt', upload.single('file'), purchaseOrderController.uploadFileReceipt);
exports.default = router;
