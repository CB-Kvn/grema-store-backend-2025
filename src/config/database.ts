import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';


const prisma = new PrismaClient({
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

// Log queries in development
prisma.$on('query', (e: any) => {
  logger.debug('Query: ' + e.query);
  logger.debug('Duration: ' + e.duration + 'ms');
});

// Log errors
prisma.$on('error', (e: any) => {
  logger.error('Prisma Error:', e);
});

export default prisma;