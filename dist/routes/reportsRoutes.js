"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportsController_1 = require("../controllers/reportsController");
const router = (0, express_1.Router)();
router.get('/overview', reportsController_1.ReportController.getOverview);
router.get('/summary', reportsController_1.ReportController.getSummary);
router.get('/orders-by-category', reportsController_1.ReportController.getOrderAmountsByCategory);
exports.default = router;
