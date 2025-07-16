"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
const axios_1 = __importDefault(require("axios"));
const tokens_1 = require("../utils/tokens");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
class AuthService {
    async login(email, password) {
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user || !user.active) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return { token, user: { id: user.id, email: user.email, role: user.role } };
    }
    async register(email, password, role = 'USER') {
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await database_1.default.user.create({
            data: { email, password: hashedPassword, role },
        });
        return { id: user.id, email: user.email, role: user.role };
    }
    async verifyGoogleToken(tokenId) {
        const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`;
        const { data } = await axios_1.default.get(url);
        let user = await database_1.default.google.findMany({ where: { googleId: data.sub, email: data.email } });
        if (!data.email || data.email_verified !== 'true') {
            throw new Error('Correo electrónico no verificado');
        }
        logger_1.logger.info('[Google Login] User found:', data);
        logger_1.logger.info('[Google Login] User found:', user);
        if (!user || user.length === 0) {
            const createdUser = await database_1.default.google.create({
                data: {
                    googleId: data.sub,
                    email: data.email,
                    name: data.name,
                    avatar: data.picture,
                },
            });
            user = [createdUser];
        }
        const token = (0, tokens_1.generateToken)({
            email: data.email,
            name: data.name,
            picture: data.picture,
        });
        return {
            token,
            user: {
                email: data.email || user[0].email || '',
                name: data.name || user[0].name || '',
                picture: data.picture || user[0].avatar || '',
                typeUser: user[0].typeUser || '',
                discounts: user[0].discounts || [],
                id: user[0].id,
            },
        };
    }
    ;
    async getAll() {
        return database_1.default.google.findMany();
    }
    async update(id, data) {
        return database_1.default.google.update({
            where: { id },
            data,
        });
    }
}
exports.AuthService = AuthService;
