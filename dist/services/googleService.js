"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleService = exports.GoogleService = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class GoogleService {
    async createGoogleUser(data) {
        try {
            const googleUser = await prisma.google.create({
                data: {
                    googleId: data.googleId,
                    email: data.email,
                    name: data.name,
                    avatar: data.avatar,
                    discounts: data.discounts,
                    typeUser: data.typeUser || client_2.UserTypes.BUYER,
                },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error creating Google user: ${error}`);
        }
    }
    async updateGoogleUser(id, data) {
        try {
            const googleUser = await prisma.google.update({
                where: { id },
                data: {
                    ...data,
                },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error updating Google user: ${error}`);
        }
    }
    async getGoogleUserById(id) {
        try {
            const googleUser = await prisma.google.findUnique({
                where: { id },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error fetching Google user: ${error}`);
        }
    }
    async getGoogleUserByGoogleId(googleId) {
        try {
            const googleUser = await prisma.google.findUnique({
                where: { googleId },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error fetching Google user by Google ID: ${error}`);
        }
    }
    async getGoogleUserByEmail(email) {
        try {
            const googleUser = await prisma.google.findUnique({
                where: { email },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error fetching Google user by email: ${error}`);
        }
    }
    async getAllGoogleUsers() {
        try {
            const googleUsers = await prisma.google.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return googleUsers;
        }
        catch (error) {
            throw new Error(`Error fetching Google users: ${error}`);
        }
    }
    async deleteGoogleUser(id) {
        try {
            const googleUser = await prisma.google.delete({
                where: { id },
            });
            return googleUser;
        }
        catch (error) {
            throw new Error(`Error deleting Google user: ${error}`);
        }
    }
    async findOrCreateGoogleUser(data) {
        try {
            let googleUser = await prisma.google.findUnique({
                where: { googleId: data.googleId },
            });
            if (!googleUser) {
                googleUser = await prisma.google.findUnique({
                    where: { email: data.email },
                });
            }
            if (!googleUser) {
                googleUser = await prisma.google.create({
                    data: {
                        googleId: data.googleId,
                        email: data.email,
                        name: data.name,
                        avatar: data.avatar,
                        discounts: data.discounts,
                        typeUser: data.typeUser || client_2.UserTypes.BUYER,
                    },
                });
            }
            else {
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
        }
        catch (error) {
            throw new Error(`Error finding or creating Google user: ${error}`);
        }
    }
}
exports.GoogleService = GoogleService;
exports.googleService = new GoogleService();
