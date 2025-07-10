import { Request, Response } from 'express';
import CloudinaryService from '../services/cloudinaryService';
import imageKitService from '../services/imageKitService';
import fs from 'fs/promises';

export class PhotoController {
    // private cloudinaryService: CloudinaryService;
    private imageKitService: imageKitService;

    constructor() {
        // this.cloudinaryService = new CloudinaryService();
        this.imageKitService = new imageKitService();
    }

    public async uploadPhotos(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }

            const folderName = 'photos_products';

            const uploadResponses = await Promise.all(
                req.files.map(async (file: Express.Multer.File) => {
                    const response = await this.imageKitService.upload(file.path, { folder: folderName });
                    // Elimina el archivo local después de subirlo
                    await fs.unlink(file.path);
                    return response;
                })
            );

            res.status(200).json(uploadResponses);
        } catch (error) {
            res.status(500).json({ message: 'Error uploading photos', error });
        }
    }

    public async getPhotos(req: Request, res: Response): Promise<void> {
        try {
            const folderName = 'photos_products'; // Cambia esto al nombre de la carpeta deseada

            // Llama al método `getUrl` del servicio `imageKitService` para obtener las URLs de las fotos
            const photos = await this.imageKitService.getUrl(folderName);

            if (!photos || photos.length === 0) {
                res.status(404).json({ message: 'No photos found in the specified folder' });
                return;
            }

            res.status(200).json(photos);
        } catch (error) {
            console.error('Error fetching photos:', error);
            res.status(500).json({ message: 'Error fetching photos', error });
        }
    }
}