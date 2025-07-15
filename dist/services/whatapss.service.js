"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappClient = void 0;
const axios_1 = __importDefault(require("axios"));
class WhatsAppClient {
    constructor() {
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        this.api = axios_1.default.create({
            baseURL: `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${this.phoneNumberId}`,
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    }
    async sendTextMessage(to) {
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
        }
        catch (error) {
            throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    async sendTemplateMessage(to, templateName, languageCode = 'es_MX') {
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
        }
        catch (error) {
            throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
exports.whatsappClient = new WhatsAppClient();
