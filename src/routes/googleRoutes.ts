import { Router } from 'express';
import { googleController } from '../controllers/googleController';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateSchema, validateUUID, validateEmailParam } from '../middleware/googleValidation';
import { 
  createGoogleUserSchema, 
  updateGoogleUserSchema, 
  findOrCreateGoogleUserSchema 
} from '../types/googleValidation';

const router = Router();

// Rutas para gestión de usuarios de Google
router.post('/users', 
  validateSchema(createGoogleUserSchema),
  googleController.createGoogleUser
);

router.post('/users/find-or-create', 
  validateSchema(findOrCreateGoogleUserSchema),
  googleController.findOrCreateGoogleUser
);

router.get('/users', 
  googleController.getAllGoogleUsers
);

router.get('/users/:id', 
  validateUUID('id'),
  googleController.getGoogleUserById
);

router.get('/users/google-id/:googleId', 
  authenticateToken, 
  googleController.getGoogleUserByGoogleId
);

router.get('/users/email/:email', 
  validateEmailParam('email'),
  googleController.getGoogleUserByEmail
);

router.put('/users/:id', 
  validateUUID('id'),
  validateSchema(updateGoogleUserSchema),
  googleController.updateGoogleUser
);

router.delete('/users/:id', 
  validateUUID('id'),
  googleController.deleteGoogleUser
);

export default router;
