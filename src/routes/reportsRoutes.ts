import { Router } from 'express';
import { ReportController } from '../controllers/reportsController';

const router = Router();

router.get('/overview', ReportController.getOverview);
router.get('/summary', ReportController.getSummary);
router.get('/orders-by-category', ReportController.getOrderAmountsByCategory);

export default router;