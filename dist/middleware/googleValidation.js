"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailParam = exports.validateUUID = exports.validateSchema = void 0;
const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: error.errors?.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })) || [],
            });
        }
    };
};
exports.validateSchema = validateSchema;
const validateUUID = (paramName) => {
    return (req, res, next) => {
        const param = req.params[paramName];
        if (!param) {
            return res.status(400).json({
                success: false,
                message: `Parámetro ${paramName} es requerido`,
            });
        }
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
exports.validateUUID = validateUUID;
const validateEmailParam = (paramName) => {
    return (req, res, next) => {
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
exports.validateEmailParam = validateEmailParam;
