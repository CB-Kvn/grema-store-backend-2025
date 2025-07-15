"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const imageKitService_1 = __importDefault(require("../services/imageKitService"));
const promises_1 = __importDefault(require("fs/promises"));
class PhotoController {
    constructor() {
        this.imageKitService = new imageKitService_1.default();
    }
    async uploadPhotos(req, res) {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }
            const folderName = 'photos_products';
            const uploadResponses = await Promise.all(req.files.map(async (file) => {
                const response = await this.imageKitService.upload(file.path, { folder: folderName });
                await promises_1.default.unlink(file.path);
                return response;
            }));
            res.status(200).json(uploadResponses);
        }
        catch (error) {
            res.status(500).json({ message: 'Error uploading photos', error });
        }
    }
    async getPhotos(req, res) {
        try {
            const folderName = 'photos_products';
            const photos = await this.imageKitService.getUrl(folderName);
            if (!photos || photos.length === 0) {
                res.status(404).json({ message: 'No photos found in the specified folder' });
                return;
            }
            res.status(200).json(photos);
        }
        catch (error) {
            console.error('Error fetching photos:', error);
            res.status(500).json({ message: 'Error fetching photos', error });
        }
    }
}
exports.PhotoController = PhotoController;
