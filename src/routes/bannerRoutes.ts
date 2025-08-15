import { Router } from 'express';
import { BannerController } from '../controllers/bannerController';
import { auth, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { body, param } from 'express-validator';

const router = Router();
const bannerController = new BannerController();

// Validation rules for creating banners
const createBannerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('dateInit')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dateEnd')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dateInit)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('imageUrl')
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('URL must be a valid URL'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'EXPIRED'])
    .withMessage('Status must be ACTIVE, INACTIVE, or EXPIRED')
];

// Validation rules for updating banners
const updateBannerValidation = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('dateInit')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dateEnd')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.body.dateInit && new Date(value) <= new Date(req.body.dateInit)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL must be a valid URL'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'EXPIRED'])
    .withMessage('Status must be ACTIVE, INACTIVE, or EXPIRED')
];

// Validation for UUID parameters
const uuidValidation = [
  param('id')
    .isUUID()
    .withMessage('ID must be a valid UUID')
];

// Validation for status parameter
const statusValidation = [
  param('status')
    .isIn(['active', 'inactive', 'expired'])
    .withMessage('Status must be active, inactive, or expired')
];

// Validation for updating status
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['ACTIVE', 'INACTIVE', 'EXPIRED'])
    .withMessage('Status must be ACTIVE, INACTIVE, or EXPIRED')
];

// Public routes (no authentication required)
router.get('/active', bannerController.getActive.bind(bannerController));

// Protected routes (authentication required)
router.get('/', bannerController.getAll.bind(bannerController));

router.get('/status/:status', 
  statusValidation,
  validate,
  bannerController.getByStatus.bind(bannerController)
);

router.get('/:id', 
  uuidValidation,
  validate,
  bannerController.getById.bind(bannerController)
);

router.post('/', 
  createBannerValidation,
  validate,
  bannerController.create.bind(bannerController)
);

router.put('/:id', 
  uuidValidation,
  updateBannerValidation,
  validate,
  bannerController.update.bind(bannerController)
);

router.patch('/:id/status', 
  uuidValidation,
  updateStatusValidation,
  validate,
  bannerController.updateStatus.bind(bannerController)
);

router.delete('/:id', 
  uuidValidation,
  validate,
  bannerController.delete.bind(bannerController)
);

export default router;