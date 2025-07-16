"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = exports.uuidSchema = exports.findOrCreateGoogleUserSchema = exports.updateGoogleUserSchema = exports.createGoogleUserSchema = exports.UserTypesEnum = void 0;
const zod_1 = require("zod");
exports.UserTypesEnum = zod_1.z.enum(['BUYER', 'ADMIN']);
exports.createGoogleUserSchema = zod_1.z.object({
    googleId: zod_1.z.string().min(1, 'Google ID es requerido'),
    email: zod_1.z.string().email('Email debe tener un formato válido'),
    name: zod_1.z.string().min(1, 'Nombre es requerido'),
    avatar: zod_1.z.string().url('Avatar debe ser una URL válida').optional(),
    typeUser: exports.UserTypesEnum.optional(),
    discounts: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateGoogleUserSchema = zod_1.z.object({
    googleId: zod_1.z.string().min(1, 'Google ID es requerido').optional(),
    email: zod_1.z.string().email('Email debe tener un formato válido').optional(),
    name: zod_1.z.string().min(1, 'Nombre es requerido').optional(),
    avatar: zod_1.z.string().url('Avatar debe ser una URL válida').optional(),
    typeUser: exports.UserTypesEnum.optional(),
    discounts: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.findOrCreateGoogleUserSchema = zod_1.z.object({
    googleId: zod_1.z.string().min(1, 'Google ID es requerido'),
    email: zod_1.z.string().email('Email debe tener un formato válido'),
    name: zod_1.z.string().min(1, 'Nombre es requerido'),
    avatar: zod_1.z.string().url('Avatar debe ser una URL válida').optional(),
    typeUser: exports.UserTypesEnum.optional(),
    discounts: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.uuidSchema = zod_1.z.string().uuid('ID debe ser un UUID válido');
exports.emailSchema = zod_1.z.string().email('Email debe tener un formato válido');
