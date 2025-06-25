import { Request, Response } from 'express';
import { ReportService } from '../services/reposrtServices';


export class ReportController {
  static async getSummary(req: Request, res: Response) {
  const { year = new Date().getFullYear() } = req.query;
  const data = await ReportService.getSummary(Number(year));
  res.json(data);
}
  static async getOverview(req: Request, res: Response) {
    const { period = 'month', year = new Date().getFullYear() } = req.query;
    if (!['month', 'quarter', 'semester', 'year'].includes(period as string)) {
      return res.status(400).json({ error: 'Invalid period' });
    }
    const data = await ReportService.getOverview(period as 'month' | 'quarter' | 'semester' | 'year');
    res.json(data);
  }
  static async getOrderAmountsByCategory(req: Request, res: Response) {
    const { year = new Date().getFullYear() } = req.query;
    const data = await ReportService.getOrderAmountsByCategory(Number(year));
    res.json(data);
  }
}