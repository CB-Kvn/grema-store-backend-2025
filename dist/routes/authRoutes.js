"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('role').optional().isIn(['USER', 'ADMIN']).withMessage('Invalid role'),
];
router.post('/login', (0, validate_1.validate)(loginValidation), authController_1.AuthController.login);
router.post('/register', (0, validate_1.validate)(registerValidation), authController_1.AuthController.register);
router.post('/google-login', authController_1.AuthController.googleLogin);
router.get('/authenticate', [auth_middleware_1.authenticateToken], authController_1.AuthController.authController);
router.get('/users-all', authController_1.AuthController.getAll.bind(authController_1.AuthController));
router.put('/user/:id', authController_1.AuthController.update.bind(authController_1.AuthController));
exports.default = router;
