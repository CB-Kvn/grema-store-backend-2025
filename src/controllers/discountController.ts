import { Request, Response } from 'express';
import { DiscountService } from '../services/discountService';


const discountService = new DiscountService();

export class DiscountController {
  async getAll(req: Request, res: Response) {
    const discounts = await discountService.getAll();
    res.json(discounts);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const discount = await discountService.getById(id);
    if (!discount) return res.status(404).json({ error: 'Discount not found' });
    res.json(discount);
  }

  async create(req: Request, res: Response) {
    const discount = await discountService.create(req.body);
    res.status(201).json(discount);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const discount = await discountService.update(id, req.body);
      res.json(discount);
    } catch {
      res.status(404).json({ error: 'Discount not found' });
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      await discountService.delete(id);
      res.status(204).send();
    } catch {
      res.status(404).json({ error: 'Discount not found' });
    }
  }
}