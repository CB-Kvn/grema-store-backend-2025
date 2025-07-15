"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};
exports.authenticateToken = authenticateToken;
const logoutController = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: config_1.config.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Sesión cerrada' });
};
exports.logoutController = logoutController;
