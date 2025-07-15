"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountService = void 0;
const database_1 = __importDefault(require("../config/database"));
class DiscountService {
    async getAll() {
        return database_1.default.discount.findMany();
    }
    async getById(id) {
        return database_1.default.discount.findUnique({ where: { id } });
    }
    async create(data) {
        return database_1.default.discount.create({ data });
    }
    async update(id, data) {
        return database_1.default.discount.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return database_1.default.discount.delete({ where: { id } });
    }
}
exports.DiscountService = DiscountService;
