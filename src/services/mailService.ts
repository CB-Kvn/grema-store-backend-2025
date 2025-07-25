import nodemailer from 'nodemailer';
import { config } from '../config/config';

export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'grema.store.cr.online@gmail.com',
        pass: 'fzxm ctcy ajsk hzts', // Reemplaza por tu token seguro o usa variable de entorno
      },
    });
  }

  async sendMail({
    to,
    subject,
    text,
    html,
    from = 'grema.store.cr.online@gmail.com',
    orderNumber,
    paymentLink,
    trackingLink
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    orderNumber?: string;
    paymentLink?: string;
    trackingLink?: string;
  }) {
    // Plantilla HTML personalizada
    const logoUrl = 'https://ik.imagekit.io/xj7y5uqcr/Logo%20en%20negro.png?updatedAt=1753365043217'; // Cambia por la URL real de tu logo
    const htmlTemplate = html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${logoUrl}" alt="Grema Store" style="max-width: 180px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748;">¡Gracias por tu orden!</h2>
        </div>
        <p style="font-size: 16px; color: #4a5568;">Número de orden: <b>${orderNumber || 'N/A'}</b></p>
        <p style="font-size: 16px; color: #4a5568;">Puedes subir tu comprobante de pago aquí:</p>
        <p><a href="${paymentLink || '#'}" style="background: #3182ce; color: #fff; padding: 10px 18px; border-radius: 5px; text-decoration: none;">Subir comprobante</a></p>
        <p style="font-size: 16px; color: #4a5568;">Rastrea tu orden aquí:</p>
        <p><a href="${trackingLink || '#'}" style="background: #38a169; color: #fff; padding: 10px 18px; border-radius: 5px; text-decoration: none;">Rastrear orden</a></p>
        <hr style="margin: 32px 0;" />
        <p style="font-size: 14px; color: #718096; text-align: center;">Grema Store &copy; 2025</p>
      </div>
    `;
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html: htmlTemplate,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error('Error enviando correo: ' + error);
    }
  }
}

export const mailService = new MailService();
