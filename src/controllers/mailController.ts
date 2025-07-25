import { Request, Response } from 'express';
import { mailService } from '../services/mailService';
import { logger } from '../utils/logger';

export class MailController {
  async sendMail(req: Request, res: Response) {
    try {
      const { to, subject, text, html, from } = req.body;
      if (!to || !subject) {
        return res.status(400).json({
          success: false,
          message: 'El destinatario y el asunto son requeridos',
        });
      }
      const info = await mailService.sendMail({ to, subject, text, html, from });
      logger.info(`Correo enviado: ${info.messageId}`);
      res.status(200).json({
        success: true,
        message: 'Correo enviado correctamente',
        data: info,
      });
    } catch (error) {
      logger.error('Error enviando correo:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }
}

export const mailController = new MailController();
