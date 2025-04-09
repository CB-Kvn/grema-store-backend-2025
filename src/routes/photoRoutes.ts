import { Router } from 'express';
import { PhotoController } from '../controllers/photoController';
import multer from 'multer';

const router = Router();
const photoController = new PhotoController();
const upload = multer({ dest: 'uploads/' }); // Configura multer para manejar archivos

router.post('/upload', upload.array('files', 10), photoController.uploadPhotos.bind(photoController)); // Permite hasta 10 archivos
router.get('/', photoController.getPhotos.bind(photoController)); // Endpoint para obtener fotos

export default router;