"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handleCastErrorDB = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateFieldsDB = (err) => {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    return new AppError(`Duplicate field "${key}": "${value}"`, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((e) => e.message);
    return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);
const sendErrorDev = (err, req, res) => {
    logger_1.logger.error(`💥 DEV ERROR at ${req.method} ${req.originalUrl}`, {
        message: err.message,
        stack: err.stack,
        ip: req.ip,
        path: req.originalUrl,
    });
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        const response = {
            status: err.status,
            message: err.message,
        };
        if (err.details && typeof err.details === 'object') {
            response.errors = err.details;
        }
        return res.status(err.statusCode).json(response);
    }
    logger_1.logger.error(`💥 UNEXPECTED ERROR at ${req.method} ${req.originalUrl}`, {
        message: err.message,
        name: err.name,
        stack: err.stack,
        ip: req.ip,
    });
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
    });
};
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else {
        let error = { ...err, message: err.message };
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
exports.errorHandler = errorHandler;
