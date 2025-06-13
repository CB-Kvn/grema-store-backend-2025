
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Sesión cerrada' });
};