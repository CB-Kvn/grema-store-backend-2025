"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("./errorHandler");
const validate = (validations) => {
    return async (req, res, next) => {
        try {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty())
                return next();
            const formattedErrors = errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            }));
            logger_1.logger.warn('Validation failed', {
                path: req.path,
                method: req.method,
                errors: formattedErrors,
            });
            return next(new errorHandler_1.AppError('Validation failed', 400, formattedErrors));
        }
        catch (err) {
            logger_1.logger.error('Unexpected error during validation', { error: err });
            return next(new errorHandler_1.AppError('Unexpected validation error', 500));
        }
    };
};
exports.validate = validate;
