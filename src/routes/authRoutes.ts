import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';

const router = Router();

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['USER', 'ADMIN']).withMessage('Invalid role'),
];

router.post('/login', validate(loginValidation), AuthController.login);
router.post('/register', validate(registerValidation), AuthController.register);

export default router;