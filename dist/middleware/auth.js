"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRateLimit = exports.restrictTo = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../config/database"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new errorHandler_1.AppError('No token provided', 401));
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await database_1.default.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                role: true,
                email: true,
                passwordChangedAt: true,
                active: true,
            },
        });
        if (!user || !user.active) {
            return next(new errorHandler_1.AppError('User no longer exists or is inactive', 401));
        }
        if (user.passwordChangedAt) {
            const changedTimestamp = user.passwordChangedAt.getTime() / 1000;
            if (decoded.iat < changedTimestamp) {
                return next(new errorHandler_1.AppError('Password was changed recently. Please log in again', 401));
            }
        }
        req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        next(new errorHandler_1.AppError('Invalid token or authentication failed', 401));
    }
};
exports.auth = auth;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
const userRateLimit = (limit, windowMs) => {
    const userRequests = new Map();
    return (req, res, next) => {
        if (!req.user?.id)
            return next();
        const now = Date.now();
        const current = userRequests.get(req.user.id);
        if (!current || now > current.resetTime) {
            userRequests.set(req.user.id, {
                count: 1,
                resetTime: now + windowMs,
            });
            return next();
        }
        if (current.count >= limit) {
            return res.status(429).json({
                status: 'error',
                message: 'Too many requests, please try again later',
            });
        }
        current.count++;
        next();
    };
};
exports.userRateLimit = userRateLimit;
