import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production'
  ? 'prod.env'
  : 'dev.env';

dotenv.config({
  path: path.join(__dirname, `../config/${envFile}`)
});

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION,
  WHATSAPP_WEBHOOK_TOKEN: process.env.WHATSAPP_WEBHOOK_TOKEN,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // grema.store.pictures@gmail.com
  IMAGEKIT_PUBLIC_KEY_PICS: process.env.IMAGEKIT_PUBLIC_KEY_PICS,
  IMAGEKIT_PRIVATE_KEY_PICS: process.env.IMAGEKIT_PRIVATE_KEY_PICS,
  IMAGEKIT_URL_ENDPOINT_PICS: process.env.IMAGEKIT_URL_ENDPOINT_PICS,

  // grema.store.cr.online@gmail.com
  IMAGEKIT_PUBLIC_KEY_OTHERS: process.env.IMAGEKIT_PUBLIC_KEY_OTHERS,
  IMAGEKIT_PRIVATE_KEY_OTHERS: process.env.IMAGEKIT_PRIVATE_KEY_OTHERS,
  IMAGEKIT_URL_ENDPOINT_OTHERS: process.env.IMAGEKIT_URL_ENDPOINT_OTHERS,

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  isDev: () => process.env.NODE_ENV === 'development',
  isProd: () => process.env.NODE_ENV === 'production'
};