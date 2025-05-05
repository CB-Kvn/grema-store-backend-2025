import { Request, Response } from 'express';
import CloudinaryService from '../services/cloudinaryService';
import imageKitService from '../services/imageKitService';

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

            const folderName = 'photos_products'; // Cambia esto al nombre de la carpeta deseada

            // const uploadResponses = await Promise.all(
            //     req.files.map((file: Express.Multer.File) =>
            //         this.cloudinaryService.uploadImage(file.path, { folder: folderName })
            //     )
            // );

            const uploadResponses = await Promise.all(
                req.files.map((file: Express.Multer.File) =>
                    this.imageKitService.upload(file.path, { folder: folderName })
                )
            );

            // // Extraer y modificar los secure_url de las respuestas
            // const secureUrls = uploadResponses.map(response => {
            //     const modifiedUrl = response.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
            //     return modifiedUrl;
            // });

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