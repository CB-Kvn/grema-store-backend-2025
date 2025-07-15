"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const config_1 = require("../config/config");
const authService = new authService_1.AuthService();
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    static async register(req, res) {
        try {
            const { email, password, role } = req.body;
            const result = await authService.register(email, password, role);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    static async googleLogin(req, res) {
        try {
            const { tokenId } = req.body;
            if (!tokenId || typeof tokenId !== 'string') {
                return res.status(400).json({ error: 'Token inválido' });
            }
            const { token, user } = await authService.verifyGoogleToken(tokenId);
            res.cookie('token', token, {
                httpOnly: true,
                secure: config_1.config.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 15,
            });
            return res.status(200).json({ user });
        }
        catch (error) {
            console.error('[Google Login Error]', error);
            return res.status(401).json({ error: 'Fallo en la autenticación con Google' });
        }
    }
    ;
    static async authController(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }
            res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        const users = await authService.getAll();
        res.json(users);
    }
    static async update(req, res) {
        const { id } = req.params;
        const data = req.body;
        try {
            const user = await authService.update(id, data);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: 'No se pudo actualizar el usuario.' });
        }
    }
}
exports.AuthController = AuthController;
