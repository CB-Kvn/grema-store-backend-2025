import { Router } from 'express';
import { mailController } from '../controllers/mailController';

const router = Router();

// Ruta para enviar correo
router.post('/send', mailController.sendMail);

export default router;
