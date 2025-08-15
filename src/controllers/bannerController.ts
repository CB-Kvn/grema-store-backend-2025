import { Request, Response } from 'express';
import { BannerStatus, CreateBannerData, UpdateBannerData } from '../types';
import { BannerService } from '../services/bannerService';

const bannerService = new BannerService();

export class BannerController {
  async getAll(req: Request, res: Response) {
    try {
      const banners = await bannerService.getAll();
      res.json({
        success: true,
        message: 'Banners retrieved successfully',
        data: banners
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving banners',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const banner = await bannerService.getById(id);
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Banner retrieved successfully',
        data: banner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getActive(req: Request, res: Response) {
    try {
      const banners = await bannerService.getActive();
      res.json({
        success: true,
        message: 'Active banners retrieved successfully',
        data: banners
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving active banners',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const bannerStatus = status.toUpperCase() as BannerStatus;
      
      if (!Object.values(BannerStatus).includes(bannerStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Valid values are: ACTIVE, INACTIVE, EXPIRED'
        });
      }
      
      const banners = await bannerService.getByStatus(bannerStatus);
      res.json({
        success: true,
        message: `Banners with status ${status} retrieved successfully`,
        data: banners
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving banners by status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const bannerData: CreateBannerData = {
        name: req.body.name,
        dateInit: new Date(req.body.dateInit),
        dateEnd: new Date(req.body.dateEnd),
        imageUrl: req.body.imageUrl,
        status: req.body.status
      };
      
      const banner = await bannerService.create(bannerData);
      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateBannerData = {};
      
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.dateInit) updateData.dateInit = new Date(req.body.dateInit);
      if (req.body.dateEnd) updateData.dateEnd = new Date(req.body.dateEnd);
      if (req.body.imageUrl) updateData.imageUrl = req.body.imageUrl;
      if (req.body.status) updateData.status = req.body.status;
      
      const banner = await bannerService.update(id, updateData);
      res.json({
        success: true,
        message: 'Banner updated successfully',
        data: banner
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!Object.values(BannerStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Valid values are: ACTIVE, INACTIVE, EXPIRED'
        });
      }
      
      const banner = await bannerService.updateStatus(id, status);
      res.json({
        success: true,
        message: 'Banner status updated successfully',
        data: banner
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating banner status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await bannerService.delete(id);
      res.json({
        success: true,
        message: 'Banner deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting banner',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}