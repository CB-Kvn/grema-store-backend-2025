import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { PhotoController } from './photoController';
import ImageKitService from '../services/imageKitService';


const productService = new ProductService();
const imageKitService = new ImageKitService();

export class ProductController {

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();

      // Procesa cada producto para agregar las imágenes
      const productsWithImages = await Promise.all(
        products.map(async (product: any) => {
          const imagesWithUrls = await Promise.all(
            product.Images.map(async (image: any) => {
              if (typeof image.url === 'string' && image.url.trim() !== '') {
                try {
                  const parsedUrls = JSON.parse(image.url); // Convierte el string en un array
                  const resolvedUrls = await Promise.all(
                    parsedUrls.map(async (location: string) => {
                      return await imageKitService.getUrl(location);
                    })
                  );
                  return { ...image, url: resolvedUrls }; // Mantén la estructura Images[].url[]
                } catch (parseError) {
                  console.error('Error parsing image URL:', parseError);
                  return { ...image, url: [] }; // Devuelve un array vacío si hay un error
                }
              }
              return { ...image, url: [] }; // Devuelve un array vacío si `url` no es válido
            })
          );

          return { ...product, Images: imagesWithUrls, filepaths: product.Images };
        })
      );

      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ error: 'Error getting products' });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Procesa las imágenes del producto
      const imagesWithUrls = await Promise.all(
        product.Images.map(async (image: any) => {
          if (typeof image.url === 'string' && image.url.trim() !== '') {
            try {
              const parsedUrls = JSON.parse(image.url); // Convierte el string en un array
              const resolvedUrls = await Promise.all(
                parsedUrls.map(async (location: string) => {
                  return await imageKitService.getUrl(location);
                })
              );
              return { ...image, url: resolvedUrls }; // Mantén la estructura Images[].url[]
            } catch (parseError) {
              console.error('Error parsing image URL:', parseError);
              return { ...image, url: [] }; // Devuelve un array vacío si hay un error
            }
          }
          return { ...image, url: [] }; // Devuelve un array vacío si `url` no es válido
        })
      );

      res.json({ ...product, Images: imagesWithUrls, filepaths: product.Images });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({ error: 'Error getting product' });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await productService.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      await productService.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async createProductsBulk(req: Request, res: Response) {
    try {
      const products = req.body;

      // Llama al servicio para crear productos de forma masiva
      const createdProducts = await productService.createProductsBulk(products);

      res.status(201).json({
        message: 'Products created successfully',
        count: createdProducts.count,
        products: createdProducts,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to create products',
        details: error.message,
      });
    }
  }
  async createImage(req: Request, res: Response) {
    const { url, productId } = req.body;
    const image = await productService.createImage({ url, productId }) as any;

    if (!image) {
      return res.status(400).json({ error: 'Failed to create image' });
    }

    const convertJsonImage = JSON.parse(image.url);

    const urls = convertJsonImage.map((location: any) => {
        if (typeof location === 'string' && location.trim() !== '') {
          try {
              console.log('location', location);
            return imageKitService.getUrl(location);
          } catch (parseError) {
            console.error('Error parsing image URL:', parseError);
            return [];
          }
        }
        return [];
      })

    res.status(201).json(urls);
  }

  updateImage = async (req: Request, res: Response) => {
    try {
      const image = await productService.updateImage(
        parseInt(req.body.id),
        JSON.stringify(req.body.url),
        req.body.state,
        req.body.productId
      );
      if (!image) {
        return res.status(400).json({ error: 'Failed to update image' });
      }

      const convertJsonImage = JSON.parse(image.url);

      const urls = convertJsonImage.map((location: any) => {
        if (typeof location === 'string' && location.trim() !== '') {
          try {
              console.log('location', location);
            return imageKitService.getUrl(location);
          } catch (parseError) {
            console.error('Error parsing image URL:', parseError);
            return [];
          }
        }
        return [];
      })
      res.json({ id: image.id, urls });
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  };

  async deleteImage(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await productService.deleteImage(id);
    res.status(204).send();
  }
  
  async getLatestProducts (req: Request, res: Response) {
    try {
      const products = await productService.getLatestProducts(12);

      const productsWithImages = await Promise.all(
        products.map(async (product: any) => {
          const imagesWithUrls = await Promise.all(
            product.Images.map(async (image: any) => {
              if (typeof image.url === 'string' && image.url.trim() !== '') {
                try {
                  const parsedUrls = JSON.parse(image.url);
                  const resolvedUrls = await Promise.all(
                    parsedUrls.map(async (location: string) => {
                      return await imageKitService.getUrl(location);
                    })
                  );
                  return { ...image, url: resolvedUrls };
                } catch (parseError) {
                  console.error('Error parsing image URL:', parseError);
                  return { ...image, url: [] };
                }
              }
              return { ...image, url: [] };
            })
          );
          return { ...product, Images: imagesWithUrls, filepaths: product.Images };
        })
      );

      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Error in getLatestProducts:', error);
      res.status(500).json({ error: 'Error getting latest products' });
    }
  };

  async getBestSellingProducts   (req: Request, res: Response) {
    try {
      const products = await productService.getBestSellingProducts(12);

      const productsWithImages = await Promise.all(
        products.map(async (product: any) => {
          const imagesWithUrls = await Promise.all(
            product.Images.map(async (image: any) => {
              if (typeof image.url === 'string' && image.url.trim() !== '') {
                try {
                  const parsedUrls = JSON.parse(image.url);
                  const resolvedUrls = await Promise.all(
                    parsedUrls.map(async (location: string) => {
                      return await imageKitService.getUrl(location);
                    })
                  );
                  return { ...image, url: resolvedUrls };
                } catch (parseError) {
                  console.error('Error parsing image URL:', parseError);
                  return { ...image, url: [] };
                }
              }
              return { ...image, url: [] };
            })
          );
          return { ...product, Images: imagesWithUrls, filepaths: product.Images };
        })
      );

      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Error in getBestSellingProducts:', error);
      res.status(500).json({ error: 'Error getting best selling products' });
    }
  };
  
  async getPendingOrderQuantity(req: Request, res: Response) {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }
    const total = await new ProductService().getPendingOrderQuantity(productId);
    res.json({ productId, pendingQuantity: total });
  }
}