import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';

interface ValidationError {
  field: string;
  message: string;
}

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) return next();

      const formattedErrors = (errors.array() as any[]).map(err => ({
        field: err.param,
        message: err.msg,
      }));

      logger.warn('Validation failed', {
        path: req.path,
        method: req.method,
        errors: formattedErrors,
      });

      return next(new AppError('Validation failed', 400, formattedErrors));
    } catch (err) {
      logger.error('Unexpected error during validation', { error: err });
      return next(new AppError('Unexpected validation error', 500));
    }
  };
};