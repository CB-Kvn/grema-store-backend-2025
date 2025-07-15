"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reposrtServices_1 = require("../services/reposrtServices");
class ReportController {
    static async getSummary(req, res) {
        const { year = new Date().getFullYear() } = req.query;
        const data = await reposrtServices_1.ReportService.getSummary(Number(year));
        res.json(data);
    }
    static async getOverview(req, res) {
        const { period = 'month', year = new Date().getFullYear() } = req.query;
        if (!['month', 'quarter', 'semester', 'year'].includes(period)) {
            return res.status(400).json({ error: 'Invalid period' });
        }
        const data = await reposrtServices_1.ReportService.getOverview(period);
        res.json(data);
    }
    static async getOrderAmountsByCategory(req, res) {
        const { year = new Date().getFullYear() } = req.query;
        const data = await reposrtServices_1.ReportService.getOrderAmountsByCategory(Number(year));
        res.json(data);
    }
}
exports.ReportController = ReportController;
