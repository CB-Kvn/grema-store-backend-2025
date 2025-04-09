import winston from 'winston';
import { config } from '../config/config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const level = () => {
  return config.isDev() ? 'debug' : 'warn';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  ...(config.isProd()
    ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
    : [])
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
});