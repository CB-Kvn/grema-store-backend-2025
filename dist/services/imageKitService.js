"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const fs_1 = require("fs");
const config_1 = require("../config/config");
class ImageKitService {
    constructor() {
        if (!config_1.config.IMAGEKIT_PUBLIC_KEY_PICS || !config_1.config.IMAGEKIT_PRIVATE_KEY_PICS || !config_1.config.IMAGEKIT_URL_ENDPOINT_PICS) {
            throw new Error("Faltan variables de entorno para ImageKit.");
        }
        this.imagekit = new imagekit_1.default({
            publicKey: config_1.config.IMAGEKIT_PUBLIC_KEY_PICS,
            privateKey: config_1.config.IMAGEKIT_PRIVATE_KEY_PICS,
            urlEndpoint: config_1.config.IMAGEKIT_URL_ENDPOINT_PICS,
        });
    }
    async upload(file, options = {}) {
        try {
            const fileData = typeof file === 'string' ? (0, fs_1.createReadStream)(file) : file;
            const response = await this.imagekit.upload({
                file: fileData,
                fileName: options.fileName || `img_${Date.now()}`,
                folder: options.folder || "/uploads",
                ...options,
            });
            return response;
        }
        catch (error) {
            throw new Error(`Error al subir el archivo: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    getUrl(filePath, transformations = {}, forceWebP = true) {
        const defaultTransforms = {
            format: "webp",
            quality: 80,
            ...transformations,
        };
        if (!forceWebP && transformations.format) {
            delete defaultTransforms.format;
        }
        return this.imagekit.url({
            path: filePath,
            transformation: [defaultTransforms],
        });
    }
    async delete(fileId) {
        try {
            await this.imagekit.deleteFile(fileId);
        }
        catch (error) {
            throw new Error(`Error al eliminar el archivo: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.default = ImageKitService;
