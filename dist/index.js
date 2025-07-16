"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const sanitizeInput_1 = __importDefault(require("./middleware/sanitizeInput"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const warehouseRoutes_1 = __importDefault(require("./routes/warehouseRoutes"));
const purchaseOrderRoutes_1 = __importDefault(require("./routes/purchaseOrderRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const photoRoutes_1 = __importDefault(require("./routes/photoRoutes"));
const discountRoutes_1 = __importDefault(require("./routes/discountRoutes"));
const whatappsRoutes_1 = require("./routes/whatappsRoutes");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const googleRoutes_1 = __importDefault(require("./routes/googleRoutes"));
const dateVerify_1 = require("./middleware/dateVerify");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const reportsRoutes_1 = __importDefault(require("./routes/reportsRoutes"));
const envFile = process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env';
const envPath = path_1.default.resolve(__dirname, `./config/${envFile}`);
if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL) {
        (0, dotenv_1.config)({ path: envPath });
    }
}
else {
    (0, dotenv_1.config)({ path: envPath });
}
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
app.use(sanitizeInput_1.default);
app.use((0, cookie_parser_1.default)());
const rateLimitConfig = {
    development: {
        windowMs: 15 * 60 * 1000,
        max: 500
    },
    production: {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later'
    }
};
const limiter = (0, express_rate_limit_1.default)(process.env.NODE_ENV === 'production'
    ? rateLimitConfig.production
    : rateLimitConfig.development);
app.use('/api', limiter);
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
app.use((0, cors_1.default)(process.env.NODE_ENV === 'production'
    ? corsOptions.production
    : corsOptions.development));
app.use(express_1.default.json({
    limit: process.env.NODE_ENV === 'production' ? '10kb' : '50kb'
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
        write: (message) => logger_1.logger.http(message.trim())
    }
}));
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
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        const transformedData = JSON.parse(JSON.stringify(data, (key, value) => value instanceof Date ? value.toISOString() : value));
        return originalJson.call(this, transformedData);
    };
    next();
});
app.use((0, dateVerify_1.dateValidatorMiddleware)(['date', 'startDate', 'endDate', 'passwordChangedAt', 'lastInventoryDate']));
app.use('/api/products', productRoutes_1.default);
app.use('/api/warehouses', warehouseRoutes_1.default);
app.use('/api/purchase-orders', purchaseOrderRoutes_1.default);
app.use('/api/expenses', expenseRoutes_1.default);
app.use('/api/whatsapp', whatappsRoutes_1.whatsappRoutes);
app.use('/api/photo', photoRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/google', googleRoutes_1.default);
app.use('/api/reports', reportsRoutes_1.default);
app.use('/api/discounts', discountRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});
app.use(errorHandler_1.errorHandler);
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
        environment: process.env.NODE_ENV
    });
});
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 5000);
const server = app.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger_1.logger.info(`CORS configured for: ${process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : corsOptions.development.origin}`);
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger_1.logger.error(err.name, err);
    server.close(() => process.exit(1));
});
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger_1.logger.error(err.name, err);
    server.close(() => process.exit(1));
});
process.on('SIGTERM', () => {
    logger_1.logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        logger_1.logger.info('💤 Process terminated');
        process.exit(0);
    });
});
