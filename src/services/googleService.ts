import { PrismaClient } from '@prisma/client';
import { UserTypes } from '@prisma/client';

const prisma = new PrismaClient();

export class GoogleService {
  // Crear un nuevo usuario de Google
  async createGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    discounts?: string[];
    typeUser?: UserTypes;
  }) {
    try {
      const googleUser = await prisma.google.create({
        data: {
          googleId: data.googleId,
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          discounts: data.discounts,
          typeUser: data.typeUser || UserTypes.BUYER,
        },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error creating Google user: ${error}`);
    }
  }

  // Actualizar un usuario de Google
  async updateGoogleUser(id: string, data: {
    googleId?: string;
    email?: string;
    name?: string;
    avatar?: string;
    discounts?: string[];
    typeUser?: UserTypes;
  }) {
    try {
      const googleUser = await prisma.google.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error updating Google user: ${error}`);
    }
  }

  // Obtener un usuario de Google por ID
  async getGoogleUserById(id: string) {
    try {
      const googleUser = await prisma.google.findUnique({
        where: { id },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error fetching Google user: ${error}`);
    }
  }

  // Obtener un usuario de Google por Google ID
  async getGoogleUserByGoogleId(googleId: string) {
    try {
      const googleUser = await prisma.google.findUnique({
        where: { googleId },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error fetching Google user by Google ID: ${error}`);
    }
  }

  // Obtener un usuario de Google por email
  async getGoogleUserByEmail(email: string) {
    try {
      const googleUser = await prisma.google.findUnique({
        where: { email },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error fetching Google user by email: ${error}`);
    }
  }

  // Obtener todos los usuarios de Google
  async getAllGoogleUsers() {
    try {
      const googleUsers = await prisma.google.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return googleUsers;
    } catch (error) {
      throw new Error(`Error fetching Google users: ${error}`);
    }
  }

  // Eliminar un usuario de Google
  async deleteGoogleUser(id: string) {
    try {
      const googleUser = await prisma.google.delete({
        where: { id },
      });
      return googleUser;
    } catch (error) {
      throw new Error(`Error deleting Google user: ${error}`);
    }
  }

  // Buscar o crear usuario de Google (útil para autenticación)
  async findOrCreateGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    discounts?: string[];
    typeUser?: UserTypes;
  }) {
    try {
      // Primero intenta encontrar el usuario por Google ID
      let googleUser = await prisma.google.findUnique({
        where: { googleId: data.googleId },
      });

      // Si no existe, intenta por email
      if (!googleUser) {
        googleUser = await prisma.google.findUnique({
          where: { email: data.email },
        });
      }

      // Si no existe, crea uno nuevo
      if (!googleUser) {
        googleUser = await prisma.google.create({
          data: {
            googleId: data.googleId,
            email: data.email,
            name: data.name,
            avatar: data.avatar,
            discounts: data.discounts,
            typeUser: data.typeUser || UserTypes.BUYER,
          },
        });
      } else {
        // Si existe, actualiza la información
        googleUser = await prisma.google.update({
          where: { id: googleUser.id },
          data: {
            googleId: data.googleId,
            email: data.email,
            name: data.name,
            avatar: data.avatar,
            discounts: data.discounts,
            typeUser: data.typeUser || googleUser.typeUser,
          },
        });
      }

      return googleUser;
    } catch (error) {
      throw new Error(`Error finding or creating Google user: ${error}`);
    }
  }
}

export const googleService = new GoogleService();
