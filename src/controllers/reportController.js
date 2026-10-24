import Expense from "../models/Expense.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validYearMonth = (year, month) => Number.isInteger(Number(year)) && Number(year) >= 2000 && Number(year) <= 2200 && Number.isInteger(Number(month)) && Number(month) >= 1 && Number(month) <= 12;

export const monthlySummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const year = req.query.year ?? now.getFullYear();
  const month = req.query.month ?? (now.getMonth() + 1);
  if (!validYearMonth(year, month)) return res.status(400).json({ message: "year must be 2000-2200 and month must be 1-12" });
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);
  const [summary] = await Expense.aggregate([
    { $match: { date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $project: { _id: 0, total: 1, count: 1 } }
  ]);
  res.json({ year: Number(year), month: Number(month), total: summary?.total ?? 0, count: summary?.count ?? 0 });
});

export const categorySummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) {
      if (Number.isNaN(new Date(startDate).getTime())) return res.status(400).json({ message: "Invalid startDate" });
      match.date.$gte = new Date(startDate);
    }
    if (endDate) {
      if (Number.isNaN(new Date(endDate).getTime())) return res.status(400).json({ message: "Invalid endDate" });
      match.date.$lte = new Date(endDate);
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) return res.status(400).json({ message: "startDate must be on or before endDate" });
  }
  const categories = await Expense.aggregate([
    { $match: match },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, category: "$_id", total: 1, count: 1 } }
  ]);
  res.json({ categories });
});
