"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidatorMiddleware = dateValidatorMiddleware;
function dateValidatorMiddleware(dateFields) {
    return (req, res, next) => {
        try {
            if (req.body && typeof req.body === 'object') {
                dateFields.forEach((field) => {
                    if (req.body[field]) {
                        req.body[field] = convertToValidDate(req.body[field]);
                    }
                });
            }
            next();
        }
        catch (error) {
            res.status(400).json({
                error: 'Formato de fecha inválido',
                details: error.message,
            });
        }
    };
}
function convertToValidDate(dateValue) {
    if (dateValue instanceof Date) {
        return dateValue;
    }
    if (typeof dateValue === 'string') {
        const parsedDate = new Date(dateValue);
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`El campo fecha no es válido: ${dateValue}`);
        }
        return parsedDate.toISOString();
    }
    throw new Error(`Tipo de fecha no soportado: ${typeof dateValue}`);
}
