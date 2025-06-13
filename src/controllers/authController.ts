import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { config } from '../config/config';


const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const result = await authService.register(email, password, role);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    try {
      const { tokenId } = req.body;

      if (!tokenId || typeof tokenId !== 'string') {
        return res.status(400).json({ error: 'Token inválido' });
      }

      const { token, user } = await authService.verifyGoogleToken(tokenId);
      // Establecer cookie segura con el token
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, // 15 minutos
      });


      return res.status(200).json({ user });
    } catch (error) {
      console.error('[Google Login Error]', error);
      return res.status(401).json({ error: 'Fallo en la autenticación con Google' });
    }
  };

  static async authController(req: any, res: Response) {
    try {
      const user = req.user; // El usuario se establece en el middleware de autenticación
      if (!user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}