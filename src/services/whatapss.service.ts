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
}

export const whatsappClient = new WhatsAppClient();