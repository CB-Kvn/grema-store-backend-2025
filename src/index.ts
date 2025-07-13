import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import path from 'path';
import sanitizeInput from './middleware/sanitizeInput';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import productRoutes from './routes/productRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import expenseRoutes from './routes/expenseRoutes';
import  photoRoutes  from './routes/photoRoutes';
import discountsRoutes from './routes/discountRoutes';
import { whatsappRoutes } from './routes/whatappsRoutes';
import authRoutes from './routes/authRoutes';
import { dateValidatorMiddleware } from './middleware/dateVerify';
import cookieParser from 'cookie-parser';
import reportRoutes from './routes/reportsRoutes';


// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env';
config({ path: path.resolve(__dirname, `../config/${envFile}`) });

const app = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(sanitizeInput);// Prevent XSS attacks
app.use(cookieParser()); 

// Rate limiting - Configuración diferente por ambiente
const rateLimitConfig = {
  development: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500 // Mayor límite en desarrollo
  },
  production: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Límite más estricto en producción
    message: 'Too many requests from this IP, please try again later'
  }
};

const limiter = rateLimit(
  process.env.NODE_ENV === 'production' 
    ? rateLimitConfig.production 
    : rateLimitConfig.development
);
app.use('/api', limiter);

// CORS configuration - Diferente por ambiente

const corsOptions = {
  development: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
  },
  production: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
  }
};

app.use(cors(
  process.env.NODE_ENV === 'production' 
    ? corsOptions.production 
    : corsOptions.development
));

// Body parser con límite diferente por ambiente
app.use(express.json({ 
  limit: process.env.NODE_ENV === 'production' ? '10kb' : '50kb' 
}));

// Logging configurable por ambiente
app.use(morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev', 
  {
    stream: {
      write: (message: string) => logger.http(message.trim())
    }
  }
));

// Security headers - Más estrictos en producción
app.use((req, res, next) => {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };

  if (process.env.NODE_ENV === 'production') {
    Object.assign(securityHeaders, {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'no-referrer'
    });
  }

  res.set(securityHeaders);
  next();
});

// Middleware para serializar fechas a ISO strings
app.use((req, res, next) => {
  const originalJson = res.json;
  
  res.json = function (data) {
    const transformedData = JSON.parse(
      JSON.stringify(data, (key, value) =>
        value instanceof Date ? value.toISOString() : value
      )
    );
    return originalJson.call(this, transformedData);
  };

  next();
});

app.use(dateValidatorMiddleware(['date', 'startDate', 'endDate','passwordChangedAt','lastInventoryDate'])); 

// Routes
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/discounts', discountsRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
    environment: process.env.NODE_ENV
  });
});

// Server setup
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 5000);

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`CORS configured for: ${ 
    process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : corsOptions.development.origin 
  }`);
});

// Handle process events
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err);
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💤 Process terminated');
    process.exit(0);
  });
});
