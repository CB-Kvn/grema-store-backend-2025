declare namespace WhatsApp {
    interface Message {
      phone: string;
      message: string;
    }
  
    interface Template {
      phone: string;
      templateName: string;
      languageCode?: string;
      components?: any[];
    }
  
    interface WebhookPayload {
      object: string;
      entry: {
        id: string;
        changes: {
          value: any;
          field: string;
        }[];
      }[];
    }
  }
  
  export default WhatsApp;