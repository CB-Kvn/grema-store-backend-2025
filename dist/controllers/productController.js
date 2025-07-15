"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productService_1 = require("../services/productService");
const imageKitService_1 = __importDefault(require("../services/imageKitService"));
const productService = new productService_1.ProductService();
const imageKitService = new imageKitService_1.default();
class ProductController {
    constructor() {
        this.getAllProducts = async (req, res) => {
            try {
                const products = await productService.getAllProducts();
                const productsWithImages = await Promise.all(products.map(async (product) => {
                    const imagesWithUrls = await Promise.all(product.Images.map(async (image) => {
                        if (typeof image.url === 'string' && image.url.trim() !== '') {
                            try {
                                const parsedUrls = JSON.parse(image.url);
                                const resolvedUrls = await Promise.all(parsedUrls.map(async (location) => {
                                    return await imageKitService.getUrl(location);
                                }));
                                return { ...image, url: resolvedUrls };
                            }
                            catch (parseError) {
                                console.error('Error parsing image URL:', parseError);
                                return { ...image, url: [] };
                            }
                        }
                        return { ...image, url: [] };
                    }));
                    return { ...product, Images: imagesWithUrls, filepaths: product.Images };
                }));
                res.status(200).json(productsWithImages);
            }
            catch (error) {
                console.error('Error in getAllProducts:', error);
                res.status(500).json({ error: 'Error getting products' });
            }
        };
        this.getProductById = async (req, res) => {
            try {
                const product = await productService.getProductById(parseInt(req.params.id));
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                const imagesWithUrls = await Promise.all(product.Images.map(async (image) => {
                    if (typeof image.url === 'string' && image.url.trim() !== '') {
                        try {
                            const parsedUrls = JSON.parse(image.url);
                            const resolvedUrls = await Promise.all(parsedUrls.map(async (location) => {
                                return await imageKitService.getUrl(location);
                            }));
                            return { ...image, url: resolvedUrls };
                        }
                        catch (parseError) {
                            console.error('Error parsing image URL:', parseError);
                            return { ...image, url: [] };
                        }
                    }
                    return { ...image, url: [] };
                }));
                res.json({ ...product, Images: imagesWithUrls, filepaths: product.Images });
            }
            catch (error) {
                console.error('Error in getProductById:', error);
                res.status(500).json({ error: 'Error getting product' });
            }
        };
        this.createProduct = async (req, res) => {
            try {
                const product = await productService.createProduct(req.body);
                res.status(201).json(product);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating product' });
            }
        };
        this.updateProduct = async (req, res) => {
            try {
                const product = await productService.updateProduct(parseInt(req.params.id), req.body);
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                res.json(product);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating product' });
            }
        };
        this.deleteProduct = async (req, res) => {
            try {
                await productService.deleteProduct(parseInt(req.params.id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting product' });
            }
        };
        this.updateImage = async (req, res) => {
            try {
                const image = await productService.updateImage(parseInt(req.body.id), JSON.stringify(req.body.url), req.body.state, req.body.productId);
                if (!image) {
                    return res.status(400).json({ error: 'Failed to update image' });
                }
                const convertJsonImage = JSON.parse(image.url);
                const urls = convertJsonImage.map((location) => {
                    if (typeof location === 'string' && location.trim() !== '') {
                        try {
                            console.log('location', location);
                            return imageKitService.getUrl(location);
                        }
                        catch (parseError) {
                            console.error('Error parsing image URL:', parseError);
                            return [];
                        }
                    }
                    return [];
                });
                res.json({ id: image.id, urls });
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating product' });
            }
        };
    }
    async createProductsBulk(req, res) {
        try {
            const products = req.body;
            const createdProducts = await productService.createProductsBulk(products);
            res.status(201).json({
                message: 'Products created successfully',
                count: createdProducts.count,
                products: createdProducts,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to create products',
                details: error.message,
            });
        }
    }
    async createImage(req, res) {
        const { url, productId } = req.body;
        const image = await productService.createImage({ url, productId });
        if (!image) {
            return res.status(400).json({ error: 'Failed to create image' });
        }
        const convertJsonImage = JSON.parse(image.url);
        const urls = convertJsonImage.map((location) => {
            if (typeof location === 'string' && location.trim() !== '') {
                try {
                    console.log('location', location);
                    return imageKitService.getUrl(location);
                }
                catch (parseError) {
                    console.error('Error parsing image URL:', parseError);
                    return [];
                }
            }
            return [];
        });
        res.status(201).json(urls);
    }
    async deleteImage(req, res) {
        const id = parseInt(req.params.id);
        await productService.deleteImage(id);
        res.status(204).send();
    }
    async getLatestProducts(req, res) {
        try {
            const products = await productService.getLatestProducts(12);
            const productsWithImages = await Promise.all(products.map(async (product) => {
                const imagesWithUrls = await Promise.all(product.Images.map(async (image) => {
                    if (typeof image.url === 'string' && image.url.trim() !== '') {
                        try {
                            const parsedUrls = JSON.parse(image.url);
                            const resolvedUrls = await Promise.all(parsedUrls.map(async (location) => {
                                return await imageKitService.getUrl(location);
                            }));
                            return { ...image, url: resolvedUrls };
                        }
                        catch (parseError) {
                            console.error('Error parsing image URL:', parseError);
                            return { ...image, url: [] };
                        }
                    }
                    return { ...image, url: [] };
                }));
                return { ...product, Images: imagesWithUrls, filepaths: product.Images };
            }));
            res.status(200).json(productsWithImages);
        }
        catch (error) {
            console.error('Error in getLatestProducts:', error);
            res.status(500).json({ error: 'Error getting latest products' });
        }
    }
    ;
    async getBestSellingProducts(req, res) {
        try {
            const products = await productService.getBestSellingProducts(12);
            const productsWithImages = await Promise.all(products.map(async (product) => {
                const imagesWithUrls = await Promise.all(product.Images.map(async (image) => {
                    if (typeof image.url === 'string' && image.url.trim() !== '') {
                        try {
                            const parsedUrls = JSON.parse(image.url);
                            const resolvedUrls = await Promise.all(parsedUrls.map(async (location) => {
                                return await imageKitService.getUrl(location);
                            }));
                            return { ...image, url: resolvedUrls };
                        }
                        catch (parseError) {
                            console.error('Error parsing image URL:', parseError);
                            return { ...image, url: [] };
                        }
                    }
                    return { ...image, url: [] };
                }));
                return { ...product, Images: imagesWithUrls, filepaths: product.Images };
            }));
            res.status(200).json(productsWithImages);
        }
        catch (error) {
            console.error('Error in getBestSellingProducts:', error);
            res.status(500).json({ error: 'Error getting best selling products' });
        }
    }
    ;
    async getPendingOrderQuantity(req, res) {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }
        const total = await new productService_1.ProductService().getPendingOrderQuantity(productId);
        res.json({ productId, pendingQuantity: total });
    }
}
exports.ProductController = ProductController;
