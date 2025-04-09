// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

class AppError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational: boolean;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handlers específicos
const handleCastErrorDB = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err: any) => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  return new AppError(`Duplicate field "${key}": "${value}"`, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((e: any) => e.message);
  return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// Formato para DEV
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  logger.error(`💥 DEV ERROR at ${req.method} ${req.originalUrl}`, {
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

// Formato para PROD
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (err.isOperational) {
    const response: any = {
      status: err.status,
      message: err.message,
    };

    // Comprobamos si err.details es un objeto antes de usar el spread operator
    if (err.details && typeof err.details === 'object') {
      response.errors = err.details;
    }

    return res.status(err.statusCode).json(response);
  }

  logger.error(`💥 UNEXPECTED ERROR at ${req.method} ${req.originalUrl}`, {
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

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err, message: err.message };

    // MongoDB / Mongoose errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    // JWT errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error as AppError, req, res);
  }
};

export { AppError };
