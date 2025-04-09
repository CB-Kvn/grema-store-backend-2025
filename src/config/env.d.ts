declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    API_VERSION: string;
    DB_URL: string;
    JWT_SECRET: string;
    LOG_LEVEL: string;
    CORS_ORIGIN: string;
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_PHONE_NUMBER_ID: string;
    WHATSAPP_API_VERSION: string;
    WHATSAPP_WEBHOOK_TOKEN: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;

  }
}