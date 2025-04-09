import { Request, Response } from 'express';
import CloudinaryService from '../services/cloudinaryService';

export class PhotoController {
    private cloudinaryService: CloudinaryService;

    constructor() {
        this.cloudinaryService = new CloudinaryService();
    }

    public async uploadPhotos(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }

            const folderName = 'photos_products'; // Cambia esto al nombre de la carpeta deseada

            const uploadResponses = await Promise.all(
                req.files.map((file: Express.Multer.File) =>
                    this.cloudinaryService.uploadImage(file.path, { folder: folderName })
                )
            );

            // Extraer y modificar los secure_url de las respuestas
            const secureUrls = uploadResponses.map(response => {
                const modifiedUrl = response.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
                return modifiedUrl;
            });

            res.status(200).json(secureUrls);
        } catch (error) {
            res.status(500).json({ message: 'Error uploading photos', error });
        }
    }

    public async getPhotos(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'Get photos functionality not implemented yet' });
    }
}