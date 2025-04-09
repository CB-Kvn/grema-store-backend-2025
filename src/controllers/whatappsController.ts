// src/controllers/whatsapp.controller.ts
import { Request, Response } from 'express';
import { whatsappClient } from '../services/whatapss.service';


export class WhatsAppController {
  static async sendTextMessage(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ error: 'Phone and message are required' });
      }

      const response = await whatsappClient.sendTextMessage(phone);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      // Verificación del webhook
      if (req.query['hub.mode'] === 'subscribe') {
        if (req.query['hub.verify_token'] === process.env.WHATSAPP_WEBHOOK_TOKEN) {
          return res.status(200).send(req.query['hub.challenge']);
        }
        return res.status(403).json({ error: 'Invalid verification token' });
      }

      // Procesar notificaciones entrantes
      const payload = req.body;
      console.log('Webhook payload:', payload);
      
      // Aquí procesarías los mensajes entrantes
      // Ejemplo: responder automáticamente
      if (payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const message = payload.entry[0].changes[0].value.messages[0];
        const phone = message.from;
        
        if (message.text?.body.toLowerCase() === 'hola') {
          await whatsappClient.sendTextMessage(phone);
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}