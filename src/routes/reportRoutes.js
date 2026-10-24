import { Router } from "express";
import { categorySummary, monthlySummary } from "../controllers/reportController.js";

const router = Router();
router.get("/monthly", monthlySummary);
router.get("/categories", categorySummary);
export default router;
