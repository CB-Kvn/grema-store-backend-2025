"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const sanitize = (value, path, logger) => {
    if (typeof value === 'string') {
        const sanitized = (0, sanitize_html_1.default)(value, {
            allowedTags: [],
            allowedAttributes: {},
            allowedIframeHostnames: [],
        });
        if (sanitized !== value) {
            logger(`[XSS DETECTED] Path: ${path} | Original: "${value}" | Sanitized: "${sanitized}"`);
        }
        return sanitized;
    }
    else if (Array.isArray(value)) {
        return value.map((v, i) => sanitize(v, `${path}[${i}]`, logger));
    }
    else if (typeof value === 'object' && value !== null) {
        const sanitizedObj = {};
        for (const key in value) {
            sanitizedObj[key] = sanitize(value[key], `${path}.${key}`, logger);
        }
        return sanitizedObj;
    }
    return value;
};
const sanitizeInput = (req, res, next) => {
    const baseLogInfo = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl}`;
    const logger = (info) => {
        console.warn(`${baseLogInfo} - ${info}`);
    };
    req.body = sanitize(req.body, 'body', logger);
    req.query = sanitize(req.query, 'query', logger);
    req.params = sanitize(req.params, 'params', logger);
    const userHeaders = Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('x-') || key.startsWith('custom-')));
    const sanitizedHeaders = sanitize(userHeaders, 'headers', logger);
    Object.assign(req.headers, sanitizedHeaders);
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        const sanitizedData = sanitize(data, 'response', logger);
        return originalJson(sanitizedData);
    };
    next();
};
exports.default = sanitizeInput;
