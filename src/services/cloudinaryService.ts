import { v2 as cloudinary } from 'cloudinary';

export default class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    public async uploadImage(filePath: string, options: Record<string, any> = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath, options, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}