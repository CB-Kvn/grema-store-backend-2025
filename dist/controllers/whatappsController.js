"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppController = void 0;
const whatapss_service_1 = require("../services/whatapss.service");
class WhatsAppController {
    static async sendTextMessage(req, res) {
        try {
            const { phone } = req.body;
            if (!phone) {
                return res.status(400).json({ error: 'Phone and message are required' });
            }
            const response = await whatapss_service_1.whatsappClient.sendTextMessage(phone);
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async handleWebhook(req, res) {
        try {
            if (req.query['hub.mode'] === 'subscribe') {
                if (req.query['hub.verify_token'] === process.env.WHATSAPP_WEBHOOK_TOKEN) {
                    return res.status(200).send(req.query['hub.challenge']);
                }
                return res.status(403).json({ error: 'Invalid verification token' });
            }
            const payload = req.body;
            console.log('Webhook payload:', payload);
            if (payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
                const message = payload.entry[0].changes[0].value.messages[0];
                const phone = message.from;
                if (message.text?.body.toLowerCase() === 'hola') {
                    await whatapss_service_1.whatsappClient.sendTextMessage(phone);
                }
            }
            res.status(200).json({ status: 'ok' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.WhatsAppController = WhatsAppController;
