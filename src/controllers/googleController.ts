import { Request, Response } from 'express';
import { googleService } from '../services/googleService';
import { UserTypes } from '@prisma/client';
import { logger } from '../utils/logger';

export class GoogleController {
  // Crear un nuevo usuario de Google
  async createGoogleUser(req: Request, res: Response) {
    try {
      const { googleId, email, name, avatar, typeUser, discounts } = req.body;

      // Validaciones básicas
      if (!googleId || !email || !name) {
        return res.status(400).json({
          success: false,
          message: 'Google ID, email y name son requeridos',
        });
      }

      // Validar que el email tenga un formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email no tiene un formato válido',
        });
      }

      // Validar typeUser si se proporciona
      if (typeUser && !Object.values(UserTypes).includes(typeUser)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido',
        });
      }

      // Validar discounts si se proporciona
      if (discounts && !Array.isArray(discounts)) {
        return res.status(400).json({
          success: false,
          message: 'Discounts debe ser un array',
        });
      }

      const googleUser = await googleService.createGoogleUser({
        googleId,
        email,
        name,
        avatar,
        discounts,
        typeUser,
      });

      logger.info(`Google user created successfully: ${googleUser.id}`);

      await googleService.sendEmailNotification()

      res.status(201).json({
        success: true,
        message: 'Usuario de Google creado exitosamente',
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error creating Google user: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Actualizar un usuario de Google
  async updateGoogleUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { googleId, email, name, avatar, typeUser, discounts } = req.body;

      // Validar que el ID sea válido
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
      }

      // Validar email si se proporciona
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'Email no tiene un formato válido',
          });
        }
      }

      // Validar discounts si se proporciona
      if (discounts && !Array.isArray(discounts)) {
        return res.status(400).json({
          success: false,
          message: 'Discounts debe ser un array',
        });
      }

      const googleUser = await googleService.updateGoogleUser(id, {
        googleId,
        email,
        name,
        avatar,
        typeUser,
        discounts
      });

      logger.info(`Google user updated successfully: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Usuario de Google actualizado exitosamente',
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error updating Google user: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Obtener un usuario de Google por ID
  async getGoogleUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
      }

      const googleUser = await googleService.getGoogleUserById(id);

      if (!googleUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario de Google no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error fetching Google user: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Obtener todos los usuarios de Google
  async getAllGoogleUsers(req: Request, res: Response) {
    try {
      const googleUsers = await googleService.getAllGoogleUsers();

      res.status(200).json({
        success: true,
        data: googleUsers,
        count: googleUsers.length,
      });
    } catch (error) {
      logger.error(`Error fetching Google users: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Eliminar un usuario de Google
  async deleteGoogleUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
      }

      const googleUser = await googleService.deleteGoogleUser(id);

      logger.info(`Google user deleted successfully: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Usuario de Google eliminado exitosamente',
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error deleting Google user: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Buscar usuario de Google por Google ID
  async getGoogleUserByGoogleId(req: Request, res: Response) {
    try {
      const { googleId } = req.params;

      if (!googleId) {
        return res.status(400).json({
          success: false,
          message: 'Google ID es requerido',
        });
      }

      const googleUser = await googleService.getGoogleUserByGoogleId(googleId);

      if (!googleUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario de Google no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error fetching Google user by Google ID: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Buscar usuario de Google por email
  async getGoogleUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email es requerido',
        });
      }

      const googleUser = await googleService.getGoogleUserByEmail(email);

      if (!googleUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario de Google no encontrado',
        });
      }

      res.status(200).json({
        success: true,
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error fetching Google user by email: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }

  // Buscar o crear usuario de Google (útil para autenticación)
  async findOrCreateGoogleUser(req: Request, res: Response) {
    try {
      const { googleId, email, name, avatar, typeUser, discounts } = req.body;

      // Validaciones básicas
      if (!googleId || !email || !name) {
        return res.status(400).json({
          success: false,
          message: 'Google ID, email y name son requeridos',
        });
      }

      // Validar que el email tenga un formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email no tiene un formato válido',
        });
      }

      // Validar typeUser si se proporciona
      if (typeUser && !Object.values(UserTypes).includes(typeUser)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido',
        });
      }

      // Validar discounts si se proporciona
      if (discounts && !Array.isArray(discounts)) {
        return res.status(400).json({
          success: false,
          message: 'Discounts debe ser un array',
        });
      }

      const googleUser = await googleService.findOrCreateGoogleUser({
        googleId,
        email,
        name,
        avatar,
        discounts,
        typeUser,
      });

      logger.info(`Google user found or created successfully: ${googleUser.id}`);

      res.status(200).json({
        success: true,
        message: 'Usuario de Google procesado exitosamente',
        data: googleUser,
      });
    } catch (error) {
      logger.error(`Error finding or creating Google user: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  }
}

export const googleController = new GoogleController();
