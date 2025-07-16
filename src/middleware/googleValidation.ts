import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Middleware genérico para validar con Zod
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.errors?.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [],
      });
    }
  };
};

// Middleware para validar parámetros UUID
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const param = req.params[paramName];
    
    if (!param) {
      return res.status(400).json({
        success: false,
        message: `Parámetro ${paramName} es requerido`,
      });
    }

    // Regex para UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(param)) {
      return res.status(400).json({
        success: false,
        message: `${paramName} debe ser un UUID válido`,
      });
    }

    next();
  };
};

// Middleware para validar email en parámetros
export const validateEmailParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.params[paramName];
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: `Parámetro ${paramName} es requerido`,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: `${paramName} debe ser un email válido`,
      });
    }

    next();
  };
};
