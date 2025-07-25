// src/lib/whatsapp.client.ts
import axios, { AxiosInstance } from 'axios';



class WhatsAppClient {
    private readonly api: AxiosInstance;
    private readonly phoneNumberId: string;

    constructor() {
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;

        this.api = axios.create({
            baseURL: `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${this.phoneNumberId}`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async sendTextMessage(to: string) {
        try {
            const response = await this.api.post('/messages', {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: to,
                type: 'template',
                template: {
                    name: "hello_world",
                    language: {
                        "code": "en_US"
                    }
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async sendTemplateMessage(to: string, templateName: string, languageCode: string = 'es_MX') {
        try {
            const response = await this.api.post('/messages', {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: languageCode }
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async sendOrderNotification(to: string, orderData: any) {
        try {
            // Crear mensaje personalizado con información de la orden
            const orderMessage = this.formatOrderMessage(orderData);
            
            const response = await this.api.post('/messages', {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: {
                    body: orderMessage
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    private formatOrderMessage(orderData: any): string {
        const { id, total, items, status, createdAt } = orderData;
        
        let message = `🛒 *Nueva Orden de Compra Creada*\n\n`;
        message += `📋 *ID de Orden:* ${id}\n`;
        message += `💰 *Total:* $${total}\n`;
        message += `📅 *Fecha:* ${new Date(createdAt).toLocaleDateString('es-MX')}\n`;
        message += `📊 *Estado:* ${status}\n\n`;
        
        if (items && items.length > 0) {
            message += `📦 *Productos:*\n`;
            items.forEach((item: any, index: number) => {
                message += `${index + 1}. ${item.product?.name || 'Producto'} - Cantidad: ${item.quantity} - $${item.totalPrice}\n`;
            });
        }
        
        message += `\n✅ Tu orden ha sido registrada exitosamente y será procesada pronto.`;
        
        return message;
    }
}

export const whatsappClient = new WhatsAppClient();