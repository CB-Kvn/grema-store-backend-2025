import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatappsController';


const router = Router();

router.post('/messages', WhatsAppController.sendTextMessage);
router.get('/webhook', WhatsAppController.handleWebhook);
router.post('/webhook', WhatsAppController.handleWebhook);

export const whatsappRoutes = router;