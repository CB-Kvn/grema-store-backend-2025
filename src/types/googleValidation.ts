import { z } from 'zod';

// Enum para tipos de usuario
export const UserTypesEnum = z.enum(['BUYER', 'ADMIN']);

// Schema para crear usuario de Google
export const createGoogleUserSchema = z.object({
  googleId: z.string().min(1, 'Google ID es requerido'),
  email: z.string().email('Email debe tener un formato válido'),
  name: z.string().min(1, 'Nombre es requerido'),
  avatar: z.string().url('Avatar debe ser una URL válida').optional(),
  typeUser: UserTypesEnum.optional(),
  discounts: z.array(z.string()).optional(),
});

// Schema para actualizar usuario de Google
export const updateGoogleUserSchema = z.object({
  googleId: z.string().min(1, 'Google ID es requerido').optional(),
  email: z.string().email('Email debe tener un formato válido').optional(),
  name: z.string().min(1, 'Nombre es requerido').optional(),
  avatar: z.string().url('Avatar debe ser una URL válida').optional(),
  typeUser: UserTypesEnum.optional(),
  discounts: z.array(z.string()).optional(),
});

// Schema para buscar o crear usuario de Google
export const findOrCreateGoogleUserSchema = z.object({
  googleId: z.string().min(1, 'Google ID es requerido'),
  email: z.string().email('Email debe tener un formato válido'),
  name: z.string().min(1, 'Nombre es requerido'),
  avatar: z.string().url('Avatar debe ser una URL válida').optional(),
  typeUser: UserTypesEnum.optional(),
  discounts: z.array(z.string()).optional(),
});

// Schema para validar UUID
export const uuidSchema = z.string().uuid('ID debe ser un UUID válido');

// Schema para validar email
export const emailSchema = z.string().email('Email debe tener un formato válido');

// Tipos TypeScript derivados de los schemas
export type CreateGoogleUserInput = z.infer<typeof createGoogleUserSchema>;
export type UpdateGoogleUserInput = z.infer<typeof updateGoogleUserSchema>;
export type FindOrCreateGoogleUserInput = z.infer<typeof findOrCreateGoogleUserSchema>;
