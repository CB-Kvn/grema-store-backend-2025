"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const photoController_1 = require("../controllers/photoController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const photoController = new photoController_1.PhotoController();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/upload', upload.array('files', 10), photoController.uploadPhotos.bind(photoController));
router.get('/', photoController.getPhotos.bind(photoController));
exports.default = router;
