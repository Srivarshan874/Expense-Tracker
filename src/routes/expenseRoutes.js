import { Router } from "express";
import { createExpense, listExpenses, getExpense, updateExpense, deleteExpense } from "../controllers/expenseController.js";

const router = Router();
router.route("/").post(createExpense).get(listExpenses);
router.route("/:id").get(getExpense).patch(updateExpense).delete(deleteExpense);
export default router;
