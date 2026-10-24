import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: [0.01, "Amount must be greater than zero"] },
  category: { type: String, required: true, trim: true, maxlength: [80, "Category is too long"] },
  date: { type: Date, required: true },
  description: { type: String, trim: true, maxlength: [500, "Description is too long"], default: "" }
}, { timestamps: true });

expenseSchema.index({ date: 1, category: 1 });
export default mongoose.model("Expense", expenseSchema);
