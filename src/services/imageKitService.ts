import ImageKitJS from "imagekit";
import { ReadStream, createReadStream } from "fs";

// Definimos los tipos necesarios para las respuestas
interface UploadResponse {
    fileId: string;
    name: string;
    url: string;
    filePath: string;
    height?: number;
    width?: number;
    size?: number;
    fileType: string;
    [key: string]: any;
}

interface ImageTransformationOptions {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
    [key: string]: any;
}

export default class ImageKitService {
    private imagekit: ImageKitJS;

    constructor() {
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            throw new Error("Faltan variables de entorno para ImageKit.");
        }

        this.imagekit = new ImageKitJS({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }

    /**
     * Sube un archivo a ImageKit
     * @param file - Puede ser: ruta del archivo (string), Buffer, o ReadStream
     * @param options - Opciones adicionales
     */
    public async upload(
        file: string | Buffer | ReadStream,
        options: {
            fileName?: string;
            folder?: string;
            [key: string]: any;
        } = {}
    ): Promise<UploadResponse> {
        try {
            const fileData = typeof file === 'string' ? createReadStream(file) : file;

            const response = await this.imagekit.upload({
                file: fileData,
                fileName: options.fileName || `img_${Date.now()}`,
                folder: options.folder || "/uploads",
                ...options,
            });

            return response

        } catch (error) {
            throw new Error(`Error al subir el archivo: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Genera URL con transformaciones (WebP por defecto)
     */
    public getUrl(
        filePath: string,
        transformations: ImageTransformationOptions = {},
        forceWebP: boolean = true
    ): string {
        const defaultTransforms: ImageTransformationOptions = {
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

    /**
     * Elimina un archivo
     */
    public async delete(fileId: string): Promise<void> {
        try {
            await this.imagekit.deleteFile(fileId);
        } catch (error) {
            throw new Error(`Error al eliminar el archivo: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}