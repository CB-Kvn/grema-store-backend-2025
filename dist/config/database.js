"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
prisma.$on('query', (e) => {
    logger_1.logger.debug('Query: ' + e.query);
    logger_1.logger.debug('Duration: ' + e.duration + 'ms');
});
prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma Error:', e);
});
exports.default = prisma;
