import { Router } from "express";
import { setBudget, budgetStatus } from "../controllers/budgetController.js";

const router = Router();
router.put("/:year/:month", setBudget);
router.get("/:year/:month/status", budgetStatus);
export default router;
