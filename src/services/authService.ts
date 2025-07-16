import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { GoogleUser } from '../types';
import axios from 'axios';
import { generateToken } from '../utils/tokens';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.active) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async register(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER') {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async verifyGoogleToken(tokenId: string) {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`;
    const { data } = await axios.get<GoogleUser>(url);
    let user = await prisma.google.findMany({ where: { googleId: data.sub, email: data.email } });
    
    if (!data.email || data.email_verified !== 'true') {
      throw new Error('Correo electrónico no verificado');
    }

    logger.info('[Google Login] User found:', data);
    // Aquí podrías guardar o buscar el usuario en tu base de datos

    logger.info('[Google Login] User found:', user);

    if (!user || user.length === 0) {
      const createdUser = await prisma.google.create({
        data: {
          googleId: data.sub,
          email: data.email,
          name: data.name,
          avatar: data.picture,
        },
      });
      user = [createdUser];
    }

    const token = generateToken({
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
  };

  async getAll() {
    return prisma.google.findMany();
  }

  async update(id: string, data: any) {
    return prisma.google.update({
      where: { id },
      data,
    });
  }
}