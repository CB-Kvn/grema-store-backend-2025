"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountController = void 0;
const discountService_1 = require("../services/discountService");
const discountService = new discountService_1.DiscountService();
class DiscountController {
    async getAll(req, res) {
        const discounts = await discountService.getAll();
        res.json(discounts);
    }
    async getById(req, res) {
        const id = Number(req.params.id);
        const discount = await discountService.getById(id);
        if (!discount)
            return res.status(404).json({ error: 'Discount not found' });
        res.json(discount);
    }
    async create(req, res) {
        const discount = await discountService.create(req.body);
        res.status(201).json(discount);
    }
    async update(req, res) {
        const id = Number(req.params.id);
        try {
            const discount = await discountService.update(id, req.body);
            res.json(discount);
        }
        catch {
            res.status(404).json({ error: 'Discount not found' });
        }
    }
    async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await discountService.delete(id);
            res.status(204).send();
        }
        catch {
            res.status(404).json({ error: 'Discount not found' });
        }
    }
}
exports.DiscountController = DiscountController;
