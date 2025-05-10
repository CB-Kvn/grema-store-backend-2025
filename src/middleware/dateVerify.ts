import { Request, Response, NextFunction } from 'express';

// Tipos para fechas en el body (pueden ser strings o objetos Date)
type DateFields = Record<string, string | Date>;

export function dateValidatorMiddleware(
  dateFields: string[] // Nombres de los campos que contienen fechas
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && typeof req.body === 'object') {
        // Transformar cada campo de fecha en el body
        dateFields.forEach((field) => {
          if (req.body[field]) {
            req.body[field] = convertToValidDate(req.body[field]);
          }
        });
      }
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Formato de fecha inválido',
        details: (error as Error).message,
      });
    }
  };
}

// Función auxiliar para convertir a fecha válida
function convertToValidDate(dateValue: any): string | Date {
  if (dateValue instanceof Date) {
    return dateValue; // Ya es un Date válido
  }

  if (typeof dateValue === 'string') {
    // Intentar parsear como ISO-8601 o formato simplificado (YYYY-MM-DD)
    const parsedDate = new Date(dateValue);
    
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`El campo fecha no es válido: ${dateValue}`);
    }

    // Devolver como ISO-8601 completo
    return parsedDate.toISOString();
  }

  throw new Error(`Tipo de fecha no soportado: ${typeof dateValue}`);
}