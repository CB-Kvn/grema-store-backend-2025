import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from './errorHandler';
import { logger } from '../utils/logger';
import prisma from '../config/database';


interface DecodedToken {
  id: string;
  role: string;
  email: string;
  iat: number;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Middleware para autenticación
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = await prisma.user.findUnique({
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
      return next(new AppError('User no longer exists or is inactive', 401));
    }

    if (user.passwordChangedAt) {
      const changedTimestamp = user.passwordChangedAt.getTime() / 1000;
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('Password was changed recently. Please log in again', 401));
      }
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new AppError('Invalid token or authentication failed', 401));
  }
};

// Middleware para restricción por roles
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Rate limiting por usuario (in-memory)
export const userRateLimit = (limit: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) return next();

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
