"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config/config");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};
const level = () => {
    return config_1.config.isDev() ? 'debug' : 'warn';
};
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`));
const transports = [
    new winston_1.default.transports.Console(),
    ...(config_1.config.isProd()
        ? [new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' })]
        : [])
];
exports.logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports
});
