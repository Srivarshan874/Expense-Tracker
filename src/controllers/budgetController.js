import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validYearMonth = (year, month) => Number.isInteger(Number(year)) && Number(year) >= 2000 && Number(year) <= 2200 && Number.isInteger(Number(month)) && Number(month) >= 1 && Number(month) <= 12;

export const setBudget = asyncHandler(async (req, res) => {
  const { year, month } = req.params;
  const { amount } = req.body;
  if (!validYearMonth(year, month)) return res.status(400).json({ message: "Invalid year or month" });
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "amount must be a positive number" });
  const budget = await Budget.findOneAndUpdate(
    { year: Number(year), month: Number(month) }, { amount },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json(budget);
});

export const budgetStatus = asyncHandler(async (req, res) => {
  const { year, month } = req.params;
  if (!validYearMonth(year, month)) return res.status(400).json({ message: "Invalid year or month" });
  const y = Number(year), m = Number(month);
  const start = new Date(y, m - 1, 1), end = new Date(y, m, 1);
  const [budget, summary] = await Promise.all([
    Budget.findOne({ year: y, month: m }),
    Expense.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, spent: { $sum: "$amount" } } }
    ])
  ]);
  if (!budget) return res.status(404).json({ message: "No budget configured for this month" });
  const spent = summary[0]?.spent ?? 0;
  res.json({ year: y, month: m, budget: budget.amount, spent, remaining: budget.amount - spent, overspent: spent > budget.amount });
});
