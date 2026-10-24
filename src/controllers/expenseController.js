import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isValidDate = (value) => value !== undefined && !Number.isNaN(new Date(value).getTime());
const isValidId = (id) => mongoose.isValidObjectId(id);

export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, description = "" } = req.body;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "amount must be a positive number" });
  if (typeof category !== "string" || !category.trim()) return res.status(400).json({ message: "category is required" });
  if (!isValidDate(date)) return res.status(400).json({ message: "date must be a valid date" });
  const expense = await Expense.create({ amount, category: category.trim(), date, description });
  res.status(201).json(expense);
});

export const listExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate } = req.query;
  const filter = {};
  if (category) filter.$expr = { $eq: [{ $toLower: "$category" }, String(category).toLowerCase()] };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      if (!isValidDate(startDate)) return res.status(400).json({ message: "startDate must be a valid date" });
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      if (!isValidDate(endDate)) return res.status(400).json({ message: "endDate must be a valid date" });
      filter.date.$lte = new Date(endDate);
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) return res.status(400).json({ message: "startDate must be on or before endDate" });
  }
  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
  res.json({ count: expenses.length, expenses });
});

export const getExpense = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid expense ID" });
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json(expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid expense ID" });
  const allowed = ["amount", "category", "date", "description"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (!Object.keys(updates).length) return res.status(400).json({ message: "Provide at least one updatable field" });
  if ("amount" in updates && (typeof updates.amount !== "number" || !Number.isFinite(updates.amount) || updates.amount <= 0)) return res.status(400).json({ message: "amount must be a positive number" });
  if ("category" in updates && (typeof updates.category !== "string" || !updates.category.trim())) return res.status(400).json({ message: "category cannot be empty" });
  if ("date" in updates && !isValidDate(updates.date)) return res.status(400).json({ message: "date must be a valid date" });
  if ("category" in updates) updates.category = updates.category.trim();
  const expense = await Expense.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid expense ID" });
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json({ message: "Expense deleted", id: expense._id });
});
