"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleController = exports.GoogleController = void 0;
const googleService_1 = require("../services/googleService");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
class GoogleController {
    async createGoogleUser(req, res) {
        try {
            const { googleId, email, name, avatar, typeUser, discounts } = req.body;
            if (!googleId || !email || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Google ID, email y name son requeridos',
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email no tiene un formato válido',
                });
            }
            if (typeUser && !Object.values(client_1.UserTypes).includes(typeUser)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de usuario no válido',
                });
            }
            if (discounts && !Array.isArray(discounts)) {
                return res.status(400).json({
                    success: false,
                    message: 'Discounts debe ser un array',
                });
            }
            const googleUser = await googleService_1.googleService.createGoogleUser({
                googleId,
                email,
                name,
                avatar,
                discounts,
                typeUser,
            });
            logger_1.logger.info(`Google user created successfully: ${googleUser.id}`);
            res.status(201).json({
                success: true,
                message: 'Usuario de Google creado exitosamente',
                data: googleUser,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error creating Google user: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async updateGoogleUser(req, res) {
        try {
            const { id } = req.params;
            const { googleId, email, name, avatar, typeUser, discounts } = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID es requerido',
                });
            }
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email no tiene un formato válido',
                    });
                }
            }
            if (discounts && !Array.isArray(discounts)) {
                return res.status(400).json({
                    success: false,
                    message: 'Discounts debe ser un array',
                });
            }
            const googleUser = await googleService_1.googleService.updateGoogleUser(id, {
                googleId,
                email,
                name,
                avatar,
                typeUser,
                discounts
            });
            logger_1.logger.info(`Google user updated successfully: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Usuario de Google actualizado exitosamente',
                data: googleUser,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error updating Google user: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async getGoogleUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID es requerido',
                });
            }
            const googleUser = await googleService_1.googleService.getGoogleUserById(id);
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
        }
        catch (error) {
            logger_1.logger.error(`Error fetching Google user: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async getAllGoogleUsers(req, res) {
        try {
            const googleUsers = await googleService_1.googleService.getAllGoogleUsers();
            res.status(200).json({
                success: true,
                data: googleUsers,
                count: googleUsers.length,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error fetching Google users: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async deleteGoogleUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID es requerido',
                });
            }
            const googleUser = await googleService_1.googleService.deleteGoogleUser(id);
            logger_1.logger.info(`Google user deleted successfully: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Usuario de Google eliminado exitosamente',
                data: googleUser,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error deleting Google user: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async getGoogleUserByGoogleId(req, res) {
        try {
            const { googleId } = req.params;
            if (!googleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Google ID es requerido',
                });
            }
            const googleUser = await googleService_1.googleService.getGoogleUserByGoogleId(googleId);
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
        }
        catch (error) {
            logger_1.logger.error(`Error fetching Google user by Google ID: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async getGoogleUserByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email es requerido',
                });
            }
            const googleUser = await googleService_1.googleService.getGoogleUserByEmail(email);
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
        }
        catch (error) {
            logger_1.logger.error(`Error fetching Google user by email: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
    async findOrCreateGoogleUser(req, res) {
        try {
            const { googleId, email, name, avatar, typeUser, discounts } = req.body;
            if (!googleId || !email || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Google ID, email y name son requeridos',
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email no tiene un formato válido',
                });
            }
            if (typeUser && !Object.values(client_1.UserTypes).includes(typeUser)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de usuario no válido',
                });
            }
            if (discounts && !Array.isArray(discounts)) {
                return res.status(400).json({
                    success: false,
                    message: 'Discounts debe ser un array',
                });
            }
            const googleUser = await googleService_1.googleService.findOrCreateGoogleUser({
                googleId,
                email,
                name,
                avatar,
                discounts,
                typeUser,
            });
            logger_1.logger.info(`Google user found or created successfully: ${googleUser.id}`);
            res.status(200).json({
                success: true,
                message: 'Usuario de Google procesado exitosamente',
                data: googleUser,
            });
        }
        catch (error) {
            logger_1.logger.error(`Error finding or creating Google user: ${error}`);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error interno del servidor',
            });
        }
    }
}
exports.GoogleController = GoogleController;
exports.googleController = new GoogleController();
